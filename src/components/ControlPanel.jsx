import React, { useRef } from 'react';
import { Upload, Download, Users, PlusCircle, Trash2, Crop, Loader2 } from 'lucide-react';

export default function ControlPanel({ data, setData, onDownload, setCropStudentIndex, isDownloading, onEditLogo }) {
  
  const handleStudentChange = (index, field, value) => {
    const newStudents = [...data.students];
    newStudents[index][field] = value;
    setData({ ...data, students: newStudents });
  };

  const handleStudentCountChange = (e) => {
    const count = parseInt(e.target.value);
    let newStudents = [...data.students];
    
    if (count > newStudents.length) {
      // Add students
      for (let i = newStudents.length; i < count; i++) {
        newStudents.push({ id: Date.now() + i, name: '', batch: 'B.Tech - 2027', imageUrl: null });
      }
    } else if (count < newStudents.length) {
      // Remove students
      newStudents = newStudents.slice(0, count);
    }

    setData({ ...data, students: newStudents });
  };

  const handleCompanyLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData({ ...data, companyLogoUrl: url });
    }
  };

  const handleSvnitLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData({ ...data, svnitLogoUrl: url });
    }
  };

  return (
    <div className="w-full lg:w-[400px] bg-white h-[45vh] lg:h-screen shrink-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 p-6 flex flex-col shadow-lg z-20">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Users className="text-blue-600" /> Poster Generator
      </h2>

      <div className="space-y-6">
        
        {/* Global Settings */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Global Settings</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Students</label>
            <select 
              value={data.students.length} 
              onChange={handleStudentCountChange}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            >
              {[1,2,3,4,5,6].map(num => <option key={num} value={num}>{num} {num === 1 ? 'Student' : 'Students'}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Text</label>
            <input 
              type="text" 
              value={data.offerText} 
              onChange={e => setData({...data, offerText: e.target.value})}
              placeholder="e.g. 6M-Intern"
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleCompanyLogoUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {data.companyLogoUrl && (
              <button
                onClick={onEditLogo}
                className="mt-2 w-full flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 py-1.5 rounded-md text-xs font-medium transition-colors border border-purple-200"
              >
                <Crop size={13} /> Edit Logo / Remove BG
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College Logo (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleSvnitLogoUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>
        </div>

        {/* Student Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Student Details</h3>
          
          {data.students.map((student, index) => (
            <div key={student.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
              <div className="absolute -left-2 -top-2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                {index + 1}
              </div>
              
              <div className="mb-3 mt-2">
                <input 
                  type="text" 
                  value={student.name} 
                  onChange={e => handleStudentChange(index, 'name', e.target.value)}
                  placeholder="Student Name"
                  className="w-full border-b border-gray-300 focus:border-blue-500 px-1 py-1 outline-none font-semibold text-gray-800"
                />
              </div>
              
              <div className="mb-3">
                <input 
                  type="text" 
                  value={student.batch} 
                  onChange={e => handleStudentChange(index, 'batch', e.target.value)}
                  placeholder="Batch (e.g. B.Tech - 2027)"
                  className="w-full border-b border-gray-300 focus:border-blue-500 px-1 py-1 outline-none text-sm text-gray-600"
                />
              </div>

              <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setCropStudentIndex(index)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    <Crop size={16} /> {student.imageUrl ? 'Edit Photo' : 'Add Photo'}
                  </button>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:opacity-60 disabled:cursor-wait text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
        >
          {isDownloading 
            ? <><Loader2 size={20} className="animate-spin" /> Generating PNG...</>
            : <><Download size={20} /> Download High-Res Poster</>
          }
        </button>
      </div>
    </div>
  );
}
