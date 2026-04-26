import { useState } from "react";
import { X } from "lucide-react";
import { trpc } from "@/lib/trpc";

const C = {
  bg: "#FAF7F2",
  card: "#F2EDE4",
  border: "#D4C5A9",
  text: "#2C1A0E",
  textMid: "#5C3D20",
  muted: "#8B7355",
  accent: "#B8860B",
  white: "#FDFCF9",
};

const PRACTICE_ROOM_IMAGES = [
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663333334060/LSYMFpTaKgJ4fs4qHQmZSd/p1_e8a4db33.avif",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663333334060/LSYMFpTaKgJ4fs4qHQmZSd/p2_1b203e5a.avif",
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663333334060/LSYMFpTaKgJ4fs4qHQmZSd/p3_38358445.avif",
];

const MEMBERSHIP_TIERS = [
  {
    id: "option1",
    name: "Option 1",
    price: "$15/hour",
    description: "Basic practice room access",
  },
  {
    id: "option2",
    name: "Option 2",
    price: "$20/hour",
    description: "Premium room with better acoustics",
  },
  {
    id: "option3",
    name: "Option 3",
    price: "$25/hour",
    description: "Premium room with piano/instruments",
  },
  {
    id: "nonmember",
    name: "Non-Member",
    price: "$30/hour",
    description: "One-time booking rate",
  },
];

interface PracticeRoomBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PracticeRoomBookingModal({
  isOpen,
  onClose,
}: PracticeRoomBookingModalProps) {
  const [formData, setFormData] = useState({
    membershipTier: "option1",
    preferredDate: "",
    preferredTime: "",
    duration: "1",
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submitPracticeRoomBooking =
    trpc.bookings.submitPracticeRoomBooking.useMutation({
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({
            membershipTier: "option1",
            preferredDate: "",
            preferredTime: "",
            duration: "1",
            name: "",
            email: "",
            phone: "",
            notes: "",
          });
        }, 2000);
      },
      onError: (err: any) => {
        setError(err.message || "Failed to create booking");
      },
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    submitPracticeRoomBooking.mutate({
      studentName: formData.name,
      studentEmail: formData.email,
      roomType: formData.membershipTier === "nonmember" ? "standard" : "premium",
      hours: parseInt(formData.duration),
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl"
        style={{ background: C.white, maxHeight: "90vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="sticky top-0 flex items-center justify-between p-6 border-b"
          style={{ background: C.card, borderColor: C.border }}
        >
          <h2
            className="font-display text-2xl"
            style={{ color: C.text, fontWeight: 500 }}
          >
            Book a Practice Room
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
            style={{ color: C.muted, background: "none", border: "none" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Image Gallery */}
          <div className="mb-8">
            <h3
              className="font-display text-lg mb-4"
              style={{ color: C.text, fontWeight: 500 }}
            >
              Our Practice Rooms
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {PRACTICE_ROOM_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  className="rounded overflow-hidden"
                  style={{ border: `1px solid ${C.border}` }}
                >
                  <img
                    src={img}
                    alt={`Practice Room ${idx + 1}`}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Practice+Room';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Membership Tiers */}
          <div className="mb-8">
            <h3
              className="font-display text-lg mb-4"
              style={{ color: C.text, fontWeight: 500 }}
            >
              Select Membership Tier
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {MEMBERSHIP_TIERS.map((tier) => (
                <label
                  key={tier.id}
                  className="p-4 rounded cursor-pointer transition-all"
                  style={{
                    border: `2px solid ${
                      formData.membershipTier === tier.id
                        ? C.accent
                        : C.border
                    }`,
                    background:
                      formData.membershipTier === tier.id
                        ? `${C.accent}10`
                        : C.card,
                  }}
                >
                  <input
                    type="radio"
                    name="membershipTier"
                    value={tier.id}
                    checked={formData.membershipTier === tier.id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        membershipTier: e.target.value,
                      })
                    }
                    style={{ marginRight: "0.5rem" }}
                  />
                  <div>
                    <div
                      style={{ color: C.text, fontWeight: 600, fontSize: "1rem" }}
                    >
                      {tier.name}
                    </div>
                    <div
                      style={{ color: C.accent, fontWeight: 600, fontSize: "1rem" }}
                    >
                      {tier.price}
                    </div>
                    <div
                      style={{
                        color: C.muted,
                        fontSize: "0.85rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {tier.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  style={{
                    color: C.text,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredDate: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    color: C.text,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: C.text,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Preferred Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.preferredTime}
                  onChange={(e) =>
                    setFormData({ ...formData, preferredTime: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    color: C.text,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: C.text,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Duration (hours) *
                </label>
                <select
                  required
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    color: C.text,
                  }}
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="3">3 hours</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    color: C.text,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your name"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    color: C.text,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: C.text,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    color: C.text,
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    color: C.text,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    border: `1px solid ${C.border}`,
                    borderRadius: "0.5rem",
                    color: C.text,
                  }}
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                style={{
                  color: C.text,
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any special requests or notes..."
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.5rem",
                  color: C.text,
                  minHeight: "100px",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded"
                style={{ background: "#fee", color: "#c33", fontSize: "0.9rem" }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className="mb-4 p-3 rounded"
                style={{
                  background: "#efe",
                  color: "#3c3",
                  fontSize: "0.9rem",
                }}
              >
                ✅ Booking submitted successfully! We'll contact you shortly.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitPracticeRoomBooking.isPending}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: C.accent,
                  color: C.white,
                  border: "none",
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  cursor: submitPracticeRoomBooking.isPending
                    ? "not-allowed"
                    : "pointer",
                  opacity: submitPracticeRoomBooking.isPending ? 0.6 : 1,
                }}
              >
                {submitPracticeRoomBooking.isPending
                  ? "Submitting..."
                  : "Submit Booking"}
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  background: C.card,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.5rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
