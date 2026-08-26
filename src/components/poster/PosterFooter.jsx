import React from 'react';

export default function PosterFooter() {
  return (
    <div className="w-full shrink-0 relative z-10 pt-4">
        <div className="text-center pb-4">
            <p className="text-gray-700 text-[1.05rem] font-bold tracking-widest uppercase">
                We convey our best wishes for their future successes and achievements
            </p>
        </div>
        <div className="w-full bg-[var(--color-svnit-gold)] py-3 px-16 flex justify-between items-center shadow-[0_-4px_20px_rgba(246,183,0,0.2)]">
            <span className="text-[var(--color-navy)] font-black text-[1.1rem] tracking-widest">DoECE</span>
            <span className="text-[var(--color-navy)] font-bold text-[1.1rem] tracking-wide">cdc@eced.svnit.ac.in</span>
        </div>
    </div>
  );
}
