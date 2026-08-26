/**
 * Converts an image URL (including SVGs and blobs) to a base64 data URL.
 * This is required for html-to-image to work correctly, as it cannot
 * serialize cross-origin or SVG resources on its own.
 */
export async function toDataUrl(url) {
  if (!url) return null;
  // Already a data URL — skip
  if (url.startsWith('data:')) return url;

  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Takes a data object containing image URLs and returns a new data object
 * where every image URL has been converted to a base64 data URL.
 */
export async function preloadImages(data) {
  const [svnitLogoData, companyLogoData, ...studentImageDatas] = await Promise.all([
    toDataUrl(data.svnitLogoUrl),
    toDataUrl(data.companyLogoUrl),
    ...data.students.map((s) => toDataUrl(s.imageUrl)),
  ]);

  return {
    ...data,
    svnitLogoUrl: svnitLogoData,
    companyLogoUrl: companyLogoData,
    students: data.students.map((s, i) => ({
      ...s,
      imageUrl: studentImageDatas[i],
    })),
  };
}
