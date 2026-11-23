import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "global-cse-juniors",
    title: "Global CSE Juniors",
    category: "Microservices & .NET",
    shortDescription:
      "Nền tảng giáo dục trực tuyến giúp trẻ em học tập, giao lưu và kết nối với bạn bè trên khắp thế giới.",
    description:
      "Global CSE Juniors là nền tảng học tập tương tác trực tuyến dành cho trẻ em toàn cầu, tạo môi trường an toàn và sinh động để các em vừa rèn luyện kỹ năng, ngoại ngữ vừa giao lưu văn hóa và kết nối với bạn bè, giáo viên quốc tế.",
    problem:
      "Trẻ em khi học trực tuyến thường thiếu môi trường tương tác thực tế với bạn bè quốc tế, các nền tảng hiện có chưa tối ưu trải nghiệm thân thiện cho lứa tuổi nhỏ và khó mở rộng khi lượng người dùng toàn cầu tăng cao.",
    solution:
      "Xây dựng hệ thống theo kiến trúc .NET Microservices kết hợp cơ sở dữ liệu PostgreSQL đảm bảo hiệu năng và khả năng mở rộng cao. Giao diện Frontend ReactJS được thiết kế trực quan, sinh động, tích hợp lớp học tương tác thời gian thực và kết nối cộng đồng học sinh đa quốc gia.",
    role: "Full-stack Developer",
    technologies: [
      "React.js",
      ".NET Microservices",
      "PostgreSQL",
      "TypeScript",
      "Docker",
      "RESTful API",
    ],
    features: [
      "Không gian học tập và giao lưu trực tuyến kết nối trẻ em toàn cầu",
      "Lớp học tương tác trực tiếp với giáo viên và bạn bè quốc tế",
      "Lộ trình bài học sinh động, cá nhân hóa theo độ tuổi",
      "Kiến trúc .NET Microservices chịu tải cao, dễ dàng mở rộng",
      "Quản lý hồ sơ học tập và theo dõi tiến độ dành cho phụ huynh",
      "Giao diện đa ngôn ngữ, thân thiện và an toàn cho trẻ nhỏ",
    ],
    metrics: [
      { label: "Kiến trúc hệ thống", value: "Microservices" },
      { label: "Độ trễ API trung bình", value: "< 120ms" },
      { label: "Hỗ trợ đa ngôn ngữ", value: "Global / i18n" },
      { label: "Triển khai", value: "Dockerized" },
    ],
    architecture: {
      summary:
        "Hệ thống tách biệt các dịch vụ độc lập qua API Gateway, giao tiếp bất đồng bộ và đóng gói bằng Docker để dễ dàng scale theo từng khu vực.",
      layers: [
        {
          name: "Client & Presentation Layer",
          items: ["React.js SPA", "TypeScript", "Responsive Kid-Friendly UI", "Multi-language (i18n)"],
        },
        {
          name: "API Gateway & Services (.NET)",
          items: ["Auth & Profile Service", "Learning & Curriculum Service", "Interactive Classroom Service", "Parent Portal API"],
        },
        {
          name: "Data & Infrastructure",
          items: ["PostgreSQL Cluster", "Docker Containers", "Automated CI/CD Pipeline"],
        },
      ],
    },
    screenshots: ["/images/projects/juniors-globalcse.jpg"],
    demoUrl: "https://juniors.globalcse.org/",
    githubUrl: "https://github.com/CongGenZ",
    year: "2025",
    status: "in-progress",
    featured: true,
  },
  {
    slug: "ecommerce-platform",
    title: "E-Commerce & Order Automation Platform",
    category: "E-Commerce & SaaS",
    shortDescription:
      "Nền tảng thương mại điện tử hoàn chỉnh với quản lý tồn kho, đơn hàng tự động và cổng thanh toán VNPay.",
    description:
      "Hệ thống thương mại điện tử xây dựng cho doanh nghiệp bán lẻ vừa và nhỏ, hỗ trợ quản lý sản phẩm đa biến thể, tự động hóa luồng đơn hàng, đối soát thanh toán VNPay và phân tích doanh thu theo thời gian thực.",
    problem:
      "Khách hàng đang dùng Excel và chat thủ công để chốt đơn, thường xuyên lệch tồn kho, sai sót khi đối soát thanh toán và mất hơn 3 giờ mỗi ngày để tổng hợp báo cáo.",
    solution:
      "Xây dựng Web App với Next.js App Router, Prisma + PostgreSQL đảm bảo toàn vẹn giao dịch (ACID), tích hợp webhook thanh toán VNPay tự động cập nhật trạng thái đơn và gửi email hóa đơn tức thì.",
    role: "Full-stack Developer",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "VNPay API", "Tailwind CSS"],
    features: [
      "Quản lý sản phẩm đa biến thể, danh mục và tồn kho tự động",
      "Giỏ hàng thông minh và thanh toán trực tuyến qua VNPay",
      "Đối soát giao dịch tự động qua Webhook an toàn",
      "Admin Dashboard theo dõi đơn hàng theo trạng thái",
      "Biểu đồ báo cáo doanh thu, sản phẩm bán chạy theo ngày/tháng",
      "Thông báo email xác nhận đơn hàng tự động cho khách",
    ],
    metrics: [
      { label: "Giảm thời gian xử lý đơn", value: "-75%" },
      { label: "Điểm Lighthouse SEO", value: "98/100" },
      { label: "Tốc độ tải trang (LCP)", value: "1.1s" },
      { label: "Sai sót đối soát", value: "0%" },
    ],
    architecture: {
      summary:
        "Kiến trúc Monolith hiện đại trên Next.js App Router kết hợp Server Actions, SSR cho SEO sản phẩm và Transaction DB cho luồng đặt hàng.",
      layers: [
        {
          name: "Storefront & Admin UI",
          items: ["Next.js SSR/ISR Storefront", "Admin Analytics Dashboard", "Tailwind CSS & Shadcn UI"],
        },
        {
          name: "Business Logic & Integrations",
          items: ["Order Transaction Engine", "VNPay Payment Webhook", "Automated SMTP Mailer"],
        },
        {
          name: "Database & Storage",
          items: ["PostgreSQL", "Prisma ORM", "Image Optimization (Sharp)"],
        },
      ],
    },
    screenshots: [
      "/images/projects/ecommerce-1.jpg",
      "/images/projects/ecommerce-2.jpg",
    ],
    demoUrl: undefined,
    githubUrl: "https://github.com/CongGenZ",
    year: "2024",
    status: "completed",
    featured: true,
  },
  {
    slug: "task-management-app",
    title: "Team Task & Sprint Management System",
    category: "Realtime & System",
    shortDescription:
      "Hệ thống quản lý công việc cho nhóm với bảng Kanban kéo thả, theo dõi Sprint và đồng bộ Realtime.",
    description:
      "Web application quản lý công việc nội bộ cho đội ngũ phát triển phần mềm, cho phép lập kế hoạch Sprint, kéo thả task trên bảng Kanban, phân quyền theo vai trò và trao đổi trực tiếp trên từng đầu việc.",
    problem:
      "Đội nhóm sử dụng rời rạc giữa nhóm chat, email và Google Sheets khiến thông tin bị trôi, khó nắm bắt ai đang bị quá tải hoặc tiến độ Sprint đang chậm ở khâu nào.",
    solution:
      "Thiết kế hệ thống tập trung với bảng Kanban kéo thả mượt mà, kết nối WebSocket (Socket.io) để đồng bộ trạng thái thẻ ngay lập tức giữa các thành viên mà không cần tải lại trang.",
    role: "Frontend Developer & System Designer",
    technologies: ["React", "TypeScript", "Node.js", "Express", "MySQL", "Socket.io"],
    features: [
      "Bảng Kanban kéo thả mượt mà với cập nhật Optimistic UI",
      "Phân quyền chi tiết theo Role (Admin, PM, Member, Viewer)",
      "Bình luận, gắn thẻ thành viên (@mention) và đính kèm tài liệu",
      "Quản lý backlog, lập kế hoạch và theo dõi tiến độ Sprint",
      "Thông báo thời gian thực qua Socket.io khi task thay đổi",
      "Báo cáo hiệu suất và biểu đồ Burndown trực quan",
    ],
    metrics: [
      { label: "Độ trễ đồng bộ Realtime", value: "< 80ms" },
      { label: "Tăng hiệu suất họp nhóm", value: "+40%" },
      { label: "Số lượng thành viên/workspace", value: "50+ users" },
      { label: "Trải nghiệm kéo thả", value: "60 FPS" },
    ],
    architecture: {
      summary:
        "Kiến trúc tách biệt REST API cho thao tác CRUD chuẩn và WebSocket Server cho kênh sự kiện thời gian thực theo từng Room dự án.",
      layers: [
        {
          name: "Frontend Client",
          items: ["React + TypeScript", "Optimistic Drag & Drop Board", "Socket.io Client State Sync"],
        },
        {
          name: "Backend & Realtime Engine",
          items: ["Node.js & Express REST API", "Socket.io Room Broadcast", "RBAC Auth Middleware (JWT)"],
        },
        {
          name: "Persistence Layer",
          items: ["MySQL Relational DB", "Indexed Task & Audit Logs"],
        },
      ],
    },
    screenshots: [
      "/images/projects/task-1.jpg",
      "/images/projects/task-2.jpg",
    ],
    demoUrl: undefined,
    githubUrl: "https://github.com/CongGenZ",
    year: "2024",
    status: "completed",
    featured: true,
  },
  {
    slug: "restaurant-pos",
    title: "Smart Restaurant POS & Kitchen Sync",
    category: "Realtime & System",
    shortDescription:
      "Hệ thống POS quản lý nhà hàng tích hợp sơ đồ bàn, gọi món tại bàn, màn hình bếp Realtime và báo cáo doanh thu.",
    description:
      "Giải pháp số hóa toàn diện cho nhà hàng: từ khâu nhân viên chọn bàn, lên order trên máy tính bảng, đồng bộ tức thì xuống màn hình bếp (KDS) đến thu ngân thanh toán và in hóa đơn.",
    problem:
      "Nhà hàng ghi order bằng giấy thủ công dẫn đến nhầm món, thất thoát doanh thu vào giờ cao điểm và thời gian chờ món lâu do phải di chuyển giữa khu vực bàn ăn và bếp.",
    solution:
      "Xây dựng hệ thống POS giao diện cảm ứng tối ưu thao tác nhanh, kết nối Realtime giữa quầy thu ngân – nhân viên phục vụ – màn hình bếp và tự động tổng hợp doanh thu cuối ca.",
    role: "Full-stack Developer",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Socket.io", "Tailwind CSS"],
    features: [
      "Sơ đồ bàn trực quan theo khu vực/tầng và trạng thái bàn",
      "Gọi món nhanh, ghi chú khẩu vị và tự động đẩy xuống màn hình bếp",
      "Tách/gộp bàn, tính chiết khấu, thanh toán và xuất phiếu in nhiệt",
      "Quản lý thực đơn, định lượng nguyên liệu và trạng thái hết món",
      "Báo cáo doanh thu theo ca làm việc, phương thức thanh toán",
      "Đồng bộ Realtime đa thiết bị trong mạng nội bộ và Cloud",
    ],
    metrics: [
      { label: "Rút ngắn thời gian lên món", value: "-45%" },
      { label: "Giảm sai sót order", value: "99%" },
      { label: "Thao tác tạo bill", value: "< 10 giây" },
      { label: "Hoạt động ổn định", value: "24/7" },
    ],
    architecture: {
      summary:
        "Giao diện POS tối ưu cho màn hình cảm ứng, đồng bộ trạng thái bàn và danh sách món chờ chế biến qua WebSocket thời gian thực.",
      layers: [
        {
          name: "Touch POS & Kitchen Display (KDS)",
          items: ["Cashier Touch UI", "Waiter Tablet View", "Realtime Kitchen Display Screen"],
        },
        {
          name: "Order & Billing Core",
          items: ["Next.js API & Server Actions", "Socket.io Event Hub", "Thermal Receipt Print Service"],
        },
        {
          name: "Database",
          items: ["PostgreSQL", "Prisma ORM", "Daily Shift & Revenue Aggregation"],
        },
      ],
    },
    screenshots: [
      "/images/projects/pos-1.jpg",
      "/images/projects/pos-2.jpg",
    ],
    demoUrl: undefined,
    githubUrl: "https://github.com/CongGenZ",
    year: "2023",
    status: "completed",
    featured: true,
  },
  {
    slug: "portfolio-website",
    title: "Interactive Portfolio & Telegram Live Chat System",
    category: "Full-stack",
    shortDescription:
      "Hệ thống Portfolio cá nhân tích hợp Live Chat 2 chiều qua Telegram Bot, Supabase Realtime, Trợ lý tư vấn tự động và Công cụ ước tính báo giá.",
    description:
      "Không chỉ là trang giới thiệu cá nhân tĩnh, hệ thống được thiết kế như một sản phẩm Full-stack thực thụ giúp khách hàng có thể ước tính chi phí dự án, nhận phản hồi tức thì từ trợ lý thông minh và chat trực tiếp 2 chiều với developer ngay trên Telegram.",
    problem:
      "Các trang portfolio truyền thống chỉ hiển thị thông tin một chiều khiến khách hàng ngại liên hệ, hoặc khi khách nhắn tin thì developer không biết ngay để phản hồi kịp thời.",
    solution:
      "Kết hợp Next.js 16 App Router, Supabase Realtime (Postgres Changes + Broadcast) và Telegram Bot API (tự động chuyển đổi thông minh giữa Webhook và Auto-Polling), kèm hệ thống trả lời tự động và gửi mail Nodemailer 3 lớp dự phòng.",
    role: "Full-stack Developer",
    technologies: ["Next.js", "TypeScript", "Supabase", "Telegram Bot API", "Tailwind CSS", "Vercel"],
    features: [
      "Live Chat 2 chiều: Khách nhắn trên web ↔ Admin reply trực tiếp từ Telegram",
      "Đồng bộ Realtime kết hợp Supabase Postgres Changes, Broadcast & Auto-Polling",
      "Trợ lý tư vấn thông minh trả lời nhanh báo giá, CV, công nghệ 24/7",
      "Công cụ ước tính chi phí & thời gian làm dự án tương tác (Project Estimator)",
      "Command Palette (Ctrl+K) điều hướng nhanh & chuyển đổi giao diện Sáng/Tối",
      "Hệ thống Contact 3 lớp dự phòng (SMTP Auto-reply Email + Supabase + Telegram)",
    ],
    metrics: [
      { label: "Điểm hiệu năng & SEO", value: "100/100" },
      { label: "Độ trễ tin nhắn Telegram", value: "< 1.5s" },
      { label: "Độ tin cậy thông báo", value: "3 lớp Fallback" },
      { label: "Trải nghiệm phản hồi", value: "24/7 Instant" },
    ],
    architecture: {
      summary:
        "Kiến trúc Serverless trên Next.js 16 kết nối song song Supabase Realtime và Telegram Bot API với cơ chế tự phục hồi (Self-healing Webhook/Polling).",
      layers: [
        {
          name: "Interactive Frontend",
          items: ["Next.js 16 & React 19", "Realtime Chat Widget", "Project Cost Estimator", "Ctrl+K Command Palette"],
        },
        {
          name: "Serverless API & Bot Bridge",
          items: ["/api/chat & Smart Responder", "/api/telegram-webhook", "Hybrid Webhook + Auto-Polling Sync", "Nodemailer HTML Auto-Reply"],
        },
        {
          name: "Realtime Database",
          items: ["Supabase PostgreSQL", "Realtime Broadcast & CDC", "Session & Message Mapping"],
        },
      ],
    },
    screenshots: [
      "/images/projects/portfolio-1.jpg",
      "/images/projects/portfolio-2.jpg",
    ],
    demoUrl: "https://github.com/CongGenZ",
    githubUrl: "https://github.com/CongGenZ",
    year: "2025",
    status: "completed",
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
