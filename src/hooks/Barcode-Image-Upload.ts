export const useImageUpload = () => {
  const uploadImageToServer = async (
    url: string,
    token: string,
    asFolder: string,
    asFile: string,
    blbFile: Blob
  ) => {
    const formData = new FormData();
    formData.append("url", url);
    formData.append("token", token);
    formData.append("asFolder", asFolder);
    formData.append("asFile", asFile);
    formData.append("blbFile", blbFile);
    

    const response = await fetch("/api/barcode-image-upload", {
      method: "POST",
      body: formData,
    });

    return response;
  };

  return { uploadImageToServer };
};
