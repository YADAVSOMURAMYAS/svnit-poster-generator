import React from 'react';

export default function StudentCard({ student, count }) {
  // 4-tier sizing so cards always fit inside 1080×1080px canvas
  // Tier A: 1 student  — large showcase
  // Tier B: 2-3 students — medium, single row
  // Tier C: 4 students  — 2×2 grid, compact cards needed
  // Tier D: 5-6 students — 2×3 grid, small cards
  const tier = count === 1 ? 'A' : count <= 3 ? 'B' : count === 4 ? 'C' : 'D';

  const cardWidth = { A: 'w-[360px]', B: 'w-[280px]', C: 'w-[240px]', D: 'w-[210px]' }[tier];
  const padding   = { A: 'p-10',      B: 'p-8',       C: 'p-5',       D: 'p-5'       }[tier];
  const rounded   = { A: 'rounded-[2.5rem]', B: 'rounded-[2rem]', C: 'rounded-[2rem]', D: 'rounded-[1.5rem]' }[tier];
  
  const imgSize   = { A: 'w-64 h-64 border-[6px]', B: 'w-44 h-44 border-[5px]', C: 'w-36 h-36 border-[4px]', D: 'w-32 h-32 border-[4px]' }[tier];
  const imgMb     = { A: 'mb-6', B: 'mb-4', C: 'mb-2', D: 'mb-2' }[tier];
  
  const nameSize  = { A: 'text-[1.65rem]', B: 'text-[1.4rem]', C: 'text-[1.15rem]', D: 'text-[1.1rem]' }[tier];
  const batchSize = { A: 'text-[1.1rem]',  B: 'text-[1rem]',   C: 'text-[0.85rem]', D: 'text-[0.8rem]' }[tier];
  const batchMt   = { A: 'mt-2', B: 'mt-1', C: 'mt-1', D: 'mt-0.5' }[tier];

  return (
    <div className={`flex flex-col items-center ${cardWidth} glass-card-light ${padding} ${rounded} shadow-md`}>
        <div className={`${imgSize} rounded-full ${imgMb} border-[var(--color-svnit-gold)] overflow-hidden bg-gradient-to-br from-blue-50 to-blue-200 shadow-[inset_0_4px_10px_rgba(0,0,0,0.15)]`}>
            {student.imageUrl ? (
              <img 
                src={student.imageUrl} 
                alt={student.name || "Student"} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                Photo
              </div>
            )}
        </div>
        <h4 className={`text-[var(--color-navy)] ${nameSize} font-extrabold text-center leading-tight`}>
            {student.name || 'Student Name'}
        </h4>
        <p className={`text-accent-gradient font-bold ${batchSize} ${batchMt} tracking-wider uppercase`}>
            {student.batch || 'B.Tech - 2027'}
        </p>
    </div>
  );
}
