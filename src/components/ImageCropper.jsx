import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, Wand2, Loader2, RotateCcw, Upload } from 'lucide-react';

export default function ImageCropper({ onCropComplete, onCancel, mode = 'person' }) {
  const isLogo = mode === 'logo';
  const [imageSrc, setImageSrc] = useState(null);
  const [processedSrc, setProcessedSrc] = useState(null); // after bg removal
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgRemoved, setBgRemoved] = useState(false);

  // The image currently being shown in the cropper
  const activeSrc = processedSrc || imageSrc;

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
      setProcessedSrc(null);
      setBgRemoved(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  const onCropChange = useCallback((crop) => setCrop(crop), []);
  const onCropCompleteCallback = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);
  const onZoomChange = useCallback((zoom) => setZoom(zoom), []);

  const handleRemoveBackground = async () => {
    if (!imageSrc) return;
    setIsRemovingBg(true);
    try {
      const { AutoModel, AutoProcessor, RawImage, env } = await import('@huggingface/transformers');

      env.allowLocalModels = false;

      const model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
        config: { model_type: 'custom' },
      });
      const processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
        config: { do_normalize: true, do_pad: false, do_rescale: true, do_resize: true,
          image_mean: [0.5, 0.5, 0.5], image_std: [1, 1, 1], resample: 2,
          rescale_factor: 0.00392156862745098, size: { width: 1024, height: 1024 } }
      });

      const rawImage = await RawImage.fromURL(imageSrc);
      const { pixel_values } = await processor(rawImage);

      // RMBG-1.4 expects the key to be 'input', not 'input_images'
      const { output } = await model({ input: pixel_values });

      // output[0] is shape [1, 1, 1024, 1024] — squeeze to [1024, 1024]
      const maskTensor = output[0].squeeze();
      // Use .data which is a raw Float32Array (values 0..1)
      const maskData = Array.from(maskTensor.data);
      const maskSize = Math.round(Math.sqrt(maskData.length));

      const resultUrl = await applyMaskToImage(imageSrc, rawImage.width, rawImage.height, maskData, maskSize);

      setProcessedSrc(resultUrl);
      setBgRemoved(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    } catch (err) {
      console.error('Background removal failed:', err);
      alert('Background removal failed: ' + (err?.message || err));
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleResetBg = () => {
    setProcessedSrc(null);
    setBgRemoved(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(activeSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-bold text-gray-800">{isLogo ? 'Edit Company Logo' : 'Edit Photo'}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {isLogo ? 'Remove background for a clean transparent logo' : 'Remove background, then crop to circle'}
            </p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500 transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
          
          {/* Step 1: Upload */}
          {!imageSrc ? (
            <div className="w-full h-56 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center bg-gray-50 gap-3">
              <Upload size={32} className="text-gray-300" />
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" id="photo-upload" />
              <label htmlFor="photo-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
                Choose Photo
              </label>
              <p className="text-gray-400 text-xs">JPG, PNG, WEBP supported</p>
            </div>
          ) : (
            <>
              {/* Crop Area */}
              <div className={`relative w-full h-72 rounded-xl overflow-hidden ${bgRemoved ? 'bg-[url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAeSURBVDiNY2D4z8BQT2c2MFCpgVEDRg0YNYAuAABFiAIBMCqFdAAAAABJRU5ErkJggg==)] bg-repeat bg-[length:16px_16px]' : 'bg-gray-900'}`}>
                <Cropper
                  image={activeSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={isLogo ? 3 / 1 : 1}
                  cropShape={isLogo ? 'rect' : 'round'}
                  showGrid={isLogo}
                  onCropChange={onCropChange}
                  onCropComplete={onCropCompleteCallback}
                  onZoomChange={onZoomChange}
                />
              </div>

              {/* Zoom Slider */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.05}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Background Removal Toolbar */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Wand2 size={16} className="text-purple-600 shrink-0" />
                <span className="text-sm text-gray-700 font-medium flex-1">
                  {bgRemoved ? 'Background removed ✓' : 'Remove background using AI'}
                </span>
                {bgRemoved ? (
                  <button
                    onClick={handleResetBg}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
                  >
                    <RotateCcw size={13} /> Restore
                  </button>
                ) : (
                  <button
                    onClick={handleRemoveBackground}
                    disabled={isRemovingBg}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium transition-colors"
                  >
                    {isRemovingBg
                      ? <><Loader2 size={13} className="animate-spin" /> Processing…</>
                      : <><Wand2 size={13} /> Remove BG</>
                    }
                  </button>
                )}
              </div>
              {isRemovingBg && (
                <p className="text-xs text-center text-purple-600 -mt-2">
                  ✨ AI model loading… this may take ~10s on first run
                </p>
              )}

              {/* Change photo link */}
              <div className="text-center -mt-1">
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" id="photo-reupload" />
                <label htmlFor="photo-reupload" className="text-xs text-blue-600 hover:underline cursor-pointer">
                  Change photo
                </label>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-200 transition-colors text-sm">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!imageSrc}
            className="px-5 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors text-sm"
          >
            <Check size={16} /> Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.src = url;
  });

/**
 * Composites a grayscale alpha mask onto the original image.
 * maskFlat: Float32Array values 0..1 at maskSize x maskSize resolution.
 * 1 = foreground (keep), 0 = background (transparent).
 */
async function applyMaskToImage(imageSrc, origWidth, origHeight, maskFlat, maskSize) {
  const img = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = origWidth;
  canvas.height = origHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, origWidth, origHeight);

  const imageData = ctx.getImageData(0, 0, origWidth, origHeight);
  const data = imageData.data;

  for (let y = 0; y < origHeight; y++) {
    for (let x = 0; x < origWidth; x++) {
      const maskX = Math.min(Math.round((x / origWidth) * maskSize), maskSize - 1);
      const maskY = Math.min(Math.round((y / origHeight) * maskSize), maskSize - 1);
      const maskVal = maskFlat[maskY * maskSize + maskX];
      data[(y * origWidth + x) * 4 + 3] = Math.round(maskVal * 255);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return new Promise((resolve) =>
    canvas.toBlob((b) => resolve(URL.createObjectURL(b)), 'image/png')
  );
}

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob)), 'image/png');
  });
}
