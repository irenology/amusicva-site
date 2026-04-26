import { useState } from "react";
import { Check } from "lucide-react";

// Color scheme matching home page
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

const membershipTiers = [
  {
    name: "Weekday Afternoon",
    price: 109,
    period: "month",
    hours: "Before 1:30 PM",
    availability: "Weekdays only",
    features: [
      "3-day advance booking",
      "Up to 2 hours per day",
      "Minimum 3-month commitment",
      "Access before 1:30 PM on weekdays",
    ],
    highlighted: false,
  },
  {
    name: "Extended Access",
    price: 159,
    period: "month",
    hours: "Before 1:30 PM + After 8:00 PM",
    availability: "Weekdays",
    features: [
      "3-day advance booking",
      "Up to 2 hours per day",
      "Minimum 3-month commitment",
      "Morning/afternoon access (before 1:30 PM)",
      "Evening access (after 8:00 PM)",
    ],
    highlighted: true,
  },
  {
    name: "Premium Access",
    price: 209,
    period: "month",
    hours: "Full Access",
    availability: "Weekdays + Weekend evenings",
    features: [
      "3-day advance booking",
      "Up to 2 hours per day",
      "Minimum 3-month commitment",
      "Full day access on weekdays",
      "Evening access (after 8:00 PM) on weekdays",
      "Evening access (after 8:00 PM) on weekends",
    ],
    highlighted: false,
  },
];

const paymentMethods = [
  {
    name: "Zelle",
    icon: "💳",
    details: "Send payment to appassionatava@gmail.com",
  },
  {
    name: "Venmo",
    icon: "📱",
    details: "Send payment to @AppassionataMusicVA",
  },
  {
    name: "Cash",
    icon: "💵",
    details: "Pay in person at the studio",
  },
];

export default function MembershipPricing() {
  const [selectedTier, setSelectedTier] = useState<number>(1);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", paddingTop: "6rem" }}>
      {/* Header */}
      <div className="container py-12 text-center">
        <div
          className="inline-flex items-center gap-2 mb-8 font-ui text-xs tracking-widest uppercase"
          style={{ color: C.accent, letterSpacing: "0.2em" }}
        >
          <span className="w-8 h-px" style={{ background: C.accent }} />
          Piano Practice Room
          <span className="w-8 h-px" style={{ background: C.accent }} />
        </div>

        <h1
          className="font-display mb-4 leading-tight"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: C.text,
            fontWeight: 400,
            letterSpacing: "-0.01em",
          }}
        >
          Membership Plans
          <br />
          <span style={{ color: C.accent, fontStyle: "italic" }}>
            Flexible Access for Every Musician
          </span>
        </h1>

        <p
          className="max-w-2xl mx-auto"
          style={{ color: C.muted, fontSize: "1.1rem", fontWeight: 300 }}
        >
          Choose the membership that fits your schedule. All plans include 3-day advance booking and up to 2 hours per day.
        </p>
      </div>

      {/* Membership Tiers */}
      <div className="container py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {membershipTiers.map((tier, i) => (
            <div
              key={i}
              onClick={() => setSelectedTier(i)}
              className="rounded-lg p-8 cursor-pointer transition-all"
              style={{
                background: selectedTier === i ? C.white : C.card,
                border: `2px solid ${selectedTier === i ? C.accent : C.border}`,
                transform: tier.highlighted ? "scale(1.05)" : "scale(1)",
                boxShadow: tier.highlighted ? `0 10px 30px ${C.accent}20` : "none",
              }}
            >
              {tier.highlighted && (
                <div
                  className="inline-block px-3 py-1 rounded text-xs font-bold mb-4"
                  style={{ background: C.accent, color: C.white }}
                >
                  MOST POPULAR
                </div>
              )}

              <h3 className="font-display text-2xl mb-2" style={{ color: C.text, fontWeight: 500 }}>
                {tier.name}
              </h3>

              <div className="mb-4">
                <span className="font-display text-4xl" style={{ color: C.accent, fontWeight: 600 }}>
                  ${tier.price}
                </span>
                <span style={{ color: C.muted, fontSize: "0.9rem" }}> / {tier.period}</span>
              </div>

              <p style={{ color: C.textMid, fontSize: "0.9rem", marginBottom: "1rem" }}>
                <strong>Hours:</strong> {tier.hours}
              </p>

              <p style={{ color: C.muted, fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                <strong>Availability:</strong> {tier.availability}
              </p>

              <div className="space-y-3">
                {tier.features.map((feature, j) => (
                  <div key={j} className="flex gap-3">
                    <Check size={18} style={{ color: C.accent, flexShrink: 0, marginTop: "0.25rem" }} />
                    <span style={{ color: C.text, fontSize: "0.9rem" }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowPaymentInfo(true)}
                className="w-full mt-8 py-3 rounded font-ui font-600 transition-all"
                style={{
                  background: selectedTier === i ? C.accent : C.border,
                  color: selectedTier === i ? C.white : C.text,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>

        {/* Non-Member Option */}
        <div
          className="rounded-lg p-8 text-center"
          style={{ background: C.card, border: `1px solid ${C.border}` }}
        >
          <h3 className="font-display text-xl mb-2" style={{ color: C.text, fontWeight: 500 }}>
            Drop-In Rate
          </h3>
          <p style={{ color: C.muted, fontSize: "0.95rem" }}>
            Not ready for a membership? Book a single session for{" "}
            <span style={{ color: C.accent, fontWeight: 600 }}>$25/hour</span>
          </p>
          <p style={{ color: C.textMid, fontSize: "0.85rem", marginTop: "0.5rem" }}>
            Contact us at <a href="mailto:appassionatava@gmail.com" style={{ color: C.accent }}>
              appassionatava@gmail.com
            </a>{" "}
            to arrange
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      {showPaymentInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowPaymentInfo(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-lg p-8"
            style={{ background: C.white }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl mb-6" style={{ color: C.text, fontWeight: 500 }}>
              Payment Methods
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {paymentMethods.map((method, i) => (
                <div
                  key={i}
                  className="p-6 rounded text-center"
                  style={{ background: C.card, border: `1px solid ${C.border}` }}
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{method.icon}</div>
                  <h3 className="font-display text-lg mb-2" style={{ color: C.text, fontWeight: 500 }}>
                    {method.name}
                  </h3>
                  <p style={{ color: C.muted, fontSize: "0.9rem" }}>{method.details}</p>
                </div>
              ))}
            </div>

            <div
              className="p-6 rounded mb-8"
              style={{ background: `${C.accent}10`, border: `1px solid ${C.accent}30` }}
            >
              <p style={{ color: C.text, fontSize: "0.95rem", lineHeight: "1.6" }}>
                <strong>Next Steps:</strong> After selecting your membership plan and making payment, please contact us at{" "}
                <a href="mailto:appassionatava@gmail.com" style={{ color: C.accent, fontWeight: 600 }}>
                  appassionatava@gmail.com
                </a>{" "}
                with your payment confirmation. We'll set up your account and provide access details.
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowPaymentInfo(false)}
                className="px-6 py-2 rounded font-ui"
                style={{
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <a
                href="mailto:appassionatava@gmail.com?subject=Piano%20Practice%20Room%20Membership%20Inquiry"
                className="px-6 py-2 rounded font-ui font-600"
                style={{
                  background: C.accent,
                  color: C.white,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="container py-12 text-center">
        <p style={{ color: C.muted, fontSize: "0.9rem" }}>
          <strong>Security Deposit:</strong> $150 required for all memberships
        </p>
        <p style={{ color: C.muted, fontSize: "0.9rem", marginTop: "0.5rem" }}>
          <strong>ID Verification:</strong> Required for membership registration
        </p>
      </div>
    </div>
  );
}
