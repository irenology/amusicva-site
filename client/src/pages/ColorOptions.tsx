/* Color Options Preview Page — for user to choose a background style */

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663333334060/LSYMFpTaKgJ4fs4qHQmZSd/hero-piano-7t3PB5qqBMgyZu6tKiyRjB.webp";

const options = [
  {
    id: "A",
    name: "奶油白 · Cream",
    desc: "温暖的米白色背景，搭配深棕色文字和金色点缀。优雅、古典、如音乐厅般精致。",
    bg: "#FAF7F2",
    text: "#2C1A0E",
    accent: "#B8860B",
    nav: "#2C1A0E",
    cardBg: "#F2EDE4",
    border: "#D4C5A9",
    muted: "#8B7355",
    tag: "经典 · 优雅",
  },
  {
    id: "B",
    name: "珍珠灰 · Pearl",
    desc: "柔和的浅灰白背景，搭配深炭色文字和琥珀金强调色。现代、简洁、专业。",
    bg: "#F5F5F3",
    text: "#1A1A1A",
    accent: "#C8860A",
    nav: "#1A1A1A",
    cardBg: "#EBEBEA",
    border: "#D0CFC9",
    muted: "#6B6B6B",
    tag: "现代 · 简洁",
  },
  {
    id: "C",
    name: "暖沙 · Sand",
    desc: "温暖的沙米色背景，搭配深棕文字和铜金强调。如音乐厅木质地板般温润自然。",
    bg: "#F8F2E8",
    text: "#3D2B1F",
    accent: "#A0522D",
    nav: "#3D2B1F",
    cardBg: "#EFE8D8",
    border: "#C9B99A",
    muted: "#7A6248",
    tag: "温润 · 自然",
  },
  {
    id: "D",
    name: "月白 · Ivory",
    desc: "纯净的象牙白背景，搭配深海军蓝文字和金色点缀。高贵、清晰、如演奏厅白墙。",
    bg: "#FDFCF8",
    text: "#1C2B3A",
    accent: "#B8960C",
    nav: "#1C2B3A",
    cardBg: "#F5F3EC",
    border: "#DDD9CC",
    muted: "#5A6B7A",
    tag: "高贵 · 清晰",
  },
];

function ColorCard({ opt }: { opt: typeof options[0] }) {
  return (
    <div
      style={{
        background: opt.bg,
        border: `1.5px solid ${opt.border}`,
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {/* Mini Nav */}
      <div
        style={{
          background: opt.bg,
          borderBottom: `1px solid ${opt.border}`,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: opt.text, fontWeight: 600, fontSize: "13px", fontFamily: "'Cormorant Garamond', serif" }}>
          Appassionata
        </span>
        <span
          style={{
            background: opt.accent,
            color: "#fff",
            fontSize: "10px",
            padding: "3px 10px",
            borderRadius: "3px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600,
            letterSpacing: "0.05em",
          }}
        >
          Book Now
        </span>
      </div>

      {/* Mini Hero */}
      <div style={{ position: "relative", height: "120px", overflow: "hidden" }}>
        <img
          src={HERO_IMG}
          alt="preview"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }}
        />
        <div style={{ position: "absolute", inset: 0, background: opt.bg, opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, padding: "14px 16px" }}>
          <div style={{ color: opt.accent, fontSize: "9px", letterSpacing: "0.2em", fontFamily: "'Outfit', sans-serif", marginBottom: "6px" }}>
            FAIRFAX, VIRGINIA
          </div>
          <div style={{ color: opt.text, fontSize: "20px", fontWeight: 400, lineHeight: 1.1, fontFamily: "'Cormorant Garamond', serif" }}>
            Learn with Joy,
          </div>
          <div style={{ color: opt.accent, fontSize: "20px", fontWeight: 600, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif" }}>
            Play with Passion.
          </div>
          <div style={{ color: opt.muted, fontSize: "9px", marginTop: "6px", fontFamily: "'Outfit', sans-serif", fontWeight: 300 }}>
            World-class musicians. Personalized instruction.
          </div>
        </div>
      </div>

      {/* Mini Cards */}
      <div style={{ padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        {["Piano", "Guitar", "Violin", "Flute"].map((inst) => (
          <div
            key={inst}
            style={{
              background: opt.cardBg,
              border: `1px solid ${opt.border}`,
              borderRadius: "4px",
              padding: "6px 8px",
              color: opt.text,
              fontSize: "10px",
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
            }}
          >
            {inst}
          </div>
        ))}
      </div>

      {/* Label */}
      <div
        style={{
          padding: "10px 16px 14px",
          borderTop: `1px solid ${opt.border}`,
          background: opt.cardBg,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
          <span
            style={{
              color: opt.text,
              fontWeight: 600,
              fontSize: "15px",
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            方案 {opt.id} — {opt.name}
          </span>
          <span
            style={{
              background: `${opt.accent}22`,
              color: opt.accent,
              fontSize: "9px",
              padding: "2px 8px",
              borderRadius: "20px",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            {opt.tag}
          </span>
        </div>
        <p
          style={{
            color: opt.muted,
            fontSize: "11px",
            lineHeight: 1.5,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 300,
            margin: 0,
          }}
        >
          {opt.desc}
        </p>
      </div>
    </div>
  );
}

export default function ColorOptions() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F0EDE8",
        padding: "40px 24px",
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.5rem",
            fontWeight: 500,
            color: "#1A1A1A",
            marginBottom: "8px",
          }}
        >
          背景色方案选择
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: "14px", marginBottom: "36px", fontWeight: 300 }}>
          以下四个方案均保留原有的金色/琥珀色强调色，仅调整背景为明亮色调。请选择您喜欢的一个。
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
            gap: "24px",
          }}
        >
          {options.map((opt) => (
            <ColorCard key={opt.id} opt={opt} />
          ))}
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "36px",
            color: "#8B7355",
            fontSize: "13px",
            fontWeight: 300,
          }}
        >
          告诉我您喜欢哪个方案（A、B、C 或 D），我将立即应用到整个网站。
        </p>
      </div>
    </div>
  );
}
