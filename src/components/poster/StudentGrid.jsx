import React from 'react';
import StudentCard from './StudentCard';

export default function StudentGrid({ students }) {
  const count = students.length;

  // Determine grid structure
  let rows = [];
  if (count <= 3) {
    rows.push(students);
  } else if (count === 4) {
    rows.push(students.slice(0, 2));
    rows.push(students.slice(2, 4));
  } else if (count === 5) {
    rows.push(students.slice(0, 3));
    rows.push(students.slice(3, 5));
  } else if (count === 6) {
    rows.push(students.slice(0, 3));
    rows.push(students.slice(3, 6));
  }

  const gapY = count === 4 ? 'gap-y-4' : count > 4 ? 'gap-y-3' : '';
  const gapX = count === 1 ? '' : (count <= 4 ? 'gap-x-16' : 'gap-x-12');

  return (
    <div className="w-full px-8 flex-1 relative z-10 flex flex-col items-center justify-center min-h-0">
      <div className={`flex flex-col items-center ${gapY} w-full`}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex flex-row justify-center ${gapX} w-full`}>
            {row.map((student, idx) => (
              <StudentCard key={student.id || idx} student={student} count={count} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
