const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const outputDir = path.join(__dirname, "../public/images/projects");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const mockups = [
  {
    filename: "ecommerce-1.jpg",
    title: "E-Commerce Platform",
    subtitle: "Storefront & Product Catalog",
    category: "Web Application • Next.js & PostgreSQL",
    primaryColor: "#2563EB",
    bgGradient: ["#0B132B", "#1C2541"],
    accent: "#60A5FA",
    badgeText: "ONLINE STORE",
    items: [
      { name: "Sản phẩm nổi bật", val: "128 Items" },
      { name: "Doanh thu hôm nay", val: "24.5M ₫" },
      { name: "Đơn hàng mới", val: "32 Orders" },
    ],
  },
  {
    filename: "ecommerce-2.jpg",
    title: "E-Commerce Platform",
    subtitle: "Order Management & VNPay Checkout",
    category: "Admin Dashboard • Real-time Stats",
    primaryColor: "#3B82F6",
    bgGradient: ["#0F172A", "#1E293B"],
    accent: "#38BDF8",
    badgeText: "CHECKOUT & ANALYTICS",
    items: [
      { name: "Cổng thanh toán", val: "VNPay Gateway" },
      { name: "Tỉ lệ hoàn tất", val: "98.4%" },
      { name: "Khách hàng", val: "1,420 Users" },
    ],
  },
  {
    filename: "task-1.jpg",
    title: "Task Management System",
    subtitle: "Kanban Board & Sprint Overview",
    category: "Team Workspace • React & Socket.io",
    primaryColor: "#6366F1",
    bgGradient: ["#0F1123", "#1E1E38"],
    accent: "#818CF8",
    badgeText: "KANBAN WORKSPACE",
    items: [
      { name: "To Do", val: "8 Tasks" },
      { name: "In Progress", val: "5 Tasks" },
      { name: "Done Sprint #12", val: "24 Tasks" },
    ],
  },
  {
    filename: "task-2.jpg",
    title: "Task Management System",
    subtitle: "Role-based Access & Activity Log",
    category: "Project Dashboard • Sprint Metrics",
    primaryColor: "#4F46E5",
    bgGradient: ["#0F172A", "#1E1B4B"],
    accent: "#A5B4FC",
    badgeText: "ACTIVITY & ROLES",
    items: [
      { name: "Team Members", val: "12 Active" },
      { name: "Sprint Velocity", val: "42 Points" },
      { name: "Deadlines", val: "On Track" },
    ],
  },
  {
    filename: "pos-1.jpg",
    title: "Restaurant POS System",
    subtitle: "Touch POS Order & Kitchen Sync",
    category: "Point of Sale • Real-time Kitchen",
    primaryColor: "#059669",
    bgGradient: ["#062822", "#0F3D34"],
    accent: "#34D399",
    badgeText: "ORDER TERMINAL",
    items: [
      { name: "Bàn đang phục vụ", val: "18 / 24 Bàn" },
      { name: "Món đang chế biến", val: "12 Đĩa" },
      { name: "Doanh thu ca", val: "16.8M ₫" },
    ],
  },
  {
    filename: "pos-2.jpg",
    title: "Restaurant POS System",
    subtitle: "Floor Map & Table Management",
    category: "Dining Room • Kitchen Display System",
    primaryColor: "#10B981",
    bgGradient: ["#064E3B", "#0F172A"],
    accent: "#6EE7B7",
    badgeText: "FLOOR PLAN & BILLING",
    items: [
      { name: "Khu vực tầng 1", val: "14 Bàn" },
      { name: "Khu vực VIP", val: "6 Phòng" },
      { name: "Hóa đơn chờ in", val: "3 Đơn" },
    ],
  },
  {
    filename: "portfolio-1.jpg",
    title: "Portfolio Website",
    subtitle: "Cong Dev - Personal Portfolio",
    category: "Modern Web • Next.js & Tailwind",
    primaryColor: "#7C3AED",
    bgGradient: ["#130924", "#261545"],
    accent: "#A78BFA",
    badgeText: "DEVELOPER PORTFOLIO",
    items: [
      { name: "Next.js", val: "App Router" },
      { name: "Realtime Chat", val: "Supabase & Telegram" },
      { name: "Design System", val: "Modern Dark/Light" },
    ],
  },
  {
    filename: "portfolio-2.jpg",
    title: "Portfolio Website",
    subtitle: "Interactive UI & Showcase Details",
    category: "Case Studies & Work Process",
    primaryColor: "#8B5CF6",
    bgGradient: ["#0F172A", "#2E1065"],
    accent: "#C4B5FD",
    badgeText: "CASE STUDY DETAIL",
    items: [
      { name: "Lighthouse Score", val: "99 / 100" },
      { name: "Full Responsive", val: "Mobile & Desktop" },
      { name: "Dockerized", val: "Production Ready" },
    ],
  },
];

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createSvg(m) {
  const badgeText = escapeXml(m.badgeText);
  const title = escapeXml(m.title);
  const subtitle = escapeXml(m.subtitle);
  const category = escapeXml(m.category);

  return `
  <svg width="1280" height="720" viewBox="0 0 1280 720" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1280" y2="720" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${m.bgGradient[0]}" />
        <stop offset="100%" stop-color="${m.bgGradient[1]}" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
      </linearGradient>
      <filter id="blurGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="80" />
      </filter>
    </defs>

    <!-- Background -->
    <rect width="1280" height="720" fill="url(#bg)" />

    <!-- Ambient glow circles -->
    <circle cx="1080" cy="180" r="280" fill="${m.primaryColor}" opacity="0.35" filter="url(#blurGlow)" />
    <circle cx="200" cy="560" r="240" fill="${m.accent}" opacity="0.18" filter="url(#blurGlow)" />

    <!-- Grid lines -->
    <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">
      ${Array.from({ length: 13 })
        .map((_, i) => `<line x1="${i * 100 + 40}" y1="0" x2="${i * 100 + 40}" y2="720" />`)
        .join("")}
      ${Array.from({ length: 8 })
        .map((_, i) => `<line x1="0" y1="${i * 100 + 10}" x2="1280" y2="${i * 100 + 10}" />`)
        .join("")}
    </g>

    <!-- Browser / App window container -->
    <rect x="80" y="70" width="1120" height="580" rx="18" fill="url(#cardGrad)" stroke="#ffffff" stroke-opacity="0.14" stroke-width="1.5" />

    <!-- Window top bar -->
    <rect x="80" y="70" width="1120" height="52" rx="18" fill="#ffffff" fill-opacity="0.04" />
    <circle cx="118" cy="96" r="6" fill="#EF4444" opacity="0.8" />
    <circle cx="138" cy="96" r="6" fill="#F59E0B" opacity="0.8" />
    <circle cx="158" cy="96" r="6" fill="#10B981" opacity="0.8" />

    <!-- URL Bar / Pill -->
    <rect x="200" y="82" width="400" height="28" rx="6" fill="#000000" fill-opacity="0.3" stroke="#ffffff" stroke-opacity="0.08" />
    <text x="220" y="101" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="500">
      https://congdev.io/preview/${m.filename.replace(".jpg", "")}
    </text>

    <!-- Category / Badge -->
    <rect x="130" y="170" width="190" height="32" rx="16" fill="${m.primaryColor}" fill-opacity="0.25" stroke="${m.accent}" stroke-opacity="0.4" stroke-width="1" />
    <text x="146" y="191" fill="${m.accent}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="11" font-weight="700" letter-spacing="1">
      ${badgeText}
    </text>

    <!-- Main Title -->
    <text x="130" y="260" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="44" font-weight="800">
      ${title}
    </text>

    <!-- Subtitle -->
    <text x="130" y="306" fill="${m.accent}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="22" font-weight="600">
      ${subtitle}
    </text>

    <!-- Tech specs / Details line -->
    <text x="130" y="348" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="15" font-weight="400">
      ${category}
    </text>

    <!-- 3 Preview metric cards -->
    <g transform="translate(130, 400)">
      ${m.items
        .map(
          (item, idx) => `
        <g transform="translate(${idx * 330}, 0)">
          <rect width="300" height="180" rx="14" fill="#000000" fill-opacity="0.3" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1" />
          <rect x="20" y="24" width="8" height="8" rx="4" fill="${m.accent}" />
          <text x="36" y="32" fill="#94A3B8" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="13" font-weight="600">
            ${escapeXml(item.name)}
          </text>
          <text x="20" y="90" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="26" font-weight="700">
            ${escapeXml(item.val)}
          </text>
          <line x1="20" y1="120" x2="280" y2="120" stroke="#ffffff" stroke-opacity="0.08" />
          <text x="20" y="150" fill="${m.accent}" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="500">
            ✓ Verified Feature Demo
          </text>
        </g>
      `
        )
        .join("")}
    </g>

    <!-- Brand mark watermark -->
    <text x="1150" y="620" text-anchor="end" fill="#ffffff" fill-opacity="0.25" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="14" font-weight="600">
      CONG DEV SHOWCASE
    </text>
  </svg>
  `;
}

async function run() {
  console.log("Generating mockup images with sharp...");
  for (const m of mockups) {
    const svg = createSvg(m);
    const dest = path.join(outputDir, m.filename);
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(dest);
    console.log(`Generated: ${m.filename}`);
  }
  console.log("Done generating all 8 project images!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
