import React, { useState, useEffect } from "react";
import { FolderOpen, Upload, Trash2, Copy, FileText, Image as ImageIcon, ExternalLink, Check, Eye } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface Asset {
  id: number;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  category: string;
  createdAt: string;
}

export default function AdminAssetsPage() {
  const { token } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [previewAsset, setPreviewAsset] = useState<Asset | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/assets");
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      }
    } catch (err) {
      console.error("Failed to fetch assets", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "category",
      file.type === "application/pdf" ? "certificate" : "image"
    );

    setUploading(true);

    try {
      const res = await fetch("/api/assets/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        fetchAssets();
      } else {
        const err = await res.json();
        alert(`Upload failed: ${err.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload error", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this asset file?")) return;

    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchAssets();
      }
    } catch (err) {
      console.error("Delete asset error", err);
    }
  };

  const copyUrl = (id: number, url: string) => {
    const fullUrl = window.location.origin + url;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredAssets = assets.filter((asset) => {
    if (selectedCategory === "all") return true;
    return asset.category === selectedCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderOpen className="w-6 h-6 text-cyan-400" /> Asset & Certificate Manager
          </h1>
          <p className="text-sm text-slate-400 mt-1">Upload and manage PDF certificates, project screenshots, and media assets</p>
        </div>

        <label className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm">
          <Upload className="w-4 h-4" />
          <span>{uploading ? "Uploading File..." : "Upload Certificate / Image"}</span>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Hosting Guidelines Banner */}
      <div className="bg-cyan-950/40 border border-cyan-500/20 rounded-xl p-4 text-xs space-y-2 text-cyan-200/90">
        <div className="font-semibold text-cyan-300 flex items-center gap-2 text-sm">
          <FolderOpen className="w-4 h-4 text-cyan-400" /> Media & Credential Hosting Quick Checklist
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-300">
          <li><strong>Static Repository Files:</strong> Place static files inside <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">public/certificates/</code> or <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">public/events/</code> and reference them with a leading slash (e.g. <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">/certificates/aws-cert.png</code>).</li>
          <li><strong>Image Optimization:</strong> Keep image file sizes under <strong>500 KB</strong> (using WebP or compressed JPG) for fast page loading on Vercel.</li>
          <li><strong>Video Embeds:</strong> Upload large event videos to YouTube or Vimeo and use YouTube embed links (e.g. <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">https://www.youtube.com/embed/VIDEO_ID</code>).</li>
          <li><strong>Cloud Storage:</strong> Use Cloudinary or Supabase CDN URLs directly in your entries for instant updates without re-building code.</li>
        </ul>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {["all", "certificate", "image"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat
                ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            {cat === "all" ? "All Files" : `${cat}s`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading uploaded assets...</div>
      ) : filteredAssets.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="font-medium text-slate-300">No asset files found</p>
          <p className="text-xs text-slate-500 mt-1">Click "Upload Certificate / Image" to add files to your server</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const isPdf = asset.mimeType === "application/pdf";
            return (
              <div
                key={asset.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail / File Icon Preview */}
                  <div className="w-full h-36 bg-slate-950 rounded-xl overflow-hidden mb-3 flex items-center justify-center border border-slate-800/80 relative">
                    {isPdf ? (
                      <div className="flex flex-col items-center text-rose-400">
                        <FileText className="w-12 h-12 mb-1" />
                        <span className="text-[10px] font-bold tracking-widest uppercase bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                          PDF Document
                        </span>
                      </div>
                    ) : asset.url ? (
                      <img
                        src={asset.url}
                        alt={asset.originalName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-600" />
                    )}

                    <button
                      onClick={() => setPreviewAsset(asset)}
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white text-xs font-semibold transition-opacity"
                    >
                      <Eye className="w-4 h-4" /> Preview
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white truncate" title={asset.originalName}>
                      {asset.originalName}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{formatFileSize(asset.size)}</span>
                      <span className="uppercase text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                        {asset.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => copyUrl(asset.id, asset.url)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy URL
                      </>
                    )}
                  </button>

                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => handleDelete(asset.id)}
                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h3 className="font-bold text-white truncate max-w-xl">{previewAsset.originalName}</h3>
              <button
                onClick={() => setPreviewAsset(null)}
                className="text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg text-xs"
              >
                Close Preview
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-950">
              {previewAsset.mimeType === "application/pdf" ? (
                <iframe
                  src={previewAsset.url}
                  className="w-full h-[70vh] rounded-xl border border-slate-800"
                  title={previewAsset.originalName}
                />
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.originalName}
                  className="max-w-full max-h-[70vh] object-contain rounded-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
