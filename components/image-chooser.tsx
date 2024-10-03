"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { toast } from "sonner";

interface ImageChooserProps {
  onImageChange?: (file: File) => void;
  disable?: boolean;
}

const ImageChooser = ({ onImageChange, disable }: ImageChooserProps) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input to allow re-upload
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      if (onImageChange) onImageChange(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      toast.error("No file selected");
      return;
    }
    const file = e.target.files[0];
    if (onImageChange) {
      onImageChange(file);
    }
  };

  return (
    <>
      <div
        className={cn(
          `w-1/2 border border-dashed p-6 rounded-md mb-6 flex justify-center items-center cursor-pointer hover:bg-zinc-100 transition-colors duration-200`,
          dragging ? "border-blue-500 bg-blue-100" : "border-zinc-400",
          disable ? "opacity-50 pointer-events-none" : ""
        )}
        onClick={handleDivClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={() => setDragging(false)}
      >
        {dragging
          ? "Drop the image here"
          : "Choose an image to scan or drag here"}
      </div>
      <input
        aria-label="file-input"
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />
    </>
  );
};

export default ImageChooser;
