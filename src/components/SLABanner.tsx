import React from 'react';

interface SLABannerProps {
  title: string;
}

export default function SLABanner({ title }: SLABannerProps) {
  return (
    <div className="bg-[#1d2d5b] text-white px-6 py-4 rounded-xl shadow-sm text-center font-semibold text-lg md:text-xl tracking-wide uppercase">
      {title}
    </div>
  );
}