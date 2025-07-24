"use client";
import { useState } from "react";
import imageCompression from "browser-image-compression";
import ImageUploadBody from "./image-upload-body";
import useAzureToken from "@/hooks/Get-Azure-Token";
import { useClient } from "@/context/ClientContext";
import { useImageUpload } from "@/hooks/Barcode-Image-Upload"; // Import the hook

const ImageUpload = () => {
  const [barcode, setBarcode] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isReRender, setIsReRender] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const { clientData } = useClient(); // 👈 use context for Client Login data info
  const { getAzureTokenData } = useAzureToken();
  const { uploadImageToServer } = useImageUpload();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setIsLoading(true); // Start loading

    if (!barcode || !imageFile) {
      setErrorMessage("Please provide both a barcode and an image.");
      setIsLoading(false); // Stop loading
      return;
    }
    try {
      if (
        !getAzureTokenData ||
        !getAzureTokenData.url ||
        !getAzureTokenData.token
      ) {
        setErrorMessage("Azure token not available.");
        setIsLoading(false); // Stop loading
        return;
      }

      // Compress the image
      const compressedImage = await imageCompression(imageFile, {
        maxSizeMB: 0.256, //75kb
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      });

      // Convert compressed image to Blob
      const blbFile = compressedImage;

      const clientId = clientData?.ClientId;
      const asFolder = `${clientId}/barcode`;
      const extension = imageFile.name.split(".").pop();
      const asFile = `${barcode}.${extension}`;
      const url = getAzureTokenData.url;
      const token = getAzureTokenData.token;

      const response = await uploadImageToServer(
        url,
        token,
        asFolder,
        asFile,
        blbFile
      );

      if (response.status === 200) {
        setErrorMessage("");
        setBarcode("");
        setImageFile(null);
        setSuccessMessage("✅ Upload successful");
        setTimeout(() => {
          setSuccessMessage("");
        }, 1500);
        // Trigger re-fetch in child
        setIsReRender(true);
      } else {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        setErrorMessage("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage("An error occurred during upload.");
    } finally {
      setIsLoading(false); // Stop loading in all cases
    }
  };

  return (
    <>
      {successMessage && (
        <div className="fixed top-24 right-4 z-50 bg-green-100 text-green-700 px-4 py-2 rounded-lg shadow-md text-sm animate-slideIn">
          {successMessage}
        </div>
      )}

      <ImageUploadBody
        barcode={barcode}
        setBarcode={setBarcode}
        handleImageChange={handleImageChange}
        handleUpload={handleUpload}
        errorMessage={errorMessage}
        isLoading={isLoading}
        isReRender={isReRender}
        setIsReRender={setIsReRender}
      />
    </>
  );
};

export default ImageUpload;
