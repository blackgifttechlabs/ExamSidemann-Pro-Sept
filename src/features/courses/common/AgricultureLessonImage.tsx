import React, { useState } from 'react';

export const AgricultureLessonImage: React.FC<{ fileName: string; alt: string; caption: string }> = ({ fileName, alt, caption }) => {
  const sources = [
    `/images/agriculture/${fileName}`,
    ...(fileName.endsWith('.webp')
      ? [
          `/images/agriculture/${fileName.replace(/\.webp$/, '.jpg')}`,
          `/images/agriculture/${fileName.replace(/\.webp$/, '.png')}`,
        ]
      : []),
  ];
  const [sourceIndex, setSourceIndex] = useState(0);
  const src = sources[sourceIndex];

  return (
    <figure className="my-4 w-full min-w-0 max-w-2xl overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
      {sourceIndex >= sources.length ? (
        <p role="status" className="px-4 py-8 text-sm text-slate-500">This illustration could not be loaded.</p>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full max-w-full bg-white object-contain"
          style={{ maxHeight: 'min(360px, 45vh)' }}
          onError={() => setSourceIndex((currentIndex) => currentIndex + 1)}
        />
      )}
      <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-600">{caption}</figcaption>
    </figure>
  );
};
