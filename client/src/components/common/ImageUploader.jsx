import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

const API_URL = "http://localhost:5000/api/upload";

export function SingleImageUpload({ value, onChange, label = "Product Image" }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_URL}/single`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onChange({ url: data.url, publicId: data.publicId });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) uploadFile(file);
  };

  const handleRemove = async () => {
    if (value?.publicId) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/${encodeURIComponent(value.publicId)}`, {
          method: "DELETE",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    onChange(null);
  };

  return (
    <div>
      <label className="block text-[13px] font-bold text-slate-600 mb-1.5">
        {label}
      </label>
      {value?.url ? (
        <div className="relative group">
          <img
            src={value.url}
            alt={label}
            className="w-full h-48 object-cover rounded-xl border border-slate-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-[#1e5fa5] bg-[#1e5fa5]/5" : "border-slate-300 hover:border-[#1e5fa5]/50 bg-slate-50/50"
          }`}
        >
          {uploading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-[#1e5fa5] border-t-transparent mx-auto" />
          ) : (
            <>
              <Upload size={32} className="text-slate-400 mx-auto mb-2" />
              <p className="text-[13px] text-slate-500 font-medium">
                Drag & drop or <span className="text-[#1e5fa5] font-semibold">click to upload</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">JPG, PNG, WebP (max 5MB)</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => uploadFile(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}

export function GalleryImageUpload({ value = [], onChange, label = "Gallery Images" }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("images", file));
      const res = await fetch(`${API_URL}/gallery`, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onChange([...value, ...data.images]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length > 0) uploadFiles(files);
  };

  const handleRemove = async (index) => {
    const img = value[index];
    if (img?.publicId) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_URL}/${encodeURIComponent(img.publicId)}`, {
          method: "DELETE",
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-[13px] font-bold text-slate-600 mb-1.5">
        {label}
      </label>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {value.map((img, i) => (
          <div key={i} className="relative group">
            <img
              src={img.url}
              alt={`Gallery ${i + 1}`}
              className="w-full h-24 object-cover rounded-lg border border-slate-200"
            />
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          dragOver ? "border-[#1e5fa5] bg-[#1e5fa5]/5" : "border-slate-300 hover:border-[#1e5fa5]/50 bg-slate-50/50"
        }`}
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-3 border-[#1e5fa5] border-t-transparent mx-auto" />
        ) : (
          <>
            <ImageIcon size={24} className="text-slate-400 mx-auto mb-1" />
            <p className="text-[12px] text-slate-500 font-medium">
              Click or drag to add more <span className="text-[#1e5fa5] font-semibold">images</span>
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={(e) => uploadFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
