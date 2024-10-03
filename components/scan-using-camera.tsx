"use client";
import React from "react";
import { toast } from "sonner";

interface ImageChooserProps {
  onImageChange?: (file: File) => void;
  disable?: boolean;
}

const ScanUsingCamera: React.FC<ImageChooserProps> = ({
  onImageChange,
  disable,
}) => {
  const handleScan = async () => {
    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });

      const video = document.createElement("video");
      video.srcObject = stream;
      video.play();

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      document.body.appendChild(video);

      const captureImage = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (!context) {
          toast.error("Failed to capture image.");
          return;
        }
        context.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_image.png", {
              type: "image/png",
            });
            if (onImageChange) {
              onImageChange(file);
            }
          }
        }, "image/png");

        stream.getTracks().forEach((track) => track.stop());
        document.body.removeChild(video);
      };

      const captureButton = document.createElement("button");
      captureButton.innerText = "Capture Image";
      captureButton.onclick = captureImage;
      document.body.appendChild(captureButton);
    } catch {
      toast.error(
        "Unable to access the camera. Please check your device settings."
      );
    }
  };

  return (
    <div
      className={`w-1/2 border border-dashed border-zinc-400 p-6 rounded-md mb-6 flex justify-center items-center ${
        disable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={!disable ? handleScan : undefined}
    >
      {disable ? "Camera Scanning Disabled" : "Scan using camera"}
    </div>
  );
};

export default ScanUsingCamera;
