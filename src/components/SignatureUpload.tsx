"use client";

import React, { useState, useRef } from "react";

interface SignatureUploadProps {
  onSignatureChange: (base64: string | null) => void;
  label?: string;
}

export default function SignatureUpload({ onSignatureChange, label = "Upload Signature" }: SignatureUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onSignatureChange(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const clear = () => {
    setPreview(null);
    onSignatureChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative group h-16 w-32 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-1">
            <img src={preview} alt="Signature Preview" className="h-full w-full object-contain" />
            <button
              onClick={clear}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-16 w-32 items-center justify-center rounded-lg border-2 border-dashed border-zinc-200 bg-zinc-50 text-xs text-zinc-400 hover:border-zinc-300 hover:bg-zinc-100 transition-all"
          >
            + Upload Image
          </button>
        )}
        <div className="text-[10px] text-zinc-400">
          PNG/JPG supported.<br/>Transparent background<br/>recommended.
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
