import React, { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  category = 'In-Store Product'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 text-slate-500 p-2 text-center select-none rounded-lg border border-slate-200/60 ${className}`}
      >
        <span className="material-symbols-outlined text-[28px] text-blue-500 mb-1">
          shopping_basket
        </span>
        <span className="text-[11px] font-bold text-slate-700 line-clamp-1 px-1">
          {alt}
        </span>
        <span className="text-[9px] text-blue-600 font-medium uppercase tracking-wider">
          {category}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};
