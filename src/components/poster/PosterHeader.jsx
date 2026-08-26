import React from 'react';

export default function PosterHeader({ svnitLogoUrl }) {
  return (
    <div className="w-full pt-10 px-8 grid grid-cols-[140px_1fr_140px] items-center relative z-10 shrink-0">
        <div className="w-[140px] h-[140px] flex items-center justify-center drop-shadow-md">
            {svnitLogoUrl && <img src={svnitLogoUrl} alt="SVNIT Logo" className="w-full h-full object-contain" />}
        </div>
        <div className="text-center flex flex-col items-center justify-center">
            <h1 className="text-[var(--color-navy)] text-[1.5rem] font-bold uppercase tracking-[0.12em] leading-snug">
                Sardar Vallabhbhai National Institute<br />Of Technology, Surat
            </h1>
            <h2 className="text-[#034ea2] text-[1.35rem] font-black uppercase tracking-[0.18em] mt-2">
                Department Of Electronics
            </h2>
        </div>
        <div className="w-[140px]"></div>
    </div>
  );
}
