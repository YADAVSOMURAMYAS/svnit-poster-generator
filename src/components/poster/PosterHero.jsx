import React from 'react';

export default function PosterHero({ offerText, companyLogoUrl, studentCount }) {
  // 4-tier size system — only text/spacing shrinks, logo stays fixed
  const tier = studentCount <= 2 ? 1 : studentCount === 3 ? 2 : studentCount === 4 ? 3 : 4;

  const topMt     = ['', 'mt-8', 'mt-4', 'mt-1', 'mt-1'][tier];
  const h1Size    = ['', 'text-[7.5rem]', 'text-[6.5rem]', 'text-[4.2rem]', 'text-[4rem]'][tier];
  const h1Mb      = ['', 'mb-4', 'mb-2', 'mb-1', 'mb-0'][tier];
  const gap       = ['', 'gap-5', 'gap-3', 'gap-2', 'gap-1'][tier];
  const lineWidth = ['', 'w-20', 'w-16', 'w-10', 'w-8'][tier];
  const pSize     = ['', 'text-[1.15rem]', 'text-[0.9rem]', 'text-[0.75rem]', 'text-[0.7rem]'][tier];
  const imgMt     = ['', 'mt-6', 'mt-3', 'mt-1', 'mt-1'][tier];
  const imgMb     = ['', 'mb-8', 'mb-4', 'mb-2', 'mb-1'][tier];

  // Logo container: fixed height (h-16 = 64px) and a max-width — never shrinks
  // The img uses object-contain so aspect ratio is preserved but the logo always
  // scales UP to fill the full 64px height, whether it's a wide SVG or a small PNG.
  return (
    <div className={`text-center ${topMt} relative z-10 w-full flex flex-col items-center shrink-0`}>
        <h1 className={`text-[var(--color-svnit-red)] ${h1Size} font-script leading-[0.8] ${h1Mb} drop-shadow-sm`}>
            Congratulations
        </h1>
        
        <div className={`flex items-center ${gap}`}>
            <div className={`${lineWidth} h-[2px] bg-gray-300`}></div>
            <p className={`text-gray-600 tracking-widest uppercase font-medium ${pSize}`}>
                for getting <span className="text-[var(--color-navy)] font-extrabold">{offerText || "6M-Intern"}</span> offer from
            </p>
            <div className={`${lineWidth} h-[2px] bg-gray-300`}></div>
        </div>
        
        {/* Fixed bounding box: h-16 × w-52 (208px). object-contain scales any logo 
            to fit inside, so wide logos (Amazon) and compact logos (ABInBev) 
            both occupy the same visual footprint on the poster. */}
        <div className={`flex items-center justify-center ${imgMt} ${imgMb} h-16 w-52 overflow-hidden`}>
            {companyLogoUrl ? (
                <img 
                  src={companyLogoUrl} 
                  alt="Company Logo" 
                  className="w-full h-full object-contain drop-shadow-md"
                />
            ) : (
                <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    Upload Company Logo
                </div>
            )}
        </div>
    </div>
  );
}
