import React, { useState } from 'react';
import { MISSING_AGRICULTURE_IMAGES } from './agricultureMissingImages';

export const AgricultureLessonImage: React.FC<{ fileName: string; alt: string; caption: string }> = ({ fileName, alt, caption }) => {
  const [sourceIndex, setSourceIndex] = useState(0);

  // If the illustration is pending or missing from disk, do not display a broken error box or make 404 network requests
  if (MISSING_AGRICULTURE_IMAGES.has(fileName)) {
    return null;
  }

  const sources = [
    `/images/agriculture/${fileName}`,
    ...(fileName.endsWith('.webp')
      ? [
          `/images/agriculture/${fileName.replace(/\.webp$/, '.jpg')}`,
          `/images/agriculture/${fileName.replace(/\.webp$/, '.png')}`,
        ]
      : []),
  ];

  if (sourceIndex >= sources.length) {
    return null;
  }

  const src = sources[sourceIndex];

  return (
    <figure className="my-4 w-full min-w-0 max-w-2xl overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full max-w-full bg-white object-contain"
        style={{ maxHeight: 'min(360px, 45vh)' }}
        onError={() => setSourceIndex((currentIndex) => currentIndex + 1)}
      />
      <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-600">{caption}</figcaption>
    </figure>
  );
};
