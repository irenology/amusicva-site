import { useState, useEffect } from "react";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

// Color tokens
const C = {
  bg: "#FAF7F2",
  bgAlt: "#F5EFE6",
  card: "#F2EDE4",
  border: "#D4C5A9",
  text: "#2C1A0E",
  textMid: "#5C3D20",
  muted: "#8B7355",
  accent: "#B8860B",
  accentHover: "#9A7009",
  white: "#FDFCF9",
};

// Time slots available per day (9 AM to 9 PM)
const TIME_SLOTS = [
  { start: "09", label: "9:00 AM - 11:00 AM" },
  { start: "11", label: "11:00 AM - 1:00 PM" },
  { start: "13", label: "1:00 PM - 3:00 PM" },
  { start: "15", label: "3:00 PM - 5:00 PM" },
  { start: "17", label: "5:00 PM - 7:00 PM" },
  { start: "19", label: "7:00 PM - 9:00 PM" },
];

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  instrument: string;
  duration: "60" | "90" | "120";
}

export default function PracticeRoomBooking() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time" | "form" | "confirmation">("date");
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    instrument: "",
    duration: "60",
  });
  const [currentDateStr, setCurrentDateStr] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<any>(null);
  const [error, setError] = useState<string>("");

  // Fetch available slots when date is selected
  const { data: slotsData } = trpc.practiceRoomCalendar.getAvailableSlots.useQuery(
    {
      bookingDate: currentDateStr,
      roomType: "standard",
    },
    { enabled: !!currentDateStr }
  );

  // Get available dates (next 3 days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCurrentDateStr(formatDate(date));
    setError("");
    setStep("time");
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setError("");
    setStep("form");
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitBookingMutation = trpc.practiceRoomCalendar.submitCalendarBooking.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) return;

    setIsLoading(true);
    setError("");
    try {
      const durationHours = parseInt(formData.duration) / 60;
      const startHour = parseInt(selectedSlot);
      const endHour = startHour + durationHours;

      const result = await submitBookingMutation.mutateAsync({
        studentName: formData.name,
        studentEmail: formData.email,
        studentPhone: formData.phone || undefined,
        bookingDate: formatDate(selectedDate),
        startTime: `${String(startHour).padStart(2, "0")}:00`,
        endTime: `${String(endHour).padStart(2, "0")}:00`,
        durationHours,
        roomType: "standard",
      });

      setBookingConfirmation(result);
      setStep("confirmation");

      // Redirect after 5 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    } catch (error: any) {
      console.error("Booking failed:", error);
      setError(error.message || "Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const availableDates = getAvailableDates();

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Header */}
      <div className="sticky top-0 z-40 py-6" style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div className="container">
          <h1 className="font-display text-3xl" style={{ color: C.text, fontWeight: 500 }}>
            Book a Practice Room
          </h1>
          <p style={{ color: C.muted, marginTop: "0.5rem" }}>
            Reserve your practice space for up to 2 hours
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12">
            {["date", "time", "form", "confirmation"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all"
                  style={{
                    background: ["date", "time", "form", "confirmation"].indexOf(step) >= i ? C.accent : C.card,
                    color: ["date", "time", "form", "confirmation"].indexOf(step) >= i ? C.white : C.muted,
                  }}
                >
                  {i + 1}
                </div>
                {i < 3 && (
                  <div
                    className="h-1 flex-1 mx-2"
                    style={{
                      background: ["date", "time", "form", "confirmation"].indexOf(step) > i ? C.accent : C.border,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Date Selection */}
          {step === "date" && (
            <div className="bg-white rounded-lg p-8" style={{ border: `1px solid ${C.border}` }}>
              <h2 className="font-display text-2xl mb-6" style={{ color: C.text, fontWeight: 500 }}>
                Select a Date
              </h2>
              <p style={{ color: C.muted, marginBottom: "2rem" }}>
                Choose from the next 3 available days
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availableDates.map((date) => (
                  <button
                    key={formatDate(date)}
                    onClick={() => handleDateSelect(date)}
                    className="p-6 rounded-lg text-center transition-all hover:shadow-md cursor-pointer"
                    style={{
                      background: selectedDate && formatDate(selectedDate) === formatDate(date) ? C.accent : C.card,
                      border: `2px solid ${selectedDate && formatDate(selectedDate) === formatDate(date) ? C.accent : C.border}`,
                      color: selectedDate && formatDate(selectedDate) === formatDate(date) ? C.white : C.text,
                    }}
                  >
                    <div className="font-display text-lg" style={{ fontWeight: 500 }}>
                      {formatDateDisplay(date)}
                    </div>
                    <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      {date.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Time Slot Selection */}
          {step === "time" && selectedDate && (
            <div className="bg-white rounded-lg p-8" style={{ border: `1px solid ${C.border}` }}>
              <button
                onClick={() => setStep("date")}
                className="flex items-center gap-2 mb-6 text-sm font-semibold cursor-pointer"
                style={{ color: C.accent }}
              >
                <ChevronLeft size={16} /> Back to Dates
              </button>

              <h2 className="font-display text-2xl mb-2" style={{ color: C.text, fontWeight: 500 }}>
                Select a Time Slot
              </h2>
              <p style={{ color: C.muted, marginBottom: "2rem" }}>
                {formatDateDisplay(selectedDate)} - Choose your 2-hour session
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = slotsData?.bookedSlots.includes(slot.start) || false;
                  return (
                    <button
                      key={slot.start}
                      onClick={() => !isBooked && handleSlotSelect(slot.start)}
                      disabled={isBooked}
                      className="p-4 rounded-lg text-left transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: selectedSlot === slot.start ? C.accent : isBooked ? C.bgAlt : C.card,
                        border: `2px solid ${selectedSlot === slot.start ? C.accent : isBooked ? C.border : C.border}`,
                        color: selectedSlot === slot.start ? C.white : C.text,
                      }}
                    >
                      <div className="flex items-center gap-2 font-semibold">
                        <Clock size={16} />
                        {slot.label}
                      </div>
                      {isBooked && (
                        <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: "0.5rem" }}>
                          Booked
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Booking Form */}
          {step === "form" && selectedDate && selectedSlot && (
            <div className="bg-white rounded-lg p-8" style={{ border: `1px solid ${C.border}` }}>
              <button
                onClick={() => setStep("time")}
                className="flex items-center gap-2 mb-6 text-sm font-semibold cursor-pointer"
                style={{ color: C.accent }}
              >
                <ChevronLeft size={16} /> Back to Times
              </button>

              <h2 className="font-display text-2xl mb-2" style={{ color: C.text, fontWeight: 500 }}>
                Complete Your Booking
              </h2>
              <p style={{ color: C.muted, marginBottom: "2rem" }}>
                {formatDateDisplay(selectedDate)} at {TIME_SLOTS.find((s) => s.start === selectedSlot)?.label}
              </p>

              {error && (
                <div
                  className="p-4 rounded-lg mb-6"
                  style={{ background: "#fee", color: "#c33", border: "1px solid #fcc" }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      color: C.text,
                      background: C.white,
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      color: C.text,
                      background: C.white,
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      color: C.text,
                      background: C.white,
                    }}
                  />
                </div>

                <div>
                  <label style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
                    Primary Instrument
                  </label>
                  <select
                    name="instrument"
                    value={formData.instrument}
                    onChange={handleFormChange}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `1px solid ${C.border}`,
                      borderRadius: "0.5rem",
                      color: C.text,
                      background: C.white,
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select an instrument</option>
                    <option value="piano">Piano</option>
                    <option value="guitar">Guitar</option>
                    <option value="violin">Violin</option>
                    <option value="viola">Viola</option>
                    <option value="flute">Flute</option>
                    <option value="bass">Bass</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ color: C.text, fontSize: "0.9rem", fontWeight: 500, display: "block", marginBottom: "0.5rem" }}>
                    Session Duration
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {["60", "90", "120"].map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setFormData({ ...formData, duration: duration as "60" | "90" | "120" })}
                        className="p-3 rounded-lg font-semibold transition-all cursor-pointer"
                        style={{
                          background: formData.duration === duration ? C.accent : C.card,
                          color: formData.duration === duration ? C.white : C.text,
                          border: `2px solid ${formData.duration === duration ? C.accent : C.border}`,
                        }}
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={() => setStep("time")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1"
                    style={{
                      background: C.accent,
                      color: C.white,
                      border: "none",
                    }}
                  >
                    {isLoading ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === "confirmation" && bookingConfirmation && (
            <div className="bg-white rounded-lg p-8 text-center" style={{ border: `2px solid ${C.accent}` }}>
              <div className="text-5xl mb-4">✓</div>
              <h2 className="font-display text-2xl mb-2" style={{ color: C.accent, fontWeight: 500 }}>
                Booking Confirmed!
              </h2>
              <p style={{ color: C.text, marginBottom: "2rem" }}>
                Your practice room has been reserved. A confirmation email has been sent to {bookingConfirmation.studentEmail}.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left" style={{ background: C.bgAlt }}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p style={{ color: C.muted, fontSize: "0.85rem", fontWeight: 500 }}>DATE</p>
                    <p style={{ color: C.text, fontWeight: 600, marginTop: "0.25rem" }}>
                      {formatDateDisplay(selectedDate!)}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: C.muted, fontSize: "0.85rem", fontWeight: 500 }}>TIME</p>
                    <p style={{ color: C.text, fontWeight: 600, marginTop: "0.25rem" }}>
                      {TIME_SLOTS.find((s) => s.start === selectedSlot)?.label}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: C.muted, fontSize: "0.85rem", fontWeight: 500 }}>DURATION</p>
                    <p style={{ color: C.text, fontWeight: 600, marginTop: "0.25rem" }}>
                      {formData.duration} minutes
                    </p>
                  </div>
                  <div>
                    <p style={{ color: C.muted, fontSize: "0.85rem", fontWeight: 500 }}>CONFIRMATION ID</p>
                    <p style={{ color: C.text, fontWeight: 600, marginTop: "0.25rem", fontFamily: "monospace", fontSize: "0.85rem" }}>
                      {bookingConfirmation.bookingId}
                    </p>
                  </div>
                </div>
              </div>

              <p style={{ color: C.muted, fontSize: "0.9rem", marginBottom: "2rem" }}>
                Redirecting you back to the home page in a few seconds...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
