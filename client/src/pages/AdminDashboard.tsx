import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronLeft, LogOut, Trash2, Edit3, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

const C = {
  bg: "#FAF7F2",
  bgAlt: "#F5EFE6",
  card: "#F2EDE4",
  border: "#D4C5A9",
  text: "#2C1A0E",
  textMid: "#5C3D20",
  muted: "#8B7355",
  accent: "#B8860B",
  white: "#FDFCF9",
};

// Read admin session from localStorage (set by AdminLogin after successful API login)
function getLocalAdminSession(): { id: number; email: string; role: string; name: string; loggedInAt: number } | null {
  try {
    const raw = localStorage.getItem("admin_session");
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || session.role !== "admin") return null;
    // Session expires after 24 hours
    if (Date.now() - session.loggedInAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem("admin_session");
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export default function AdminDashboard() {
  const { user: authUser, isAuthenticated, loading, logout } = useAuth();
  const [localSession, setLocalSession] = useState<ReturnType<typeof getLocalAdminSession>>(null);

  useEffect(() => {
    setLocalSession(getLocalAdminSession());
  }, []);

  // Use either the tRPC-authenticated user OR the localStorage admin session
  const user = authUser || (localSession ? { ...localSession, name: localSession.name || localSession.email } : null);
  const isAdmin = user?.role === "admin";
  const isLoading = loading && !localSession;

  const [activeTab, setActiveTab] = useState<"lessons" | "practice" | "blocked">("lessons");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [actionType, setActionType] = useState<"cancel" | "reschedule" | null>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockData, setBlockData] = useState({
    blockDate: "",
    startTime: "",
    endTime: "",
    reason: "",
  });
  const [filters, setFilters] = useState({
    status: "all",
    dateFrom: "",
    dateTo: "",
  });
  const [rescheduleData, setRescheduleData] = useState({
    bookingId: 0,
    newDate: "",
    newTime: "",
    notes: "",
  });
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  // Fetch bookings data
  const lessonBookingsQuery = trpc.bookings.getAllLessonBookings.useQuery();
  const practiceBookingsQuery = trpc.bookings.getAllPracticeRoomBookings.useQuery();
  const blockedSlotsQuery = trpc.bookings.getBlockedTimeSlots.useQuery();

  // Mutations
  const cancelLessonMutation = trpc.bookings.cancelLessonBooking.useMutation({
    onSuccess: () => {
      lessonBookingsQuery.refetch();
      setSelectedBooking(null);
      setActionType(null);
    },
  });

  const cancelPracticeMutation = trpc.bookings.cancelPracticeRoomBooking.useMutation({
    onSuccess: () => {
      practiceBookingsQuery.refetch();
      setSelectedBooking(null);
      setActionType(null);
    },
  });

  const blockSlotMutation = trpc.bookings.blockTimeSlot.useMutation({
    onSuccess: () => {
      blockedSlotsQuery.refetch();
      setShowBlockModal(false);
      setBlockData({ blockDate: "", startTime: "", endTime: "", reason: "" });
    },
  });

  const unblockSlotMutation = trpc.bookings.unblockTimeSlot.useMutation({
    onSuccess: () => {
      blockedSlotsQuery.refetch();
    },
  });

  // Check authorization
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div style={{ textAlign: "center", color: C.text }}>
          <div style={{ fontSize: "1.2rem" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.bg }}>
        <div
          className="p-8 rounded-lg text-center max-w-md"
          style={{ background: C.white, border: `1px solid ${C.border}` }}
        >
          <h1 className="font-display text-2xl mb-4" style={{ color: C.text, fontWeight: 500 }}>
            Access Denied
          </h1>
          <p style={{ color: C.muted, marginBottom: "2rem" }}>
            You do not have permission to access this page. Admin access required.
          </p>
          <a href="/admin/login" style={{ color: C.accent, textDecoration: "none", fontWeight: 500 }}>
            ← Go to Admin Login
          </a>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    localStorage.removeItem("admin_session");
    try {
      await logout();
    } catch {
      // ignore
    }
    window.location.href = "/";
  };

  const lessonBookings = lessonBookingsQuery.data || [];
  const practiceBookings = practiceBookingsQuery.data || [];
  const blockedSlots = blockedSlotsQuery.data || [];

  const filteredLessonBookings = lessonBookings.filter((b: any) => {
    if (filters.status !== "all" && b.status !== filters.status) return false;
    return true;
  });

  const filteredPracticeBookings = practiceBookings.filter((b: any) => {
    if (filters.status !== "all" && b.status !== filters.status) return false;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ background: C.bg }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
        style={{ background: C.white, borderBottom: `1px solid ${C.border}` }}
      >
        <div className="flex items-center gap-4">
          <a href="/" style={{ color: C.muted, display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none", fontSize: "0.9rem" }}>
            <ChevronLeft size={16} />
            Back to Site
          </a>
          <h1 className="font-display text-xl" style={{ color: C.text, fontWeight: 500 }}>
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span style={{ color: C.muted, fontSize: "0.9rem" }}>
            {(user as any)?.name || (user as any)?.email || "Admin User"}
          </span>
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: `1px solid ${C.border}`,
              borderRadius: "0.375rem",
              color: C.text,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(["lessons", "practice", "blocked"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.625rem 1.25rem",
                borderRadius: "0.375rem",
                border: `1px solid ${activeTab === tab ? C.accent : C.border}`,
                background: activeTab === tab ? C.accent : "transparent",
                color: activeTab === tab ? C.white : C.text,
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: activeTab === tab ? 600 : 400,
                textTransform: "capitalize",
              }}
            >
              {tab === "lessons" ? "Lesson Bookings" : tab === "practice" ? "Practice Room Bookings" : "Blocked Time Slots"}
            </button>
          ))}
        </div>

        {/* Filters */}
        {activeTab !== "blocked" && (
          <div className="flex gap-4 mb-6 flex-wrap">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              style={{
                padding: "0.5rem 1rem",
                border: `1px solid ${C.border}`,
                borderRadius: "0.375rem",
                background: C.white,
                color: C.text,
                fontSize: "0.9rem",
              }}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {/* Lesson Bookings Tab */}
        {activeTab === "lessons" && (
          <div>
            <h2 className="font-display text-xl mb-4" style={{ color: C.text, fontWeight: 500 }}>
              Lesson Bookings ({filteredLessonBookings.length})
            </h2>
            {lessonBookingsQuery.isLoading ? (
              <div style={{ color: C.muted }}>Loading...</div>
            ) : filteredLessonBookings.length === 0 ? (
              <div
                className="p-8 rounded-lg text-center"
                style={{ background: C.white, border: `1px solid ${C.border}`, color: C.muted }}
              >
                No lesson bookings found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLessonBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-lg"
                    style={{ background: C.white, border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium" style={{ color: C.text }}>
                          {booking.studentName}
                        </div>
                        <div style={{ color: C.muted, fontSize: "0.9rem" }}>
                          {booking.studentEmail} · {booking.teacherName} · {booking.duration} min
                        </div>
                        {booking.notes && (
                          <div style={{ color: C.textMid, fontSize: "0.85rem", marginTop: "0.25rem" }}>
                            {booking.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            background:
                              booking.status === "confirmed"
                                ? "#22c55e20"
                                : booking.status === "cancelled"
                                ? "#ef444420"
                                : "#f59e0b20",
                            color:
                              booking.status === "confirmed"
                                ? "#16a34a"
                                : booking.status === "cancelled"
                                ? "#dc2626"
                                : "#d97706",
                          }}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setActionType("cancel");
                            }}
                            style={{
                              padding: "0.25rem 0.5rem",
                              background: "transparent",
                              border: `1px solid #ef4444`,
                              borderRadius: "0.25rem",
                              color: "#ef4444",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Trash2 size={12} />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Practice Room Bookings Tab */}
        {activeTab === "practice" && (
          <div>
            <h2 className="font-display text-xl mb-4" style={{ color: C.text, fontWeight: 500 }}>
              Practice Room Bookings ({filteredPracticeBookings.length})
            </h2>
            {practiceBookingsQuery.isLoading ? (
              <div style={{ color: C.muted }}>Loading...</div>
            ) : filteredPracticeBookings.length === 0 ? (
              <div
                className="p-8 rounded-lg text-center"
                style={{ background: C.white, border: `1px solid ${C.border}`, color: C.muted }}
              >
                No practice room bookings found.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPracticeBookings.map((booking: any) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-lg"
                    style={{ background: C.white, border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium" style={{ color: C.text }}>
                          {booking.studentName}
                        </div>
                        <div style={{ color: C.muted, fontSize: "0.9rem" }}>
                          {booking.studentEmail} · {booking.roomType} · {booking.hours}h
                        </div>
                        {booking.notes && (
                          <div style={{ color: C.textMid, fontSize: "0.85rem", marginTop: "0.25rem" }}>
                            {booking.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.8rem",
                            fontWeight: 500,
                            background:
                              booking.status === "confirmed"
                                ? "#22c55e20"
                                : booking.status === "cancelled"
                                ? "#ef444420"
                                : "#f59e0b20",
                            color:
                              booking.status === "confirmed"
                                ? "#16a34a"
                                : booking.status === "cancelled"
                                ? "#dc2626"
                                : "#d97706",
                          }}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setActionType("cancel");
                            }}
                            style={{
                              padding: "0.25rem 0.5rem",
                              background: "transparent",
                              border: `1px solid #ef4444`,
                              borderRadius: "0.25rem",
                              color: "#ef4444",
                              cursor: "pointer",
                              fontSize: "0.8rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                            }}
                          >
                            <Trash2 size={12} />
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Blocked Time Slots Tab */}
        {activeTab === "blocked" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl" style={{ color: C.text, fontWeight: 500 }}>
                Blocked Time Slots ({blockedSlots.length})
              </h2>
              <button
                onClick={() => setShowBlockModal(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  background: C.accent,
                  border: "none",
                  borderRadius: "0.375rem",
                  color: C.white,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                <Lock size={16} />
                Block Time Slot
              </button>
            </div>
            {blockedSlotsQuery.isLoading ? (
              <div style={{ color: C.muted }}>Loading...</div>
            ) : blockedSlots.length === 0 ? (
              <div
                className="p-8 rounded-lg text-center"
                style={{ background: C.white, border: `1px solid ${C.border}`, color: C.muted }}
              >
                No blocked time slots.
              </div>
            ) : (
              <div className="space-y-3">
                {blockedSlots.map((slot: any) => (
                  <div
                    key={slot.id}
                    className="p-4 rounded-lg"
                    style={{ background: C.white, border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium" style={{ color: C.text }}>
                          {slot.blockDate} · {slot.startTime} – {slot.endTime}
                        </div>
                        <div style={{ color: C.muted, fontSize: "0.9rem" }}>
                          {slot.roomType ? `Room: ${slot.roomType}` : "All rooms"}
                          {slot.reason ? ` · ${slot.reason}` : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => unblockSlotMutation.mutate({ id: slot.id })}
                        style={{
                          padding: "0.25rem 0.5rem",
                          background: "transparent",
                          border: `1px solid #ef4444`,
                          borderRadius: "0.25rem",
                          color: "#ef4444",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                        }}
                      >
                        <Trash2 size={12} />
                        Unblock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {selectedBooking && actionType === "cancel" && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => { setSelectedBooking(null); setActionType(null); }}
        >
          <div
            className="p-6 rounded-lg max-w-md w-full mx-4"
            style={{ background: C.white }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg mb-4" style={{ color: C.text, fontWeight: 500 }}>
              Cancel Booking
            </h3>
            <p style={{ color: C.muted, marginBottom: "1.5rem" }}>
              Are you sure you want to cancel the booking for <strong>{selectedBooking.studentName}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setSelectedBooking(null); setActionType(null); }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.375rem",
                  color: C.text,
                  cursor: "pointer",
                }}
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  if (activeTab === "lessons") {
                    cancelLessonMutation.mutate({ id: selectedBooking.id });
                  } else {
                    cancelPracticeMutation.mutate({ id: selectedBooking.id });
                  }
                }}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#ef4444",
                  border: "none",
                  borderRadius: "0.375rem",
                  color: C.white,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Time Slot Modal */}
      {showBlockModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowBlockModal(false)}
        >
          <div
            className="p-6 rounded-lg max-w-md w-full mx-4"
            style={{ background: C.white }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg mb-4" style={{ color: C.text, fontWeight: 500 }}>
              Block Time Slot
            </h3>
            <div className="space-y-4">
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: C.text, fontSize: "0.9rem" }}>Date</label>
                <input
                  type="date"
                  value={blockData.blockDate}
                  onChange={(e) => setBlockData({ ...blockData, blockDate: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem", border: `1px solid ${C.border}`, borderRadius: "0.375rem", fontSize: "0.9rem" }}
                />
              </div>
              <div className="flex gap-3">
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.25rem", color: C.text, fontSize: "0.9rem" }}>Start Time</label>
                  <input
                    type="time"
                    value={blockData.startTime}
                    onChange={(e) => setBlockData({ ...blockData, startTime: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", border: `1px solid ${C.border}`, borderRadius: "0.375rem", fontSize: "0.9rem" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.25rem", color: C.text, fontSize: "0.9rem" }}>End Time</label>
                  <input
                    type="time"
                    value={blockData.endTime}
                    onChange={(e) => setBlockData({ ...blockData, endTime: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem", border: `1px solid ${C.border}`, borderRadius: "0.375rem", fontSize: "0.9rem" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: C.text, fontSize: "0.9rem" }}>Reason (optional)</label>
                <input
                  type="text"
                  value={blockData.reason}
                  onChange={(e) => setBlockData({ ...blockData, reason: e.target.value })}
                  placeholder="e.g. Holiday, Maintenance..."
                  style={{ width: "100%", padding: "0.5rem", border: `1px solid ${C.border}`, borderRadius: "0.375rem", fontSize: "0.9rem" }}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowBlockModal(false)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  borderRadius: "0.375rem",
                  color: C.text,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!blockData.blockDate || !blockData.startTime || !blockData.endTime) return;
                  blockSlotMutation.mutate({ ...blockData, createdBy: user?.id || 0 });
                }}
                disabled={!blockData.blockDate || !blockData.startTime || !blockData.endTime}
                style={{
                  padding: "0.5rem 1rem",
                  background: C.accent,
                  border: "none",
                  borderRadius: "0.375rem",
                  color: C.white,
                  cursor: "pointer",
                  fontWeight: 500,
                  opacity: !blockData.blockDate || !blockData.startTime || !blockData.endTime ? 0.6 : 1,
                }}
              >
                Block Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
