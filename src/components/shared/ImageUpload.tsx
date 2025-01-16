"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

type Props = {
  disable?: boolean;
  onChange?: (value: File[]) => void;
  values?: string[];
  type: "standard" | "profile" | "multiple";
  allowedTypes?: string[];
};

export default function ImageUpload({
  disable,
  onChange,
  allowedTypes,
  type,
  values,
}: Props) {
  const [dragging, setDragging] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputId = useId();

  const handleDragOver = (event: any) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    setDragging(false);

    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileChange(droppedFiles[0]);
    }
  };

  useEffect(() => {
    onChange?.(files);
  }, [files]);

  // const isValidFileType = (file: File): boolean => {
  //   if (allowedTypes.length === 0) return true; // Allow all if no restrictions specified
  //   return allowedTypes.includes(file.type);
  // };

  const handleFileChange = (files: File[]) => {
    const filesTemp = type === "multiple" ? files : [files[0]];
    const previewsTemp: string[] = []; // Array to store preview URLs

    filesTemp.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previewsTemp.push(reader.result as string);

        if (previewsTemp.length === filesTemp.length) {
          setFiles(filesTemp); // Assuming setFiles takes the array of files
          setPreviews(previewsTemp);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const handleFileUpload = (event: any) => {
    const uploadedFile = event.target.files || null;
    if (uploadedFile && uploadedFile.length > 0) {
      handleFileChange(uploadedFile);
    }
  };

  if (type === "profile") {
    return (
      <div className="relative rounded-full w-52 h-52 inset-x-96 bg-gray-200 border-2 border-white shadow-2xl">
        {values && values.length > 0 && (
          <Image
            src={values[0]}
            alt=""
            width="300"
            height="300"
            className="w-52 h-52 rounded-full object-cover absolute top-0 left-0 bottom-0 right-0"
          />
        )}
      </div>
    );
  } else {
    return (
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer h-60 ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onClick={() => document.getElementById(inputId)?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={inputId}
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="relative w-full h-full flex justify-center items-center">
          {previews.length > 0 ? (
            <Image
              src={previews[0]}
              alt="Uploaded file preview"
              layout="fill"
              className="object-contain"
            />
          ) : (
            <p className="text-lg text-gray-700">
              Drag & Drop a file here, or click to upload
            </p>
          )}
        </div>
      </div>
    );
  }
}
