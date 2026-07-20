const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "KisanAI Presentation";

const mkShadow = () => ({
  type: "outer",
  color: "000000",
  blur: 8,
  offset: 3,
  angle: 45,
  opacity: 0.10
});

// Helper for adding slide header bar
const addHeader = (slide, titleText, rightText = "") => {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.9,
    fill: { color: "14532D" }
  });
  slide.addText(titleText, {
    x: 0.5, y: 0.08, w: 6.0, h: 0.74,
    fontFace: "Calibri", fontSize: 26, bold: true, color: "FFFFFF",
    valign: "middle"
  });
  if (rightText) {
    slide.addText(rightText, {
      x: 6.2, y: 0.15, w: 3.3, h: 0.6,
      fontFace: "Calibri", fontSize: 11, color: "86EFAC",
      align: "right", italic: true, valign: "middle"
    });
  }
};

// ==========================================
// SLIDE 1 — COVER
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "14532D" };

  // Decorative circles top right
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -1.0, w: 4.0, h: 4.0,
    fill: { color: "166534", transparency: 60 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2, y: -0.3, w: 2.5, h: 2.5,
    fill: { color: "16A34A", transparency: 70 }
  });

  // Decorative circle bottom left
  slide.addShape(pres.shapes.OVAL, {
    x: -0.8, y: 3.5, w: 3.0, h: 3.0,
    fill: { color: "166534", transparency: 65 }
  });

  // App icon box
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.6, y: 0.8, w: 1.0, h: 1.0,
    fill: { color: "16A34A" },
    rectRadius: 0.15,
    shadow: mkShadow()
  });
  slide.addText("🌱", {
    x: 0.6, y: 0.8, w: 1.0, h: 1.0,
    fontSize: 28, align: "center", valign: "middle"
  });

  // KisanAI title
  slide.addText("KisanAI", {
    x: 0.6, y: 2.0, w: 6.0, h: 0.95,
    fontFace: "Calibri", fontSize: 52, bold: true, color: "FFFFFF"
  });

  // Tagline
  slide.addText("AI-Powered Crop Disease Detection & Smart Agriculture Platform", {
    x: 0.6, y: 2.95, w: 6.5, h: 0.6,
    fontFace: "Calibri", fontSize: 16, color: "86EFAC"
  });

  // Thin line divider
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 3.65, w: 2.2, h: 0.04,
    fill: { color: "22C55E" }
  });

  // Sub label
  slide.addText("Internship Project  •  2026", {
    x: 0.6, y: 3.82, w: 6.0, h: 0.38,
    fontFace: "Calibri", fontSize: 13, color: "6EE7B7", italic: true
  });

  // Three stat cards right side
  const stats = [
    { val: "38", label: "Disease Classes", y: 1.0 },
    { val: "54K", label: "Training Images", y: 2.25 },
    { val: "92%", label: "Model Accuracy", y: 3.5 }
  ];

  stats.forEach(st => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 7.4, y: st.y, w: 2.1, h: 1.0,
      fill: { color: "166534", transparency: 35 },
      rectRadius: 0.12,
      line: { color: "22C55E", width: 1 }
    });
    slide.addText(st.val, {
      x: 7.4, y: st.y + 0.08, w: 2.1, h: 0.48,
      fontFace: "Calibri", fontSize: 26, bold: true, color: "FFFFFF", align: "center"
    });
    slide.addText(st.label, {
      x: 7.4, y: st.y + 0.56, w: 2.1, h: 0.35,
      fontFace: "Calibri", fontSize: 10, color: "86EFAC", align: "center"
    });
  });
}

// ==========================================
// SLIDE 2 — TEAM INTRODUCTION
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  addHeader(slide, "Meet The Team", "Internship Project 2026");

  // LEFT CARD — Dhruv Patel
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.15, w: 4.4, h: 4.1,
    fill: { color: "F0FDF4" },
    rectRadius: 0.15,
    line: { color: "BBF7D0", width: 1 },
    shadow: mkShadow()
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 2.0, y: 1.35, w: 1.2, h: 1.2,
    fill: { color: "16A34A" }
  });
  slide.addText("👨‍💻", {
    x: 2.0, y: 1.35, w: 1.2, h: 1.2,
    fontSize: 28, align: "center", valign: "middle"
  });

  slide.addText("Dhruv Patel", {
    x: 0.6, y: 2.62, w: 4.0, h: 0.4,
    fontFace: "Calibri", fontSize: 20, bold: true, color: "14532D", align: "center"
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 1.15, y: 3.10, w: 2.9, h: 0.36,
    fill: { color: "16A34A" },
    rectRadius: 0.1
  });
  slide.addText("Full Stack Developer", {
    x: 1.15, y: 3.10, w: 2.9, h: 0.36,
    fontFace: "Calibri", fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle"
  });

  slide.addText("React  •  FastAPI  •  MongoDB", {
    x: 0.6, y: 3.52, w: 4.0, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: "6B7280", align: "center"
  });

  slide.addText([
    { text: "Frontend UI & React Development" },
    { text: "Backend APIs & Database Design" },
    { text: "JWT Auth & Cloud Deployment" },
    { text: "Vercel + Render Infrastructure" }
  ], {
    x: 0.65, y: 3.92, w: 3.9, h: 1.2,
    fontFace: "Calibri", fontSize: 11, color: "374151",
    bullet: true, paraSpaceAfter: 2
  });

  // RIGHT CARD — Prem Patel
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.15, w: 4.4, h: 4.1,
    fill: { color: "F0FDF4" },
    rectRadius: 0.15,
    line: { color: "BBF7D0", width: 1 },
    shadow: mkShadow()
  });

  slide.addShape(pres.shapes.OVAL, {
    x: 6.8, y: 1.35, w: 1.2, h: 1.2,
    fill: { color: "059669" }
  });
  slide.addText("🤖", {
    x: 6.8, y: 1.35, w: 1.2, h: 1.2,
    fontSize: 28, align: "center", valign: "middle"
  });

  slide.addText("Prem Patel", {
    x: 5.4, y: 2.62, w: 4.0, h: 0.4,
    fontFace: "Calibri", fontSize: 20, bold: true, color: "14532D", align: "center"
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.95, y: 3.10, w: 2.9, h: 0.36,
    fill: { color: "059669" },
    rectRadius: 0.1
  });
  slide.addText("AI / ML Engineer", {
    x: 5.95, y: 3.10, w: 2.9, h: 0.36,
    fontFace: "Calibri", fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle"
  });

  slide.addText("PyTorch  •  HuggingFace  •  Groq", {
    x: 5.4, y: 3.52, w: 4.0, h: 0.3,
    fontFace: "Calibri", fontSize: 11, color: "6B7280", align: "center"
  });

  slide.addText([
    { text: "EfficientNetB0 Model Training" },
    { text: "Disease Classification System" },
    { text: "Plant & Soil Analysis APIs" },
    { text: "HuggingFace Spaces Deployment" }
  ], {
    x: 5.45, y: 3.92, w: 3.9, h: 1.2,
    fontFace: "Calibri", fontSize: 11, color: "374151",
    bullet: true, paraSpaceAfter: 2
  });
}

// ==========================================
// SLIDE 3 — PROBLEM STATEMENT
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "F9FAFB" };

  // Section label
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.25, w: 1.8, h: 0.35,
    fill: { color: "FEF2F2" },
    rectRadius: 0.08,
    line: { color: "FECACA", width: 1 }
  });
  slide.addText("THE PROBLEM", {
    x: 0.5, y: 0.25, w: 1.8, h: 0.35,
    fontFace: "Calibri", fontSize: 10, bold: true, color: "DC2626", align: "center", valign: "middle"
  });

  slide.addText("Indian Farmers Face a Silent Crisis", {
    x: 0.5, y: 0.68, w: 9.0, h: 0.65,
    fontFace: "Calibri", fontSize: 30, bold: true, color: "111827"
  });

  const cards = [
    { x: 0.4, y: 1.5, emoji: "🌾", title: "Massive Crop Loss", desc: "30 to 40 percent of crops lost annually due to undetected diseases" },
    { x: 5.2, y: 1.5, emoji: "📍", title: "No Rural Expert Access", desc: "Less than 2 percent of farmers have access to agricultural experts" },
    { x: 0.4, y: 3.3, emoji: "🗣️", title: "Language Barrier", desc: "Most agricultural tools only available in English, not Hindi" },
    { x: 5.2, y: 3.3, emoji: "⏱️", title: "Slow Diagnosis", desc: "Lab-based diagnosis takes days. Farmers lose critical treatment time" }
  ];

  cards.forEach(c => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: c.y, w: 4.4, h: 1.6,
      fill: { color: "FFFFFF" },
      rectRadius: 0.15,
      line: { color: "FEE2E2", width: 1 },
      shadow: mkShadow()
    });

    slide.addText(c.emoji, {
      x: c.x + 0.2, y: c.y + 0.15, w: 0.6, h: 0.6,
      fontSize: 26
    });

    slide.addText(c.title, {
      x: c.x + 0.9, y: c.y + 0.18, w: 3.3, h: 0.38,
      fontFace: "Calibri", fontSize: 14, bold: true, color: "DC2626"
    });

    slide.addText(c.desc, {
      x: c.x + 0.2, y: c.y + 0.78, w: 4.0, h: 0.7,
      fontFace: "Calibri", fontSize: 11, color: "374151"
    });
  });

  // Bottom stat banner
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 5.08, w: 9.2, h: 0.4,
    fill: { color: "14532D" },
    rectRadius: 0.1
  });
  slide.addText("India has 140 million farmers — less than 2% have timely crop disease diagnosis", {
    x: 0.4, y: 5.08, w: 9.2, h: 0.4,
    fontFace: "Calibri", fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle"
  });
}

// ==========================================
// SLIDE 4 — OUR SOLUTION
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "14532D" };

  slide.addText("OUR SOLUTION", {
    x: 0.5, y: 0.22, w: 9.0, h: 0.35,
    fontFace: "Calibri", fontSize: 11, bold: true, color: "22C55E", charSpacing: 4
  });

  slide.addText("Introducing KisanAI", {
    x: 0.5, y: 0.58, w: 9.0, h: 0.65,
    fontFace: "Calibri", fontSize: 36, bold: true, color: "FFFFFF"
  });

  slide.addText("Scan. Detect. Treat. — In under 5 seconds, on any phone.", {
    x: 0.5, y: 1.25, w: 8.5, h: 0.4,
    fontFace: "Calibri", fontSize: 15, color: "86EFAC", italic: true
  });

  const boxes = [
    { x: 0.5, num: "01", emoji: "📷", title: "Capture", desc: "Take photo\nwith phone\ncamera" },
    { x: 2.65, num: "02", emoji: "⚡", title: "Upload", desc: "Image sent\nto AI\nsecurely" },
    { x: 4.8, num: "03", emoji: "🤖", title: "Analyze", desc: "EfficientNet\nmodel runs\ninference" },
    { x: 6.95, num: "04", emoji: "💊", title: "Treat", desc: "Disease name\n+ treatment\nadvice given" }
  ];

  boxes.forEach(b => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: b.x, y: 1.9, w: 1.7, h: 2.7,
      fill: { color: "166534", transparency: 20 },
      rectRadius: 0.15,
      line: { color: "22C55E", width: 1 }
    });

    slide.addShape(pres.shapes.OVAL, {
      x: b.x + 0.58, y: 2.05, w: 0.54, h: 0.54,
      fill: { color: "22C55E" }
    });
    slide.addText(b.num, {
      x: b.x + 0.58, y: 2.05, w: 0.54, h: 0.54,
      fontFace: "Calibri", fontSize: 13, bold: true, color: "14532D", align: "center", valign: "middle"
    });

    slide.addText(b.emoji, {
      x: b.x, y: 2.65, w: 1.7, h: 0.5,
      fontSize: 26, align: "center"
    });

    slide.addText(b.title, {
      x: b.x + 0.1, y: 3.2, w: 1.5, h: 0.35,
      fontFace: "Calibri", fontSize: 15, bold: true, color: "FFFFFF", align: "center"
    });

    slide.addText(b.desc, {
      x: b.x + 0.1, y: 3.6, w: 1.5, h: 0.85,
      fontFace: "Calibri", fontSize: 11, color: "86EFAC", align: "center"
    });
  });

  // Arrows
  const arrows = [2.26, 4.41, 6.56];
  arrows.forEach(ax => {
    slide.addText("→", {
      x: ax, y: 3.0, w: 0.35, h: 0.4,
      fontFace: "Calibri", fontSize: 22, bold: true, color: "22C55E", align: "center"
    });
  });

  // Live URL card bottom right
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 4.85, w: 2.85, h: 0.55,
    fill: { color: "166534" },
    rectRadius: 0.1,
    line: { color: "22C55E", width: 1 }
  });
  slide.addText("🔗 kisan-ai-sandy.vercel.app", {
    x: 6.8, y: 4.85, w: 2.85, h: 0.55,
    fontFace: "Calibri", fontSize: 11, color: "86EFAC", align: "center", valign: "middle"
  });
}

// ==========================================
// SLIDE 5 — TECH STACK
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  addHeader(slide, "Tech Stack & Architecture");

  const cols = [
    {
      x: 0.35, bg: "EFF6FF", border: "BFDBFE", headerBg: "1D4ED8", title: "⚛️  Frontend", author: "Dhruv Patel",
      items: ["React 18 + Vite", "Tailwind CSS v4", "Lucide React Icons", "Framer Motion", "PWA Ready"]
    },
    {
      x: 3.55, bg: "F0FDF4", border: "BBF7D0", headerBg: "166534", title: "⚙️  Backend", author: "Dhruv Patel",
      items: ["FastAPI Python", "MongoDB Atlas", "JWT + bcrypt Auth", "Motor Async Driver", "Render + Vercel"]
    },
    {
      x: 6.75, bg: "F5F3FF", border: "DDD6FE", headerBg: "7C3AED", title: "🧠  AI / ML", author: "Prem Patel",
      items: ["EfficientNetB0", "PlantVillage 54K", "Groq LLM Vision", "PlantNet API", "HuggingFace Spaces"]
    }
  ];

  cols.forEach(c => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 1.15, w: 2.9, h: 4.25,
      fill: { color: c.bg },
      rectRadius: 0.15,
      line: { color: c.border, width: 1 },
      shadow: mkShadow()
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.15, y: 1.3, w: 2.6, h: 0.45,
      fill: { color: c.headerBg },
      rectRadius: 0.1
    });
    slide.addText(c.title, {
      x: c.x + 0.15, y: 1.3, w: 2.6, h: 0.45,
      fontFace: "Calibri", fontSize: 14, bold: true, color: "FFFFFF", align: "center", valign: "middle"
    });

    slide.addText(c.author, {
      x: c.x + 0.15, y: 1.82, w: 2.6, h: 0.3,
      fontFace: "Calibri", fontSize: 10, color: "6B7280", align: "center"
    });

    const textArr = c.items.map(it => ({ text: it }));
    slide.addText(textArr, {
      x: c.x + 0.2, y: 2.2, w: 2.5, h: 3.0,
      fontFace: "Calibri", fontSize: 12, color: "374151",
      bullet: true, paraSpaceAfter: 8
    });
  });
}

// ==========================================
// SLIDE 6 — CORE FEATURES
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "F9FAFB" };

  slide.addText("Core Features", {
    x: 0.5, y: 0.25, w: 9.0, h: 0.55,
    fontFace: "Calibri", fontSize: 30, bold: true, color: "14532D"
  });

  slide.addText("Everything a farmer needs in one app", {
    x: 0.5, y: 0.8, w: 9.0, h: 0.35,
    fontFace: "Calibri", fontSize: 14, color: "6B7280"
  });

  const featCards = [
    { x: 0.35, y: 1.35, circleBg: "DCFCE7", emoji: "🔐", title: "Secure Auth", desc: "JWT + bcrypt\nProtected routes" },
    { x: 3.55, y: 1.35, circleBg: "D1FAE5", emoji: "📷", title: "3 Smart Scanners", desc: "Disease + Plant\n+ Soil Analysis" },
    { x: 6.75, y: 1.35, circleBg: "FEF3C7", emoji: "🌤️", title: "Weather Widget", desc: "Real-time GPS\nforecast" },
    { x: 0.35, y: 3.30, circleBg: "DBEAFE", emoji: "📚", title: "Crop Advisory", desc: "Tomato Potato\nWheat guides" },
    { x: 3.55, y: 3.30, circleBg: "F3E8FF", emoji: "🌐", title: "Bilingual", desc: "English + Hindi\nfull UI support" },
    { x: 6.75, y: 3.30, circleBg: "FFE4E6", emoji: "📊", title: "Scan History", desc: "Persistent MongoDB\nstorage" }
  ];

  featCards.forEach(fc => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: fc.x, y: fc.y, w: 2.9, h: 1.75,
      fill: { color: "FFFFFF" },
      rectRadius: 0.15,
      line: { color: "E5E7EB", width: 1 },
      shadow: mkShadow()
    });

    slide.addShape(pres.shapes.OVAL, {
      x: fc.x + 0.18, y: fc.y + 0.18, w: 0.65, h: 0.65,
      fill: { color: fc.circleBg }
    });

    slide.addText(fc.emoji, {
      x: fc.x + 0.18, y: fc.y + 0.18, w: 0.65, h: 0.65,
      fontSize: 18, align: "center", valign: "middle"
    });

    slide.addText(fc.title, {
      x: fc.x + 0.95, y: fc.y + 0.2, w: 1.8, h: 0.35,
      fontFace: "Calibri", fontSize: 13, bold: true, color: "111827"
    });

    slide.addText(fc.desc, {
      x: fc.x + 0.95, y: fc.y + 0.58, w: 1.8, h: 0.9,
      fontFace: "Calibri", fontSize: 11, color: "6B7280"
    });
  });
}

// ==========================================
// SLIDE 7 — THREE SMART SCANNERS
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  addHeader(slide, "Three AI-Powered Scanners");

  const scanCards = [
    {
      y: 1.15, bg: "F0FDF4", border: "BBF7D0", iconBg: "16A34A", emoji: "🔬", title: "Crop Disease Scanner",
      authorBadge: "Dhruv + Prem", authorBg: "DCFCE7", authorBorder: "BBF7D0", authorColor: "166534",
      desc: "EfficientNetB0 model • 38 disease classes\n• 54K training images",
      pills: [["Disease Name", "Confidence %", "Severity Badge"], ["Treatment Steps", "Fertilizer Advice", "Similar Diseases"]],
      pillBg: "DCFCE7", pillBorder: "BBF7D0", pillColor: "166534"
    },
    {
      y: 2.60, bg: "ECFDF5", border: "A7F3D0", iconBg: "059669", emoji: "🪴", title: "Plant Identifier",
      authorBadge: "Prem Patel", authorBg: "D1FAE5", authorBorder: "A7F3D0", authorColor: "065F46",
      desc: "PlantNet Vision API • Any plant species\n• Global database",
      pills: [["Plant Name", "Scientific Name"], ["Plant Family", "Confidence %"]],
      pillBg: "D1FAE5", pillBorder: "A7F3D0", pillColor: "065F46"
    },
    {
      y: 4.05, bg: "FFFBEB", border: "FDE68A", iconBg: "D97706", emoji: "🌍", title: "Land & Soil Analyzer",
      authorBadge: "Prem Patel", authorBg: "FEF3C7", authorBorder: "FDE68A", authorColor: "92400E",
      desc: "Groq Llama 4 Vision • Soil quality analysis\n• Crop recommendations",
      pills: [["Soil Type", "pH Level", "Moisture"], ["Fertility", "Best Crops", "Avoid Crops"]],
      pillBg: "FEF3C7", pillBorder: "FDE68A", pillColor: "92400E"
    }
  ];

  scanCards.forEach(sc => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y: sc.y, w: 9.0, h: 1.32,
      fill: { color: sc.bg },
      rectRadius: 0.15,
      line: { color: sc.border, width: 1 },
      shadow: mkShadow()
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y: sc.y + 0.13, w: 0.85, h: 0.85,
      fill: { color: sc.iconBg },
      rectRadius: 0.12
    });
    slide.addText(sc.emoji, {
      x: 0.7, y: sc.y + 0.13, w: 0.85, h: 0.85,
      fontSize: 24, align: "center", valign: "middle"
    });

    slide.addText(sc.title, {
      x: 1.7, y: sc.y + 0.08, w: 3.5, h: 0.32,
      fontFace: "Calibri", fontSize: 15, bold: true, color: "14532D"
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 1.7, y: sc.y + 0.42, w: 1.5, h: 0.24,
      fill: { color: sc.authorBg },
      rectRadius: 0.08,
      line: { color: sc.authorBorder, width: 1 }
    });
    slide.addText(sc.authorBadge, {
      x: 1.7, y: sc.y + 0.42, w: 1.5, h: 0.24,
      fontFace: "Calibri", fontSize: 9, bold: true, color: sc.authorColor, align: "center", valign: "middle"
    });

    slide.addText(sc.desc, {
      x: 1.7, y: sc.y + 0.7, w: 3.8, h: 0.5,
      fontFace: "Calibri", fontSize: 10.5, color: "374151"
    });

    // Render output pills
    sc.pills.forEach((row, rIdx) => {
      row.forEach((pillText, pIdx) => {
        const px = 5.6 + pIdx * 1.1;
        const py = sc.y + 0.2 + rIdx * 0.48;
        slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
          x: px, y: py, w: 1.05, h: 0.38,
          fill: { color: sc.pillBg },
          line: { color: sc.pillBorder, width: 1 },
          rectRadius: 0.06
        });
        slide.addText(pillText, {
          x: px, y: py, w: 1.05, h: 0.38,
          fontFace: "Calibri", fontSize: 8.5, bold: true, color: sc.pillColor, align: "center", valign: "middle"
        });
      });
    });
  });
}

// ==========================================
// SLIDE 8 — AI/ML PIPELINE
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "14532D" };

  slide.addText("AI / ML PIPELINE", {
    x: 0.5, y: 0.2, w: 9.0, h: 0.35,
    fontFace: "Calibri", fontSize: 11, bold: true, color: "22C55E", charSpacing: 4
  });

  slide.addText("Built by Prem Patel", {
    x: 0.5, y: 0.55, w: 7.0, h: 0.6,
    fontFace: "Calibri", fontSize: 28, bold: true, color: "FFFFFF"
  });

  // Accuracy badge top right
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 7.6, y: 0.45, w: 2.0, h: 0.65,
    fill: { color: "22C55E" },
    rectRadius: 0.1
  });
  slide.addText("92%+ Accuracy", {
    x: 7.6, y: 0.45, w: 2.0, h: 0.65,
    fontFace: "Calibri", fontSize: 13, bold: true, color: "FFFFFF", align: "center", valign: "middle"
  });

  const pipeBoxes = [
    { x: 0.3, emoji: "📦", title: "PlantVillage\nDataset", desc: "54,000\nimages\n38 classes" },
    { x: 2.15, emoji: "⚙️", title: "Preprocessing", desc: "Resize 224px\nNormalize\nAugment" },
    { x: 4.0, emoji: "🧠", title: "EfficientNet\nB0 Model", desc: "Transfer\nLearning\nFinetune" },
    { x: 5.85, emoji: "✅", title: "Validation", desc: "92%+\nAccuracy\nAchieved" },
    { x: 7.7, emoji: "🚀", title: "HuggingFace\nSpaces", desc: "Live API\n3 endpoints\nPublic URL" }
  ];

  pipeBoxes.forEach(pb => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: pb.x, y: 1.45, w: 1.5, h: 2.6,
      fill: { color: "166534", transparency: 25 },
      rectRadius: 0.15,
      line: { color: "22C55E", width: 1 }
    });

    slide.addText(pb.emoji, {
      x: pb.x, y: 1.6, w: 1.5, h: 0.4,
      fontSize: 22, align: "center"
    });

    slide.addText(pb.title, {
      x: pb.x + 0.05, y: 2.08, w: 1.4, h: 0.6,
      fontFace: "Calibri", fontSize: 12, bold: true, color: "FFFFFF", align: "center"
    });

    slide.addText(pb.desc, {
      x: pb.x + 0.05, y: 2.78, w: 1.4, h: 1.1,
      fontFace: "Calibri", fontSize: 10.5, color: "86EFAC", align: "center"
    });
  });

  // Arrows between boxes
  const pArrows = [1.82, 3.67, 5.52, 7.37];
  pArrows.forEach(ax => {
    slide.addText("→", {
      x: ax, y: 2.5, w: 0.3, h: 0.4,
      fontFace: "Calibri", fontSize: 18, bold: true, color: "22C55E", align: "center"
    });
  });

  // Three endpoint pills bottom
  const endpoints = [
    { x: 0.4, text: "⚡ /analyze — Disease Detection" },
    { x: 3.58, text: "🪴 /identify — Plant ID" },
    { x: 6.75, text: "🌍 /land — Soil Analysis" }
  ];

  endpoints.forEach(ep => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: ep.x, y: 4.35, w: 2.85, h: 0.5,
      fill: { color: "166534" },
      rectRadius: 0.1,
      line: { color: "22C55E", width: 1 }
    });
    slide.addText(ep.text, {
      x: ep.x, y: 4.35, w: 2.85, h: 0.5,
      fontFace: "Calibri", fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle"
    });
  });
}

// ==========================================
// SLIDE 9 — FULL STACK WORK
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  addHeader(slide, "Full Stack Development — Dhruv Patel");

  // LEFT — Frontend
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.4, y: 1.15, w: 4.4, h: 4.25,
    fill: { color: "F0FDF4" },
    rectRadius: 0.15,
    line: { color: "BBF7D0", width: 1 },
    shadow: mkShadow()
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.55, y: 1.3, w: 4.1, h: 0.42,
    fill: { color: "16A34A" },
    rectRadius: 0.1
  });
  slide.addText("⚛️  Frontend — 12 Features", {
    x: 0.55, y: 1.3, w: 4.1, h: 0.42,
    fontFace: "Calibri", fontSize: 13, bold: true, color: "FFFFFF", align: "center", valign: "middle"
  });

  const feBullets = [
    { text: "Login + Register with validation" },
    { text: "Dashboard with real MongoDB data" },
    { text: "3 Scanner type selection UI" },
    { text: "Disease diagnosis result page" },
    { text: "Plant identification result page" },
    { text: "Soil analysis result page" },
    { text: "Scan history with bulk delete" },
    { text: "Crop advisory library + search" },
    { text: "Profile + password change" },
    { text: "English and Hindi bilingual UI" },
    { text: "Weather widget with GPS" },
    { text: "Dark mode support" }
  ];

  slide.addText(feBullets, {
    x: 0.65, y: 1.82, w: 3.9, h: 3.4,
    fontFace: "Calibri", fontSize: 10.5, color: "374151",
    bullet: true, paraSpaceAfter: 2
  });

  // RIGHT — Backend
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.15, w: 4.4, h: 4.25,
    fill: { color: "EFF6FF" },
    rectRadius: 0.15,
    line: { color: "BFDBFE", width: 1 },
    shadow: mkShadow()
  });

  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.35, y: 1.3, w: 4.1, h: 0.42,
    fill: { color: "1D4ED8" },
    rectRadius: 0.1
  });
  slide.addText("⚙️  Backend — 11 Endpoints", {
    x: 5.35, y: 1.3, w: 4.1, h: 0.42,
    fontFace: "Calibri", fontSize: 13, bold: true, color: "FFFFFF", align: "center", valign: "middle"
  });

  const beBullets = [
    { text: "JWT auth register + login + me" },
    { text: "Image upload with validation" },
    { text: "Crop disease analyze endpoint" },
    { text: "Plant identify endpoint" },
    { text: "Land soil analyze endpoint" },
    { text: "Scan history GET endpoint" },
    { text: "Bulk delete scans endpoint" },
    { text: "Weather cache system 99% faster" },
    { text: "User profile update endpoint" },
    { text: "Change password endpoint" },
    { text: "MongoDB Atlas integration" }
  ];

  slide.addText(beBullets, {
    x: 5.45, y: 1.82, w: 3.9, h: 3.4,
    fontFace: "Calibri", fontSize: 10.5, color: "374151",
    bullet: true, paraSpaceAfter: 2
  });
}

// ==========================================
// SLIDE 10 — CHALLENGES AND SOLUTIONS
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "F9FAFB" };

  slide.addText("Challenges We Solved", {
    x: 0.5, y: 0.25, w: 9.0, h: 0.55,
    fontFace: "Calibri", fontSize: 30, bold: true, color: "14532D"
  });

  const chalCards = [
    {
      x: 0.35, num: "⚠️  Challenge 01", title: "Render Ephemeral\nStorage",
      prob: "Uploaded crop images deleted\non every server restart",
      sol: "Migrated to Base64 encoding\nin MongoDB Atlas.\n\n100% image persistence."
    },
    {
      x: 3.55, num: "⚠️  Challenge 02", title: "passlib + bcrypt\nIncompatibility",
      prob: "passlib 2020 not compatible\nwith bcrypt 4.x causing 500 errors",
      sol: "Used bcrypt directly.\nRemoved passlib dependency.\n\nSecure password hashing."
    },
    {
      x: 6.75, num: "⚠️  Challenge 03", title: "Weather API\n2.15s Load Time",
      prob: "Open-Meteo API causing\ndashboard to load very slowly",
      sol: "15-minute backend cache.\nLoad time dropped to 14ms.\n\n99.3% performance gain."
    }
  ];

  chalCards.forEach(c => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c.x, y: 0.95, w: 2.9, h: 4.45,
      fill: { color: "FEF2F2" },
      rectRadius: 0.15,
      line: { color: "FECACA", width: 1 },
      shadow: mkShadow()
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.15, y: 1.10, w: 2.6, h: 0.35,
      fill: { color: "DC2626" },
      rectRadius: 0.08
    });
    slide.addText(c.num, {
      x: c.x + 0.15, y: 1.10, w: 2.6, h: 0.35,
      fontFace: "Calibri", fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle"
    });

    slide.addText(c.title, {
      x: c.x + 0.15, y: 1.52, w: 2.6, h: 0.5,
      fontFace: "Calibri", fontSize: 13, bold: true, color: "DC2626", align: "center"
    });

    slide.addText(c.prob, {
      x: c.x + 0.15, y: 2.08, w: 2.6, h: 0.65,
      fontFace: "Calibri", fontSize: 10.5, color: "374151", align: "center"
    });

    slide.addText("↓", {
      x: c.x + 0.15, y: 2.76, w: 2.6, h: 0.3,
      fontFace: "Calibri", fontSize: 20, bold: true, color: "6B7280", align: "center"
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: c.x + 0.15, y: 3.10, w: 2.6, h: 0.35,
      fill: { color: "16A34A" },
      rectRadius: 0.08
    });
    slide.addText("✅  Solution", {
      x: c.x + 0.15, y: 3.10, w: 2.6, h: 0.35,
      fontFace: "Calibri", fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle"
    });

    slide.addText(c.sol, {
      x: c.x + 0.15, y: 3.52, w: 2.6, h: 1.7,
      fontFace: "Calibri", fontSize: 10.5, color: "166534", align: "center"
    });
  });
}

// ==========================================
// SLIDE 11 — FUTURE SCOPE
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "14532D" };

  // Decorative circles top right
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -1.0, w: 4.0, h: 4.0,
    fill: { color: "166534", transparency: 60 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2, y: -0.3, w: 2.5, h: 2.5,
    fill: { color: "16A34A", transparency: 70 }
  });

  // Decorative circle bottom left
  slide.addShape(pres.shapes.OVAL, {
    x: -0.8, y: 3.5, w: 3.0, h: 3.0,
    fill: { color: "166534", transparency: 65 }
  });

  slide.addText("FUTURE SCOPE", {
    x: 0.5, y: 0.2, w: 9.0, h: 0.35,
    fontFace: "Calibri", fontSize: 11, bold: true, color: "22C55E", charSpacing: 4
  });

  slide.addText("What Comes Next for KisanAI", {
    x: 0.5, y: 0.55, w: 9.0, h: 0.6,
    fontFace: "Calibri", fontSize: 28, bold: true, color: "FFFFFF"
  });

  const futCards = [
    { x: 0.4, y: 1.3, emoji: "📱", title: "TFLite Offline", desc: "Run AI without internet in remote farms" },
    { x: 3.58, y: 1.3, emoji: "🤖", title: "Gemini AI Chat", desc: "Conversational Hindi crop advisor" },
    { x: 6.75, y: 1.3, emoji: "🌐", title: "IoT Integration", desc: "Soil sensors + auto alerts" },
    { x: 0.4, y: 3.18, emoji: "🗺️", title: "More Languages", desc: "Gujarati, Marathi, Tamil" },
    { x: 3.58, y: 3.18, emoji: "📊", title: "Disease Heatmaps", desc: "Regional outbreak tracking" },
    { x: 6.75, y: 3.18, emoji: "🏪", title: "Marketplace", desc: "Buy fertilizers from diagnosis" }
  ];

  futCards.forEach(fc => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: fc.x, y: fc.y, w: 2.85, h: 1.7,
      fill: { color: "166534", transparency: 25 },
      rectRadius: 0.15,
      line: { color: "22C55E", width: 1 }
    });

    slide.addText(fc.emoji, {
      x: fc.x + 0.15, y: fc.y + 0.18, w: 0.65, h: 0.6,
      fontSize: 22
    });

    slide.addText(fc.title, {
      x: fc.x + 0.85, y: fc.y + 0.22, w: 1.8, h: 0.35,
      fontFace: "Calibri", fontSize: 13, bold: true, color: "FFFFFF"
    });

    slide.addText(fc.desc, {
      x: fc.x + 0.15, y: fc.y + 0.85, w: 2.55, h: 0.7,
      fontFace: "Calibri", fontSize: 10, color: "BBF7D0"
    });
  });
}

// ==========================================
// SLIDE 12 — LIVE APP SCREENSHOTS
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "FFFFFF" };

  addHeader(slide, "KisanAI — Live Application");

  const mockCards = [
    {
      x: 0.4, y: 1.15, bg: "F0FDF4", border: "BBF7D0", headerBg: "16A34A", title: "Dashboard",
      label: "Dashboard — Weather + Scan Cards",
      p1: { x: 0.6, y: 1.62, w: 4.0, h: 0.22, bg: "E5E7EB" },
      p2: { x: 0.6, y: 1.92, w: 1.9, h: 0.42, bg: "D1D5DB" },
      p3: { x: 2.6, y: 1.92, w: 2.0, h: 0.42, bg: "D1D5DB" }
    },
    {
      x: 5.2, y: 1.15, bg: "F0FDF4", border: "BBF7D0", headerBg: "16A34A", title: "Disease Result",
      label: "Diagnosis — 92.5% Confidence",
      p1: { x: 5.4, y: 1.62, w: 4.0, h: 0.22, bg: "E5E7EB" },
      p2: { x: 5.4, y: 1.92, w: 1.9, h: 0.42, bg: "D1D5DB" },
      p3: { x: 7.4, y: 1.92, w: 2.0, h: 0.42, bg: "D1D5DB" }
    },
    {
      x: 0.4, y: 3.15, bg: "ECFDF5", border: "A7F3D0", headerBg: "059669", title: "Plant Identifier",
      label: "Plant ID — Scientific Name",
      p1: { x: 0.6, y: 3.62, w: 4.0, h: 0.22, bg: "E5E7EB" },
      p2: { x: 0.6, y: 3.92, w: 1.9, h: 0.42, bg: "D1D5DB" },
      p3: { x: 2.6, y: 3.92, w: 2.0, h: 0.42, bg: "D1D5DB" }
    },
    {
      x: 5.2, y: 3.15, bg: "FFFBEB", border: "FDE68A", headerBg: "D97706", title: "Soil Analyzer",
      label: "Soil Analysis — Crop Recs",
      p1: { x: 5.4, y: 3.62, w: 4.0, h: 0.22, bg: "E5E7EB" },
      p2: { x: 5.4, y: 3.92, w: 1.9, h: 0.42, bg: "D1D5DB" },
      p3: { x: 7.4, y: 3.92, w: 2.0, h: 0.42, bg: "D1D5DB" }
    }
  ];

  mockCards.forEach(mc => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: mc.x, y: mc.y, w: 4.4, h: 1.7,
      fill: { color: mc.bg },
      rectRadius: 0.12,
      line: { color: mc.border, width: 1 },
      shadow: mkShadow()
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: mc.x, y: mc.y, w: 4.4, h: 0.35,
      fill: { color: mc.headerBg },
      rectRadius: 0.12
    });

    slide.addText(mc.title, {
      x: mc.x + 0.2, y: mc.y, w: 4.0, h: 0.35,
      fontFace: "Calibri", fontSize: 11, bold: true, color: "FFFFFF", valign: "middle"
    });

    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: mc.p1.x, y: mc.p1.y, w: mc.p1.w, h: mc.p1.h,
      fill: { color: mc.p1.bg }, rectRadius: 0.04
    });
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: mc.p2.x, y: mc.p2.y, w: mc.p2.w, h: mc.p2.h,
      fill: { color: mc.p2.bg }, rectRadius: 0.04
    });
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: mc.p3.x, y: mc.p3.y, w: mc.p3.w, h: mc.p3.h,
      fill: { color: mc.p3.bg }, rectRadius: 0.04
    });

    slide.addText(mc.label, {
      x: mc.x, y: mc.y + 1.4, w: 4.4, h: 0.28,
      fontFace: "Calibri", fontSize: 10.5, color: "6B7280", align: "center"
    });
  });

  // Live URL banner bottom
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 2.5, y: 5.08, w: 5.0, h: 0.4,
    fill: { color: "14532D" },
    rectRadius: 0.1
  });
  slide.addText("🔗 Live: kisan-ai-sandy.vercel.app", {
    x: 2.5, y: 5.08, w: 5.0, h: 0.4,
    fontFace: "Calibri", fontSize: 12, bold: true, color: "22C55E", align: "center", valign: "middle"
  });
}

// ==========================================
// SLIDE 13 — THANK YOU
// ==========================================
{
  const slide = pres.addSlide();
  slide.background = { color: "14532D" };

  // Decorative circles top right
  slide.addShape(pres.shapes.OVAL, {
    x: 7.5, y: -1.0, w: 4.0, h: 4.0,
    fill: { color: "166534", transparency: 60 }
  });
  slide.addShape(pres.shapes.OVAL, {
    x: 8.2, y: -0.3, w: 2.5, h: 2.5,
    fill: { color: "16A34A", transparency: 70 }
  });

  // Decorative circle bottom left
  slide.addShape(pres.shapes.OVAL, {
    x: -0.8, y: 3.5, w: 3.0, h: 3.0,
    fill: { color: "166534", transparency: 65 }
  });

  // Large emoji center
  slide.addText("🌱", {
    x: 3.8, y: 0.4, w: 2.4, h: 2.2,
    fontSize: 72, align: "center"
  });

  slide.addText("Thank You", {
    x: 0.5, y: 2.55, w: 9.0, h: 0.95,
    fontFace: "Calibri", fontSize: 48, bold: true, color: "FFFFFF", align: "center"
  });

  slide.addText("KisanAI — Smart Agriculture at Your Fingertips", {
    x: 0.5, y: 3.50, w: 9.0, h: 0.45,
    fontFace: "Calibri", fontSize: 16, color: "86EFAC", align: "center"
  });

  slide.addText("Dhruv Patel  •  Prem Patel", {
    x: 2.5, y: 4.0, w: 5.0, h: 0.38,
    fontFace: "Calibri", fontSize: 14, bold: true, color: "FFFFFF", align: "center"
  });

  // Three link pills bottom
  const thankPills = [
    { x: 0.8, title: "🔗 Live App", sub: "kisan-ai-sandy.vercel.app" },
    { x: 3.65, title: "⚙️ Backend API", sub: "kisanai-nl3x.onrender.com" },
    { x: 6.5, title: "🤖 ML Service", sub: "prem2116-kisanai-ml.hf.space" }
  ];

  thankPills.forEach(tp => {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: tp.x, y: 4.55, w: 2.7, h: 0.75,
      fill: { color: "166534" },
      rectRadius: 0.1,
      line: { color: "22C55E", width: 1 }
    });

    slide.addText([
      { text: tp.title + "\n", options: { fontFace: "Calibri", fontSize: 11, bold: true, color: "FFFFFF" } },
      { text: tp.sub, options: { fontFace: "Calibri", fontSize: 9.5, color: "86EFAC" } }
    ], {
      x: tp.x, y: 4.55, w: 2.7, h: 0.75,
      align: "center", valign: "middle"
    });
  });
}

pres.writeFile({ fileName: "KisanAI_Presentation.pptx" })
  .then(fileName => {
    console.log(`Successfully generated presentation: ${fileName}`);
  })
  .catch(err => {
    console.error("Error generating presentation:", err);
  });
