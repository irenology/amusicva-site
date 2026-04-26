import { useState } from "react";
import { X, Play } from "lucide-react";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string; // For videos, optional custom thumbnail
  title?: string;
  description?: string;
}

interface EventGalleryProps {
  items: GalleryItem[];
  colors?: {
    bg: string;
    card: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    white: string;
  };
}

export function EventGallery({ items, colors }: EventGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const C = colors || {
    bg: "#FAF7F2",
    card: "#F2EDE4",
    border: "#D4C5A9",
    text: "#2C1A0E",
    muted: "#8B7355",
    accent: "#B8860B",
    white: "#FDFCF9",
  };

  const openLightbox = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item)}
            className="reveal group relative overflow-hidden rounded cursor-pointer transition-transform duration-300 hover:scale-105"
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              aspectRatio: "16/9",
            }}
          >
            {/* Thumbnail/Preview */}
            <img
              src={
                item.type === "video"
                  ? item.thumbnail || `https://img.youtube.com/vi/${extractVideoId(item.url)}/0.jpg`
                  : item.url
              }
              alt={item.title || "Gallery item"}
              className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
              loading="lazy"
            />

            {/* Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              {item.type === "video" ? (
                <Play size={48} color="white" fill="white" />
              ) : (
                <div style={{ color: "white", fontSize: "0.9rem", fontWeight: 600 }}>
                  View
                </div>
              )}
            </div>

            {/* Title Badge */}
            {item.title && (
              <div
                className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent"
                style={{ color: "white" }}
              >
                <p className="text-sm font-semibold truncate">{item.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.9)",
            backdropFilter: "blur(4px)",
            animation: "fadeIn 0.3s ease-out",
          }}
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 hover:bg-white/20"
              style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
            >
              <X size={24} />
            </button>

            {/* Content */}
            {selectedItem.type === "image" ? (
              <img
                src={selectedItem.url}
                alt={selectedItem.title || "Gallery item"}
                className="w-full h-full object-contain"
              />
            ) : (
              <div style={{ background: "black", aspectRatio: "16/9" }}>
                <video
                  src={selectedItem.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  style={{ maxHeight: "90vh" }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Info */}
            {(selectedItem.title || selectedItem.description) && (
              <div
                className="p-4"
                style={{ background: C.card, borderTop: `1px solid ${C.border}` }}
              >
                {selectedItem.title && (
                  <h3 className="font-display text-lg mb-2" style={{ color: C.text, fontWeight: 500 }}>
                    {selectedItem.title}
                  </h3>
                )}
                {selectedItem.description && (
                  <p style={{ color: C.muted, fontSize: "0.9rem", lineHeight: "1.6" }}>
                    {selectedItem.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// Helper function to extract video ID from URL
function extractVideoId(url: string): string {
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (youtubeMatch) return youtubeMatch[1];
  return "";
}
