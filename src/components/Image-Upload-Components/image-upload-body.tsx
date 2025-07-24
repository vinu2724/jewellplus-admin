"use client";
import { useClient } from "@/context/ClientContext";
import useBarcodeMain from "@/hooks/Barcode-Main";
import useAzureToken from "@/hooks/Get-Azure-Token";
import { useGetBarcodeImage } from "@/hooks/Get-Barcode-Image";
import useItemList from "@/hooks/Item-List";
import Image from "next/image";
import Loader from "@/components/Loader/Loader"; // Assuming your Loader component path
import React, { useEffect, useRef, useState } from "react";
import { FaCamera } from "react-icons/fa";

import Feedback from "@/utils/Alert";
import { Loader2 } from "lucide-react";
import Button from "@/utils/Button";

interface Props {
  barcode: string;
  setBarcode: React.Dispatch<React.SetStateAction<string>>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: (e: React.FormEvent) => void;
  errorMessage: string;
  isLoading: boolean;
  isReRender: boolean;
  setIsReRender: React.Dispatch<React.SetStateAction<boolean>>;
}

const ImageUploadBody: React.FC<Props> = ({
  barcode,
  setBarcode,
  handleImageChange,
  handleUpload,
  errorMessage,
  isLoading,
  isReRender,
  setIsReRender,
}) => {
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [largeImageUrl, setLargeImageUrl] = useState<string | null>(null);
  const [Update, setUpdate] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [captureImagePre, setCaptureImagePre] = useState(false);
  const [retake, setRetake] = useState(false);

  const { clientData } = useClient();
  const { getAzureTokenData } = useAzureToken();
  const { getImageFromAzure } = useGetBarcodeImage();
  const { ItemdropDown } = useItemList();
  const { barcodeMain, fetchBarcodeMain } = useBarcodeMain();
  const [barcodeInput, setBarcodeInput] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileCameraRef = useRef<HTMLInputElement>(null);

  const handleBarcodeEnter = async () => {
    // Reset right side (camera, preview, image, etc.)
    setUploadPreview(null);
    setImageLoading(true); // Start loading
    setUploadedImageUrl(null);
    setIsCameraStarted(false);
    setStream(null);
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (mobileCameraRef.current) {
      mobileCameraRef.current.value = "";
    }
    setShowLargeImage(false); // Close large image view if open
    setLargeImageUrl(null);
    if (barcodeInput.length >= 3 && barcodeInput.length <= 10) {
      setBarcode(barcodeInput);

      // Now fetch new data
      const mainRes = await fetchBarcodeMain(barcodeInput);

      // If your fetchBarcodeMain returns { status, data }
      if (
        mainRes?.status === 404 ||
        !mainRes?.data ||
        !Array.isArray(mainRes.data) ||
        mainRes.data.length === 0
      ) {
        setMessage("Barcode Not Found.");
        setTitle("error");
        setTimeout(() => setMessage(null), 3000);
        return;
      }

      // Fetch image only when barcode is valid and entered
      if (
        barcodeInput &&
        getAzureTokenData?.url &&
        getAzureTokenData?.token &&
        clientData?.ClientId
      ) {
        const imageUrl = await getImageFromAzure(
          getAzureTokenData.url,
          getAzureTokenData.token,
          `${clientData.ClientId}/barcode`,
          barcodeInput
        );
        setUploadedImageUrl(imageUrl);
        setImageLoading(false); // Stop loading after fetch
      } else {
        setUploadedImageUrl(null);
        setImageLoading(false); // Stop loading if not fetching
      }
    } else {
    }
  };

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setUploadPreview(imageUrl);
    setCaptureImagePre(true);
    setUseCamera(true);
    handleImageChange(e); // Ensure this sets form data properly
  };
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  const startCamera = async () => {
    setUseCamera(true);
    setCaptureImagePre(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraStarted(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };
  const cancelCamera = () => {
    setRetake(false);
    setCaptureImagePre(true);

    // Stop all video tracks
    setCaptureImagePre(false);
    stream?.getTracks().forEach((track) => track.stop());

    // Clear preview and reset state
    setUploadPreview(null);
    setIsCameraStarted(false); // optional if you're using this flag to show/hide video
  };

  const capturePhoto = () => {
    setRetake(true);
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (video && ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setUploadPreview(dataUrl);
      const file = dataURLtoFile(dataUrl, "captured.jpg");

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const input = document.createElement("input");
      input.type = "file";
      input.files = dataTransfer.files;
      handleImageChange({
        target: input,
      } as React.ChangeEvent<HTMLInputElement>);
      stream?.getTracks().forEach((track) => track.stop());
    }
  };

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const matchingItem = ItemdropDown.find(
    (item) => barcodeMain?.[0] && item.item_Code === barcodeMain[0].item_code
  );

  const isMobile =
    typeof window !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Only show right panel if barcode is entered (not empty)
  const showRightPanel = barcode.trim().length > 0;

  const handleImageClick = (imageUrl: string) => {
    setLargeImageUrl(imageUrl);
    setShowLargeImage(true);
  };
  useEffect(() => {
    if (isReRender) {
      handleBarcodeEnter();
      setIsReRender(false); // Reset after running
    }
  }, [isReRender]);
 
  return (
    <div className="lg:ml-64 min-h-screen p-4 bg-gray-100 text-sm text-black ">
      <div className="bg-white min-h-screen  p-6 mt-16 rounded-lg max-w-full mx-auto">
        {/* Header and Add CRM Button */}
        <h1 className="text-center bg-blue-50 text-black text-3xl font-bold py-3 rounded-t-xl shadow mb-6">
          BARCODE IMAGE UPLOAD
        </h1>

        {/* Barcode input */}

        <div className="flex flex-col sm:flex-row rounded-lg  p-4 justify-center items-center gap-4 mb-6">
          <div>
            <input
              id="barcode"
              type="text"
              value={barcodeInput}
              onChange={(e) =>
                setBarcodeInput(e.target.value.toLocaleUpperCase())
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleBarcodeEnter();
                }
              }}
              placeholder="Enter Barcode"
              className="w-full px-4 py-2 border border-indigo-400 rounded-lg text-center bg-gray-50 text-base sm:text-lg text-black"
            />
          </div>
          <div>
            <Button
              variant="contained"
              className="bg-gradient-to-r from-blue-500 to-blue-800 !px-4 !py-1 !rounded-2xl"
              onClick={handleBarcodeEnter}
            >
              Search
            </Button>
          </div>
        </div>
        <div className="flex  justify-center items-center w-full">
          {/* Main Grid: 2 Columns */}
          <div className="flex flex-col md:flex-row justify-center items-center rounded-md shadow-md gap-6 md:gap-8">
            {/* Left Panel */}
            {barcode && barcodeMain?.[0] && (
              <div className="max-w-md mx-auto flex flex-col bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs sm:text-sm font-semibold text-indigo-700 text-center">
                  <div>
                    <div className="text-sm tracking-wide mb-1">ITEM NAME</div>
                    <div className="text-gray-800">
                      {matchingItem?.item_Name || ""}
                    </div>
                  </div>
                  {barcodeMain[0]?.category && (
                    <div>
                      <div className="text-sm tracking-wide mb-1">CATEGORY</div>
                      <div className="text-gray-800">
                        {barcodeMain[0].category}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm tracking-wide mb-1">PCS</div>
                    <div className="text-gray-800">{barcodeMain[0].pcs}</div>
                  </div>
                  <div>
                    <div className="text-sm tracking-wide mb-1">CRT</div>
                    <div className="text-gray-800">{barcodeMain[0].crt}K</div>
                  </div>
                  <div>
                    <div className="text-sm tracking-wide mb-1">GROSS WT</div>
                    <div className="text-gray-800">
                      {barcodeMain[0].gross_wt} Gms
                    </div>
                  </div>
                  <div>
                    <div className="text-sm tracking-wide mb-1">NET WT</div>
                    <div className="text-gray-800">
                      {barcodeMain[0].net_wt} Gms
                    </div>
                  </div>
                </div>

                <div
                  className="rounded-2xl shadow-inner p-4 bg-indigo-50 flex justify-center items-center min-h-[230px] cursor-pointer"
                  onClick={() =>
                    uploadedImageUrl && handleImageClick(uploadedImageUrl)
                  }
                >
                  {imageLoading ? (
                    <div className="text-xl font-semibold text-indigo-700 animate-spin">
                      <Loader2 size={60} />
                    </div>
                  ) : uploadedImageUrl ? (
                    <Image
                      src={uploadedImageUrl}
                      alt="Uploaded"
                      width={350}
                      height={190}
                      className="rounded-2xl border-2 border-indigo-300 object-contain w-full max-w-[350px] h-[180px] sm:h-[230px]"
                    />
                  ) : (
                    <div className="text-center">
                      <p className="text-xl font-semibold text-indigo-700 animate-bounce">
                        Image not found 😥
                      </p>
                      <p className="text-sm text-indigo-400 mt-1">
                        Please upload an image.
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  variant="contained"
                  className="bg-gradient-to-r from-sky-500 to-sky-700 "
                  onClick={() => {
                    setUpdate(!Update);
                  }}
                >
                  <FaCamera className="text-lg m-1" /> Update Image
                </Button>
              </div>
            )}

            {/* Right Panel */}
            {Update && showRightPanel && barcodeMain?.[0] && (
              <div className="max-w-md mx-auto flex flex-col bg-white rounded-xl shadow-lg overflow-hidden p-6 space-y-6 h-[500px]">
                <div className="justify-center  items-center rounded-md shadow-lg p-4  h-1/2">
                  <label
                    htmlFor="image"
                    className="cursor-pointer w-full "
                    onClick={cancelCamera}
                  >
                    <div className="bg-indigo-50 hover:bg-indigo-100 border-2 border-dashed border-indigo-300 rounded-2xl text-center max-w-full mx-auto  p-2 h-2/3 flex flex-col justify-center">
                      <p className="text-indigo-700 text-sm font-medium">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-gray-400">
                        PNG, JPG, JPEG up to 5MB
                      </p>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={onImageSelect}
                        className="hidden"
                      />
                    </div>
                  </label>
                  <div className="flex justify-center items-center mt-4">
                    {!uploadPreview && isMobile && (
                      <Button
                        variant="contained"
                        className="bg-gradient-to-r from-sky-500 to-sky-800"
                        onClick={() => mobileCameraRef.current?.click()}
                      >
                        <FaCamera className="text-lg" />
                      </Button>
                    )}

                    {!isMobile && !isCameraStarted && (
                      <Button
                        variant="contained"
                        className="bg-gradient-to-r from-sky-500 to-sky-700"
                        onClick={startCamera}
                      >
                        <FaCamera className="text-lg m-1" /> Start camera
                      </Button>
                    )}
                  </div>
                  <div className="flex justify-between items-center  ">
                    {!uploadPreview && isCameraStarted && (
                      <Button
                        variant="contained"
                        className="bg-gradient-to-r from-green-500 to-green-700"
                        onClick={capturePhoto}
                      >
                        Capture
                      </Button>
                    )}
                    {!uploadPreview && isCameraStarted && (
                      <Button
                        variant="contained"
                        className="bg-gradient-to-r from-red-500 to-red-700"
                        onClick={cancelCamera}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>

                  {!uploadPreview && isMobile && (
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={mobileCameraRef}
                      onChange={onImageSelect}
                      className="hidden"
                    />
                  )}
                </div>

                {captureImagePre && useCamera && (
                  <div className=" rounded-2xl shadow-lg p-2 h-[200px] lg:h-[250px] flex flex-col justify-center items-center ">
                    {/* Video or Image Preview */}
                    {captureImagePre && !uploadPreview && !isMobile && (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-2xl border border-gray-300 w-full object-fill bg-black md:h-[185px] lg:h-[230px] h-[180px] md:[bg-black] sm:bg-black"
                      />
                    )}
                    {captureImagePre && !uploadPreview && isMobile && (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-2xl border border-gray-300 w-full object-fill bg-black md:h-[185px] lg:h-[230px] h-[180px] md:[bg-black] sm:bg-black"
                      />
                    )}

                    {captureImagePre && uploadPreview && (
                      <Image
                        key={uploadPreview} // ← Force re-render
                        src={uploadPreview}
                        alt="Preview"
                        width={500}
                        height={300}
                        className="rounded-2xl border border-indigo-300 object-fill w-full h-[180] lg:h-[230px]"
                      />
                    )}
                  </div>
                )}
                {retake && (
                  <Button
                    variant="contained"
                    className="bg-gradient-to-r from-green-500 to-green-700 "
                    onClick={cancelCamera}
                  >
                    Retake
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Upload Button */}
        {barcode && barcodeMain?.[0] && (
          <div className="text-center mt-4">
            <Button
              variant="contained"
              className="bg-gradient-to-r from-purple-500 to-purple-800  !text-white"
              onClick={(e) => {
                setUpdate(!Update);
                cancelCamera();
                handleUpload(e);
              }}
              disabled={!barcode || !uploadPreview || isLoading}
            >
              {isLoading ? (
                <Loader /> // Added size and color props
              ) : (
                "Upload"
              )}
            </Button>
            {errorMessage && (
              <p className="text-red-600 mt-2 text-sm">{errorMessage}</p>
            )}
          </div>
        )}
        {/* Feedback Message */}
        {/* Alert Message */}
        {message && (
          <Feedback
            title={title as "success" | "error" | "warning" | "info"}
            message={message}
          />
        )}

        {/* Large Image Modal */}
        {showLargeImage && largeImageUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
            onClick={() => setShowLargeImage(false)} // Close on overlay click
          >
            <div
              className="bg-white p-4 rounded-lg shadow-xl max-w-3xl max-h-[90vh] relative"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the image/modal content
            >
              <Image
                src={largeImageUrl}
                alt="Enlarged Barcode Image"
                width={800} // Adjust as needed
                height={600} // Adjust as needed
                className="object-contain max-w-full max-h-[80vh] rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadBody;
