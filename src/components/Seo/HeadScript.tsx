import React from 'react';
import { parseScriptTags } from '@/src/lib/script-parser';

interface HeadScriptProps {
  html: string;
}

export default function HeadScript({ html }: HeadScriptProps) {
  if (!html) return null;

  const tags = parseScriptTags(html);

  return (
    <>
      {tags.map((tag, idx) => {
        const { tagName, attrs, content } = tag;
        const key = `${tagName}-${idx}`;

        const reactAttrs = { ...attrs };
        if (reactAttrs.class) {
          reactAttrs.className = reactAttrs.class as string;
          delete reactAttrs.class;
        }

        if (tagName === 'script') {
          return (
            <script
              key={key}
              id={(reactAttrs.id as string) || key}
              {...reactAttrs}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        if (tagName === 'noscript') {
          return (
            <noscript
              key={key}
              {...reactAttrs}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          );
        }
        if (tagName === 'meta') {
          return <meta key={key} {...(reactAttrs as any)} />;
        }
        if (tagName === 'link') {
          return <link key={key} {...(reactAttrs as any)} />;
        }
        return null;
      })}
    </>
  );
}
