import 'dotenv/config';
import fs from 'fs';

import { sequelize } from './src/lib/db';
import { State, District, Location, Service, ServiceLocation, Seo } from './src/lib/models';

const BATCH_SIZE = 100;

const slugify = (text) => {
  if (!text) return '';
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const SERVICE_NAMES = {
  'residential-moving': 'Residential Moving',
  'commercial-office-moves': 'Commercial & Office Moves',
  'long-distance-relocations': 'Long Distance Relocations',
  'professional-packing-services': 'Professional Packing Services',
  'furniture-disassembly-assembly': 'Furniture Disassembly & Assembly',
  'secure-storage-solutions': 'Secure Storage Solutions'
};

function getServiceName(slug) {
  if (SERVICE_NAMES[slug]) return SERVICE_NAMES[slug];
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

async function bulkUpsert(Model, rows, conflictFields, updateFields) {
  if (rows.length === 0) return;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);
    await Model.bulkCreate(chunk, {
      updateOnDuplicate: updateFields,
      conflictAttributes: conflictFields,
    });
    process.stdout.write(`\r  ↳ Bulk upserted ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length}`);
  }
  console.log('');
}

async function main() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Connected.\n');

    const jsonPath = 'servicecontant.json';
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`File not found: ${jsonPath}`);
    }

    console.log(`Reading ${jsonPath}...`);
    const entries = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${entries.length} entries.\n`);

    // ──────────────────────────────────────────────
    // PHASE 1: Warm in-memory caches from DB
    // ──────────────────────────────────────────────
    console.log('📦 Loading existing DB records into cache...');
    const existingStates    = await State.findAll();
    const existingDistricts = await District.findAll();
    const existingLocations = await Location.findAll();
    const existingServices  = await Service.findAll();

    const stateCache    = {};  // lowercase name → state obj
    const districtMap   = {};  // state.id → district obj
    const locationCache = {};  // `${state.id}_${lowercase city}` → location obj
    const slugSet       = new Set();  // all existing location slugs
    const serviceCache  = {};  // slug → service obj

    existingStates.forEach(s => { stateCache[s.name.toLowerCase()] = s; });
    existingDistricts.forEach(d => { if (!districtMap[d.province_id]) districtMap[d.province_id] = d; });
    existingLocations.forEach(l => {
      locationCache[`${l.province_id}_${l.location_name.toLowerCase()}`] = l;
      slugSet.add(l.slug);
    });
    existingServices.forEach(s => { serviceCache[s.slug] = s; });

    console.log(`  States: ${existingStates.length}, Districts: ${existingDistricts.length}, Locations: ${existingLocations.length}, Services: ${existingServices.length}\n`);

    // ──────────────────────────────────────────────
    // PHASE 2: Build missing States, Districts, Locations, Services
    // ──────────────────────────────────────────────
    console.log('🏗️  Resolving States, Locations & Services...');

    const newStates    = [];
    const newDistricts = [];
    const newLocations = [];
    const newServices  = [];

    // Collect unique values first (avoid duplicates across entries)
    const pendingStates    = new Map(); // lowercase name → name
    const pendingLocations = new Map(); // key → {city, stateLower}
    const pendingServices  = new Map(); // slug → slug

    for (const entry of entries) {
      const { city, state: stateName, service_slug: serviceSlug } = entry;
      if (!city || !stateName || !serviceSlug) continue;

      const stateLower = stateName.toLowerCase();
      pendingStates.set(stateLower, stateName);

      const locationKey = `${stateLower}_${city.toLowerCase()}`;
      pendingLocations.set(locationKey, { city, stateLower });

      pendingServices.set(serviceSlug, serviceSlug);
    }

    // Create missing States one-by-one (usually very few — one per province)
    for (const [lower, name] of pendingStates) {
      if (!stateCache[lower]) {
        const s = await State.create({ name, slug: slugify(name), is_active: true });
        stateCache[lower] = s;
        console.log(`  + State: ${name}`);
      }
    }

    // Create missing Districts (one per state — only if none exists)
    for (const [lower] of pendingStates) {
      const state = stateCache[lower];
      if (state && !districtMap[state.id]) {
        const districtName = `${state.name} Region`;
        const distSlug = slugify(districtName);
        const d = await District.create({ name: districtName, slug: distSlug, province_id: state.id });
        districtMap[state.id] = d;
        console.log(`  + District: ${districtName}`);
      }
    }

    // Collect missing Locations for bulk insert
    for (const [key, { city, stateLower }] of pendingLocations) {
      const state = stateCache[stateLower];
      if (!state) continue;

      const cacheKey = `${state.id}_${city.toLowerCase()}`;
      if (locationCache[cacheKey]) continue; // already exists

      const district = districtMap[state.id];
      const baseSlug = slugify(city);
      let finalSlug = baseSlug;
      if (slugSet.has(finalSlug)) {
        finalSlug = `${baseSlug}-${slugify(state.name)}`;
        if (slugSet.has(finalSlug)) {
          finalSlug = `${finalSlug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        }
      }
      slugSet.add(finalSlug);

      newLocations.push({
        location_name: city,
        slug: finalSlug,
        province_id: state.id,
        district_id: district ? district.id : null,
        _cacheKey: cacheKey,
      });
    }

    // Collect missing Services for bulk insert
    for (const [slug] of pendingServices) {
      if (!serviceCache[slug]) {
        const name = getServiceName(slug);
        newServices.push({
          title: name,
          slug,
          short_description: `Professional ${name} services by Galaxy Movers.`,
          content: `<p>We offer premium ${name} solutions tailored to your needs.</p>`,
          faqs: JSON.stringify([]),
          is_active: true,
        });
      }
    }

    // Bulk insert new Locations
    if (newLocations.length > 0) {
      console.log(`\n⬆️  Inserting ${newLocations.length} new Locations...`);
      const toInsert = newLocations.map(({ _cacheKey, ...row }) => row);
      const created = await Location.bulkCreate(toInsert, { returning: true });
      created.forEach((l, idx) => {
        locationCache[newLocations[idx]._cacheKey] = l;
      });
      console.log(`  ✅ Inserted ${created.length} Locations.`);
    }

    // Bulk insert new Services
    if (newServices.length > 0) {
      console.log(`\n⬆️  Inserting ${newServices.length} new Services...`);
      const created = await Service.bulkCreate(newServices, { returning: true });
      created.forEach(s => { serviceCache[s.slug] = s; });
      console.log(`  ✅ Inserted ${created.length} Services.`);
    }

    // ──────────────────────────────────────────────
    // PHASE 3: Build ServiceLocation & SEO bulk upsert rows
    // ──────────────────────────────────────────────
    console.log('\n🔗 Building ServiceLocation & SEO upsert rows...');

    const slRows  = [];
    const seoRows = [];
    let skipped = 0;

    for (const entry of entries) {
      const {
        city, state: stateName, service_slug: serviceSlug,
        content, faqs,
        meta_title, meta_description, og_title, og_description,
        canonical_url, keywords,
        path: pagePath
      } = entry;

      if (!city || !stateName || !serviceSlug) { skipped++; continue; }

      const state    = stateCache[stateName.toLowerCase()];
      const location = locationCache[`${state?.id}_${city.toLowerCase()}`];
      const service  = serviceCache[serviceSlug];

      if (!state || !location || !service) {
        console.warn(`  ⚠️ Skipping entry (missing ref): city=${city}, state=${stateName}, service=${serviceSlug}`);
        skipped++;
        continue;
      }

      slRows.push({
        service_id:  service.id,
        location_id: location.id,
        description: meta_description || null,
        content:     content || null,
        faqs:        JSON.stringify(faqs || []),
      });

      if (pagePath) {
        seoRows.push({
          page_path:   pagePath,
          title:       meta_title || null,
          description: meta_description || null,
          keywords:    keywords || null,
          canonical_url: canonical_url || null,
          og_title:    og_title || null,
          og_description: og_description || null,
        });
      }
    }

    console.log(`  ServiceLocation rows: ${slRows.length}, SEO rows: ${seoRows.length}, Skipped: ${skipped}`);

    // ──────────────────────────────────────────────
    // PHASE 4: Bulk upsert ServiceLocations
    // ──────────────────────────────────────────────
    console.log(`\n⬆️  Bulk upserting ${slRows.length} ServiceLocation rows (batch=${BATCH_SIZE})...`);
    await bulkUpsert(
      ServiceLocation,
      slRows,
      ['service_id', 'location_id'],
      ['description', 'content', 'faqs', 'updated_at']
    );
    console.log('  ✅ ServiceLocations done.');

    // ──────────────────────────────────────────────
    // PHASE 5: Bulk upsert SEO records
    // ──────────────────────────────────────────────
    console.log(`\n⬆️  Bulk upserting ${seoRows.length} SEO rows (batch=${BATCH_SIZE})...`);
    await bulkUpsert(
      Seo,
      seoRows,
      ['page_path'],
      ['title', 'description', 'keywords', 'canonical_url', 'og_title', 'og_description', 'updated_at']
    );
    console.log('  ✅ SEO records done.');

    console.log('\n==================================================');
    console.log('✅ Database Import Completed Successfully!');
    console.log(`  Entries processed : ${slRows.length + skipped}`);
    console.log(`  ServiceLocations  : ${slRows.length} upserted`);
    console.log(`  SEO records       : ${seoRows.length} upserted`);
    console.log(`  Skipped           : ${skipped}`);
    console.log('==================================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  }
}

main();
