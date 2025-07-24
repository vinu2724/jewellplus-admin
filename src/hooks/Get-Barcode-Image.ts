import { useCallback } from "react";

export const useGetBarcodeImage = () => {
  const getImageFromAzure = useCallback(
    async (
      url: string,
      token: string,
      asFolder: string,
      barcode: string // Pass only the barcode, not asFile
    ): Promise<string | null> => {
      const extensions = ["jpg", "jpeg", "png", "webp"];
      for (const ext of extensions) {
        const asFile = `${barcode}.${ext}`;
        const formData = new FormData();
        formData.append("url", url);
        formData.append("token", token);
        formData.append("asFolder", asFolder);
        formData.append("asFile", asFile);

        const response = await fetch("/api/get-barcode-image", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      }
      return null; // Not found in any extension
    },
    []
  );

  return { getImageFromAzure };
};
