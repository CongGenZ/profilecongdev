import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "global-cse-juniors",
    title: "Global CSE Juniors",
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
    screenshots: ["/images/projects/juniors-globalcse.jpg"],
    demoUrl: "https://juniors.globalcse.org/",
    githubUrl: "https://github.com/CongGenZ",
    year: "2025",
    status: "in-progress",
    featured: true,
  },
  {
    slug: "ecommerce-platform",
    title: "E-Commerce Platform",
    shortDescription:
      "Nền tảng thương mại điện tử hoàn chỉnh với quản lý sản phẩm, đơn hàng và thanh toán.",
    description:
      "Hệ thống thương mại điện tử xây dựng cho một doanh nghiệp bán lẻ vừa và nhỏ, hỗ trợ quản lý sản phẩm, đơn hàng, khách hàng và tích hợp cổng thanh toán.",
    problem:
      "Khách hàng đang dùng Excel để quản lý đơn hàng, dễ xảy ra sai sót và mất dữ liệu. Cần một hệ thống tự động hóa toàn bộ quy trình từ đặt hàng đến bàn giao.",
    solution:
      "Xây dựng platform với admin dashboard quản lý đầy đủ, tích hợp VNPay, hệ thống thông báo email tự động và báo cáo doanh thu theo thời gian thực.",
    role: "Full-stack Developer",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "VNPay API", "Tailwind CSS"],
    features: [
      "Quản lý sản phẩm và danh mục",
      "Giỏ hàng và thanh toán online",
      "Tích hợp VNPay",
      "Dashboard quản trị",
      "Báo cáo doanh thu",
      "Thông báo email tự động",
    ],
    screenshots: [
      "/images/projects/ecommerce-1.jpg",
      "/images/projects/ecommerce-2.jpg",
    ],
    demoUrl: "https://example.com",
    githubUrl: undefined,
    year: "2024",
    status: "completed",
    featured: true,
  },
  {
    slug: "task-management-app",
    title: "Task Management System",
    shortDescription:
      "Hệ thống quản lý công việc cho nhóm với tính năng phân công, theo dõi tiến độ và báo cáo.",
    description:
      "Web application quản lý công việc nội bộ cho một công ty công nghệ, cho phép tạo task, phân công cho thành viên và theo dõi tiến độ theo sprint.",
    problem:
      "Đội nhóm đang dùng nhiều công cụ rời rạc (chat, email, Google Sheets) để theo dõi công việc. Cần một nơi tập trung để quản lý toàn bộ.",
    solution:
      "Xây dựng ứng dụng với board Kanban, hệ thống phân quyền theo role, comment và attach file, dashboard theo dõi tiến độ sprint.",
    role: "Frontend Developer & System Designer",
    technologies: ["React", "TypeScript", "Node.js", "Express", "MySQL", "Socket.io"],
    features: [
      "Kanban board kéo thả",
      "Phân quyền theo role",
      "Comment và đính kèm file",
      "Theo dõi sprint",
      "Thông báo realtime",
      "Dashboard tiến độ",
    ],
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
    title: "Restaurant POS System",
    shortDescription:
      "Hệ thống quản lý nhà hàng tích hợp POS, quản lý bàn, thực đơn và báo cáo.",
    description:
      "Giải pháp quản lý nhà hàng toàn diện bao gồm quản lý bàn, gọi món, in bill và đồng bộ với bếp.",
    problem:
      "Nhà hàng dùng giấy tờ thủ công, hay xảy ra nhầm order và chậm phục vụ. Cần hệ thống số hóa toàn bộ quy trình.",
    solution:
      "Xây dựng POS với màn hình cảm ứng cho thu ngân, màn hình bếp realtime, quản lý bàn trực quan và báo cáo doanh thu cuối ngày.",
    role: "Full-stack Developer",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Socket.io", "Tailwind CSS"],
    features: [
      "Sơ đồ bàn trực quan",
      "Gọi món và in order bếp",
      "Thanh toán và in bill",
      "Quản lý thực đơn",
      "Báo cáo doanh thu",
      "Realtime sync",
    ],
    screenshots: [
      "/images/projects/pos-1.jpg",
      "/images/projects/pos-2.jpg",
    ],
    demoUrl: undefined,
    githubUrl: undefined,
    year: "2023",
    status: "completed",
    featured: true,
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    shortDescription:
      "Website portfolio cho một designer freelance với CMS tự quản lý nội dung.",
    description:
      "Website portfolio cá nhân cho một UI/UX Designer, có CMS để tự cập nhật dự án, blog và thông tin cá nhân mà không cần lập trình.",
    problem:
      "Designer cần website để showcase công việc nhưng không biết code, cần tự quản lý nội dung dễ dàng.",
    solution:
      "Xây dựng website với Sanity CMS headless, giao diện chỉnh sửa thân thiện, tối ưu SEO và loading nhanh.",
    role: "Full-stack Developer",
    technologies: ["Next.js", "TypeScript", "Sanity CMS", "Tailwind CSS", "Vercel"],
    features: [
      "CMS headless dễ dùng",
      "SEO tối ưu",
      "Gallery dự án",
      "Blog tích hợp",
      "Form liên hệ",
      "Tốc độ tải nhanh",
    ],
    screenshots: [
      "/images/projects/portfolio-1.jpg",
    ],
    demoUrl: "https://example.com",
    githubUrl: undefined,
    year: "2023",
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
