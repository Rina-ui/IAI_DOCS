"use client";

import * as React from "react";
import { Upload, FileText, X } from "lucide-react";

export interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in MB
  onChange?: (file: File | null) => void;
  error?: string;
  label?: string;
  hint?: string;
}

export function FileUpload({
  accept = ".pdf",
  maxSize = 10,
  onChange,
  error,
  label = "Fichier",
  hint = "Glissez-déposez ou cliquez pour sélectionner",
}: FileUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    // Check file size
    if (selectedFile.size > maxSize * 1024 * 1024) {
      alert(`Le fichier est trop volumineux. Taille maximale : ${maxSize} MB`);
      return;
    }

    setFile(selectedFile);
    onChange?.(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onChange?.(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-on-surface mb-2">{label}</label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : error
            ? "border-error/40 hover:border-error"
            : "border-secondary/20 hover:border-primary/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {file ? (
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-on-surface truncate">{file.name}</p>
              <p className="text-xs text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleRemove();
              }}
              className="shrink-0 text-secondary hover:text-error transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div>
            <Upload size={32} className="text-secondary/40 mx-auto mb-3" />
            <p className="font-bold text-on-surface mb-1">{hint}</p>
            <p className="text-xs text-secondary">
              {accept.toUpperCase()} uniquement, max {maxSize} MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-error mt-2">{error}</p>}
    </div>
  );
}
