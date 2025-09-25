"use client";

import {
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { FaUpload, FaFile, FaTimes } from "react-icons/fa";

const FileDropZone = forwardRef(
  (
    {
      name,
      value,
      onBlur,
      onChange,
      acceptedFileTypes = "",
      maxFileSize = 10 * 1024 * 1024, // 10MB default
      maxFiles = 5,
      multiple = false,
      className = "",
      size = "normal", // small, normal
    },
    ref
  ) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    // Expose files getter to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        getFiles: () => files,
        clearFiles: () => {
          setFiles([]);
          setError("");
          if (onChange) onChange([]);
        },
      }),
      [files, onChange]
    );

    const validateFile = (file) => {
      // Check file size
      if (file.size > maxFileSize) {
        return `File "${file.name}" is too large. Maximum size is ${Math.round(
          maxFileSize / (1024 * 1024)
        )}MB`;
      }

      // Check file type if acceptedFileTypes is specified
      if (acceptedFileTypes) {
        const fileExtension = "." + file.name.split(".").pop().toLowerCase();
        const acceptedTypes = acceptedFileTypes
          .split(",")
          .map((type) => type.trim().toLowerCase());
        if (!acceptedTypes.includes(fileExtension)) {
          return `File type "${fileExtension}" is not allowed. Accepted types: ${acceptedFileTypes}`;
        }
      }

      return null;
    };

    const handleFiles = useCallback(
      (newFiles) => {
        const fileArray = Array.from(newFiles);
        setError("");

        // Check if adding these files would exceed the limit
        if (!multiple && fileArray.length > 1) {
          setError("Only one file is allowed");
          return;
        }

        if (files.length + fileArray.length > maxFiles) {
          setError(`Maximum ${maxFiles} files allowed`);
          return;
        }

        // Validate each file
        const validFiles = [];
        for (const file of fileArray) {
          const validationError = validateFile(file);
          if (validationError) {
            setError(validationError);
            return;
          }
          validFiles.push(file);
        }

        // Update files state
        const updatedFiles = multiple ? [...files, ...validFiles] : validFiles;
        setFiles(updatedFiles);

        // Call the parent callback
        if (onChange) {
          onChange(updatedFiles);
        }
      },
      [files, multiple, maxFiles, maxFileSize, acceptedFileTypes, onChange]
    );

    const handleDrag = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    }, []);

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFiles(e.dataTransfer.files);
        }
      },
      [handleFiles]
    );

    const handleInputChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    };

    const removeFile = (indexToRemove) => {
      const updatedFiles = files.filter((_, index) => index !== indexToRemove);
      setFiles(updatedFiles);
      if (onChange) {
        onChange(updatedFiles);
      }
      setError("");
    };

    const openFileDialog = () => {
      fileInputRef.current?.click();
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
      <div className={`w-full ${className}`}>
        {/* Hidden file input */}
        <input
          name={name}
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedFileTypes}
          onChange={handleInputChange}
          className="hidden"
        />

        {/* Drop zone */}
        <button
          className={`w-full h-full relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer ${
            dragActive
              ? "border-primary bg-primary/10"
              : "border-gray-border hover:border-gray-400 hover:bg-surface-hover"
          } ${error ? "border-red-500" : ""}`}
          type="button"
          tabIndex={0}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFileDialog();
            }
          }}
        >
          <div className="flex flex-col flex-wrap items-center justify-center text-center">
            <div
              className={`mb-2 p-3 rounded-full transition-colors ${
                dragActive
                  ? "bg-primary text-white"
                  : "bg-gray-border text-gray-400"
              }`}
            >
              <FaUpload className="text-2xl" />
            </div>

            {size === "small" ? (
              <p className="text-md font-semibold text-white mb-1">
                {dragActive ? "Drop files here" : "Drag & drop files here"} or
                click to browse
              </p>
            ) : (
              <>
                <p className="text-lg font-semibold text-white mb-1">
                  {dragActive ? "Drop files here" : "Drag & drop files here"}
                </p>

                <p className="text-sm text-gray-400 mb-4">
                  or{" "}
                  <span className="text-primary hover:text-primary-hover font-medium">
                    click to browse
                  </span>
                </p>
              </>
            )}

            <div
              className={`text-gray-500 text-xs  ${
                size === "small"
                  ? "flex items-center divide-x divide-gray-600"
                  : "space-y-1"
              }`}
            >
              <p className="px-2">Accepted formats: {acceptedFileTypes}</p>
              <p className="px-2">
                Maximum size: {Math.round(maxFileSize / (1024 * 1024))}MB per
                file
              </p>
              <p className="px-2">Maximum files: {maxFiles}</p>
            </div>
          </div>
        </button>

        {/* Error message */}
        {error && (
          <div className="mt-2 p-3 bg-red-900/20 border border-red-500 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-white">
              Selected Files ({files.length}/{maxFiles})
            </p>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-3 bg-surface border border-gray-border rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/20 rounded">
                      <FaFile className="text-primary text-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Remove file"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);
FileDropZone.displayName = "FileDropZone";

export default FileDropZone;
