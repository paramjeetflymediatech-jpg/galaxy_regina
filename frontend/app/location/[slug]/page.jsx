import Navbar from "@/src/components/Navbar/Navbar";
import PageHero from "@/src/components/PageHero/PageHero";
import Locations from "@/src/components/Locations/MovingCompanyWebsite";

export default function LocationPage({ params }) {
  return (
  <>
<Navbar />
 {/* <PageHero
          title="Movers in Moosomin"
          bgImage="https://galaxymoversregina.ca/wp-content/uploads/2025/07/1708059691_Home-shifting.jpg"
        /> */}
        <Locations/>


  </>
  );
}