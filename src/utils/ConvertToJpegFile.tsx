const ConvertImageToJpgFile = async (imageFile: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Failed to get canvas context");

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Conversion to JPG failed");

            const newFileName = imageFile.name.replace(/\.\w+$/, ".jpg");

            // Force MIME type to 'image/jpg' (non-standard)
            const newFile = new File([blob], newFileName, {
              type: "image/jpg",
            });

            resolve(newFile);
          },
          "image/jpeg", // Canvas API only accepts "image/jpeg"
          0.9
        );
      };

      img.onerror = () => reject("Failed to load image for conversion");
      img.src = reader.result as string;
    };

    reader.onerror = () => reject("Failed to read image file");
    reader.readAsDataURL(imageFile);
  });
};

export default ConvertImageToJpgFile;
