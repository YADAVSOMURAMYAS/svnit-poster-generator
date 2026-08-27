import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import PosterCanvas from './components/poster/PosterCanvas';
import ControlPanel from './components/ControlPanel';
import ImageCropper from './components/ImageCropper';
import { preloadImages } from './utils/imageUtils';
import svnitLogo from './svnit-logo.svg';
import amazonLogo from './assets/amazon_logo.svg';
import studentPlaceholder from './assets/student_placeholder.jpg';

function App() {
  const posterRef = useRef(null);
  // Keep a separate "export data" ref that always has base64 images ready
  const [exportData, setExportData] = useState(null);
  
  const [data, setData] = useState({
    offerText: '6M-Intern',
    companyLogoUrl: amazonLogo,
    svnitLogoUrl: svnitLogo,
    students: [
      { id: 1, name: 'Abhishek Verma', batch: 'B.Tech - 2027', imageUrl: studentPlaceholder }
    ]
  });

  const [cropStudentIndex, setCropStudentIndex] = useState(null);
  const [isEditingLogo, setIsEditingLogo] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (posterRef.current === null) return;
    
    setIsDownloading(true);
    try {
      // Step 1: Pre-convert all images (SVGs, blobs, etc.) to base64 data URLs
      // This prevents html-to-image from trying to fetch them internally and failing
      const resolvedData = await preloadImages(data);

      // Step 2: Temporarily render a hidden clone with resolved data and capture it
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '1080px';
      tempContainer.style.height = '1080px';
      tempContainer.style.zIndex = '-1';
      document.body.appendChild(tempContainer);

      // We import the React DOM render to render our component
      const { createRoot } = await import('react-dom/client');
      const root = createRoot(tempContainer);

      await new Promise((resolve) => {
        root.render(
          <div id="export-canvas-wrapper">
            <PosterCanvas data={resolvedData} />
          </div>
        );
        // Give React a tick to paint
        setTimeout(resolve, 300);
      });

      const exportEl = tempContainer.querySelector('#export-canvas-wrapper > div');

      const dataUrl = await toPng(exportEl, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 1.0,
        width: 1080,
        height: 1080,
        skipFonts: false,
      });

      root.unmount();
      document.body.removeChild(tempContainer);

      const link = document.createElement('a');
      link.download = `poster_${data.students.length}_cards_HighRes.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download poster: ' + (err?.message || String(err)));
    } finally {
      setIsDownloading(false);
    }
  }, [data]);

  const handleCropComplete = (croppedImageUrl) => {
    if (cropStudentIndex !== null) {
      const newStudents = [...data.students];
      newStudents[cropStudentIndex].imageUrl = croppedImageUrl;
      setData({ ...data, students: newStudents });
      setCropStudentIndex(null);
    }
  };

  const handleLogoCropComplete = (croppedLogoUrl) => {
    setData({ ...data, companyLogoUrl: croppedLogoUrl });
    setIsEditingLogo(false);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row w-full min-h-screen lg:h-screen bg-gray-100 lg:overflow-hidden font-sans">
      
      {/* Control Panel (Left Sidebar) */}
      <ControlPanel 
        data={data} 
        setData={setData} 
        onDownload={handleDownload}
        isDownloading={isDownloading}
        setCropStudentIndex={setCropStudentIndex}
        onEditLogo={() => setIsEditingLogo(true)}
      />

      {/* Main Preview Area (Top on mobile, Right on desktop) */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center p-4 lg:p-8 lg:overflow-y-auto bg-gray-800">
        <div className="mb-2 lg:mb-4 text-gray-400 font-medium text-sm lg:text-base">
          Live Preview
        </div>
        
        {/* Wrapper to handle the bounding box of the scaled element so it doesn't cause overflow */}
        {/* Scale 0.3 = 324px, Scale 0.4 = 432px, Scale 0.55 = 594px, Scale 0.6 = 648px, Scale 0.7 = 756px */}
        <div className="
          w-[324px] h-[324px] 
          sm:w-[432px] sm:h-[432px] 
          md:w-[594px] md:h-[594px] 
          lg:w-[648px] lg:h-[648px] 
          xl:w-[756px] xl:h-[756px] 
          relative shrink-0 mb-6 lg:mb-0"
        >
          <div className="
            absolute top-0 left-0 origin-top-left
            scale-[0.3] sm:scale-[0.4] md:scale-[0.55] lg:scale-[0.6] xl:scale-[0.7] 
            shadow-2xl transition-transform duration-300"
          >
            <PosterCanvas data={data} forwardRef={posterRef} />
          </div>
        </div>
      </div>

      {/* Student Photo Cropper Modal */}
      {cropStudentIndex !== null && (
        <ImageCropper 
          mode="person"
          onCropComplete={handleCropComplete} 
          onCancel={() => setCropStudentIndex(null)} 
        />
      )}

      {/* Company Logo Editor Modal */}
      {isEditingLogo && (
        <ImageCropper 
          mode="logo"
          onCropComplete={handleLogoCropComplete}
          onCancel={() => setIsEditingLogo(false)}
        />
      )}
      
    </div>
  );
}

export default App;
