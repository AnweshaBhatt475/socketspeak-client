/**
 * Upload a file to Cloudinary
 * @param {File} file - file object to upload
 * @param {string} preset - optional preset name (default: 'chat-app-file')
 * @returns {Promise<Object>} - response JSON from Cloudinary
 */
const uploadFile = async (file, preset = 'chat-app-file') => {
  try {
    if (!file) throw new Error("No file provided for upload");

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) throw new Error("Missing Cloudinary cloud name in env");

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', preset);

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData?.error?.message || 'Upload failed');
    }

    return responseData;
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export default uploadFile;