import React from 'react';
import PosterHeader from './PosterHeader';
import PosterHero from './PosterHero';
import StudentGrid from './StudentGrid';
import PosterFooter from './PosterFooter';

export default function PosterCanvas({ data, forwardRef }) {
  return (
    <div 
      ref={forwardRef}
      id="poster-canvas" 
      className="w-[1080px] h-[1080px] bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#e2e8f0] relative flex flex-col overflow-hidden font-sans shadow-2xl"
    >
      {/* PCB BACKGROUND */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-[0.2]" viewBox="0 0 1080 1080">
          <defs>
              <pattern id="vias-light" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#94a3b8" opacity="0.6"/>
              </pattern>
          </defs>
          <rect width="1080" height="1080" fill="url(#vias-light)" />
          <g stroke="#64748b" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
              <path d="M -10 120 L 80 120 L 120 160 L 250 160 L 300 210 L 400 210" />
              <circle cx="400" cy="210" r="6" fill="#f6b700" stroke="none" />
              <path d="M -10 145 L 60 145 L 90 175 L 140 175" />
              <circle cx="140" cy="175" r="4" fill="#94a3b8" stroke="none" />
              <path d="M 1090 250 L 950 250 L 900 300 L 750 300 L 700 350 L 600 350" />
              <circle cx="600" cy="350" r="6" fill="#f6b700" stroke="none" />
              <path d="M 1090 280 L 980 280 L 930 330 L 870 330" />
              <circle cx="870" cy="330" r="4" fill="#94a3b8" stroke="none" />
              <path d="M -10 750 L 150 750 L 250 850 L 400 850 L 450 900 L 550 900" />
              <circle cx="550" cy="900" r="6" fill="#f6b700" stroke="none" />
              <path d="M 120 750 L 170 700 L 230 700" />
              <circle cx="230" cy="700" r="4" fill="#94a3b8" stroke="none" />
              <path d="M 1090 780 L 920 780 L 870 830 L 720 830 L 670 880" />
              <circle cx="670" cy="880" r="6" fill="#f6b700" stroke="none" />
              <path d="M 280 400 L 280 480 L 230 530" />
              <circle cx="230" cy="530" r="4" fill="#94a3b8" stroke="none" />
              <path d="M 820 480 L 820 580 L 870 630" />
              <circle cx="870" cy="630" r="4" fill="#94a3b8" stroke="none" />
          </g>
          <g stroke="#cbd5e1" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
              <path d="M -20 1020 L 120 1020 L 170 970 L 320 970" />
              <path d="M 1100 100 L 950 100 L 850 200 L 680 200" />
          </g>
      </svg>

      <PosterHeader svnitLogoUrl={data.svnitLogoUrl} />
      <PosterHero 
        offerText={data.offerText} 
        companyLogoUrl={data.companyLogoUrl} 
        studentCount={data.students.length}
      />
      <StudentGrid students={data.students} />
      <PosterFooter />
    </div>
  );
}
