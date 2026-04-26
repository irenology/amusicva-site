import { useState } from "react";
import { X, Play } from "lucide-react";

interface GalleryItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  eventType: "performance" | "activity" | "workshop" | "recital" | "other";
  instruments: string[]; // e.g., ["piano", "violin", "flute"]
}

interface CategorizedEventGalleryProps {
  items: GalleryItem[];
  colors?: {
    bg: string;
    card: string;
    border: string;
    text: string;
    textMid: string;
    muted: string;
    accent: string;
    white: string;
  };
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  performance: "Performance",
  activity: "Activity",
  workshop: "Workshop",
  recital: "Recital",
  other: "Other",
};

export function CategorizedEventGallery({ items, colors }: CategorizedEventGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeEventType, setActiveEventType] = useState<string | null>(null);

  const C = colors || {
    bg: "#FAF7F2",
    card: "#F2EDE4",
    border: "#D4C5A9",
    text: "#2C1A0E",
    textMid: "#5C3D20",
    muted: "#8B7355",
    accent: "#B8860B",
    white: "#FDFCF9",
  };

  // Get unique event types
  const eventTypes = Array.from(new Set(items.map((item) => item.eventType)));

  // Filter items based on active event type
  const filteredItems = activeEventType
    ? items.filter((item) => item.eventType === activeEventType)
    : items;

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
      {/* Filter Buttons - Event Type Only */}
      <div className="mb-12">
        <h4 className="font-display text-sm mb-4" style={{ color: C.text, fontWeight: 500 }}>
          Filter by Event Type
        </h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveEventType(null)}
            className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 hover:shadow-md"
            style={{
              background: activeEventType === null ? C.accent : C.card,
              color: activeEventType === null ? C.white : C.text,
              border: `1px solid ${C.border}`,
            }}
          >
            All Events
          </button>
          {eventTypes.map((eventType) => (
            <button
              key={eventType}
              onClick={() => setActiveEventType(eventType)}
              className="px-4 py-2 rounded text-sm font-medium transition-all duration-200 hover:shadow-md"
              style={{
                background: activeEventType === eventType ? C.accent : C.card,
                color: activeEventType === eventType ? C.white : C.text,
                border: `1px solid ${C.border}`,
              }}
            >
              {EVENT_TYPE_LABELS[eventType] || eventType}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6" style={{ color: C.muted, fontSize: "0.9rem" }}>
        Showing {filteredItems.length} of {items.length} items
      </div>

      {/* Gallery Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="reveal group relative overflow-hidden rounded cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                aspectRatio: "16/9",
              }}
            >
              {/* Thumbnail/Preview */}
              <img
                src={
                  item.type === "video" && item.thumbnail
                    ? item.thumbnail
                    : item.type === "image"
                    ? item.url
                    : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%23e5e5e5' width='16' height='9'/%3E%3C/svg%3E"
                }
                alt={item.title}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-75"
                loading="lazy"
              />

              {/* Overlay - Video Play Button */}
              {item.type === "video" && (
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(0,0,0,0.3)" }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${C.accent}dd` }}
                  >
                    <Play size={32} color={C.white} fill={C.white} />
                  </div>
                </div>
              )}

              {/* Title & Info Badge */}
              <div
                className="absolute bottom-0 left-0 right-0 p-4 transition-all duration-300"
                style={{
                  background: `linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3), transparent)`,
                }}
              >
                <p className="text-sm font-semibold truncate" style={{ color: C.white }}>
                  {item.title}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.instruments.map((instrument) => (
                    <span
                      key={instrument}
                      className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                      style={{ background: `${C.accent}cc`, color: C.white }}
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
              </div>

              {/* Video Badge */}
              {item.type === "video" && (
                <div
                  className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-semibold"
                  style={{ background: `${C.accent}dd`, color: C.white }}
                >
                  VIDEO
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12 rounded"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <p style={{ color: C.muted, fontSize: "0.95rem" }}>
            No items match your filters. Try adjusting your selection.
          </p>
        </div>
      )}

      {/* Lightbox Modal */}
      {isOpen && selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          style={{
            background: "rgba(0,0,0,0.95)",
            backdropFilter: "blur(8px)",
          }}
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-200 hover:bg-white/30 hover:scale-110"
              style={{ background: "rgba(0,0,0,0.6)", color: "white" }}
            >
              <X size={24} />
            </button>

            {/* Content */}
            {selectedItem.type === "image" ? (
              <img
                src={selectedItem.url}
                alt={selectedItem.title}
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

            {/* Info Section */}
            {(selectedItem.title || selectedItem.description) && (
              <div
                className="p-6"
                style={{ background: C.card, borderTop: `1px solid ${C.border}` }}
              >
                <h3 className="font-display text-xl mb-2" style={{ color: C.text, fontWeight: 600 }}>
                  {selectedItem.title}
                </h3>
                {selectedItem.description && (
                  <p style={{ color: C.textMid, fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "1rem" }}>
                    {selectedItem.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span
                    className="text-xs px-3 py-1.5 rounded-full font-semibold"
                    style={{ background: `${C.accent}20`, color: C.accent }}
                  >
                    {EVENT_TYPE_LABELS[selectedItem.eventType]}
                  </span>
                  {selectedItem.instruments.map((instrument) => (
                    <span
                      key={instrument}
                      className="text-xs px-3 py-1.5 rounded-full capitalize font-medium"
                      style={{ background: `${C.accent}10`, color: C.text }}
                    >
                      {instrument}
                    </span>
                  ))}
                </div>
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
