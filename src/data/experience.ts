import type { ExperienceItem, TestimonialItem } from "@/types";

export const experiences: ExperienceItem[] = [
  {
    period: "2024 — Hiện tại",
    role: "Full-stack Web Developer",
    company: "Global CSE & Freelance Projects",
    type: "Full-time & Freelance",
    description:
      "Tham gia phát triển nền tảng giáo dục quốc tế Global CSE Juniors và trực tiếp tư vấn, thiết kế kiến trúc, triển khai trọn gói các dự án Website / Web App cho khách hàng doanh nghiệp vừa và nhỏ.",
    highlights: [
      "Xây dựng kiến trúc .NET Microservices kết hợp React.js và PostgreSQL phục vụ người dùng đa quốc gia",
      "Triển khai các hệ thống E-Commerce, quản lý nội bộ và Realtime Web App với Next.js, TypeScript, Supabase",
      "Tối ưu hóa hiệu năng Core Web Vitals, SEO kỹ thuật và đóng gói tự động hóa với Docker",
    ],
    technologies: ["Next.js", "React.js", ".NET Microservices", "TypeScript", "PostgreSQL", "Docker"],
  },
  {
    period: "2023 — 2024",
    role: "Frontend & Full-stack Developer",
    company: "Dự án Phần mềm & Giải pháp Quản trị",
    type: "Project-based",
    description:
      "Phát triển các ứng dụng quản lý nghiệp vụ (Restaurant POS, Task & Sprint Management, CMS Portfolio) với trọng tâm là trải nghiệm giao diện mượt mà và đồng bộ dữ liệu thời gian thực.",
    highlights: [
      "Xây dựng giao diện POS cảm ứng và màn hình bếp đồng bộ thời gian thực qua Socket.io, giảm 45% thời gian chờ món",
      "Thiết kế hệ thống phân quyền RBAC, bảng Kanban kéo thả và dashboard báo cáo doanh thu trực quan",
      "Chuẩn hóa quy trình làm việc trực tiếp với khách hàng từ khâu phân tích bài toán đến bàn giao source code",
    ],
    technologies: ["React", "Next.js", "Node.js", "Prisma", "Socket.io", "Tailwind CSS"],
  },
];

export const testimonials: TestimonialItem[] = [
  {
    id: "t1",
    name: "Anh Minh Quân",
    role: "Product Owner",
    company: "Dự án Giáo dục Trực tuyến",
    project: "Nền tảng học tập & kết nối quốc tế",
    content:
      "Công nắm bắt nghiệp vụ rất nhanh, đặc biệt là khả năng phối hợp cả Frontend React lẫn Backend .NET Microservices. Giao diện làm ra thân thiện, mượt mà và hệ thống chịu tải rất ổn định.",
    rating: 5,
  },
  {
    id: "t2",
    name: "Chị Thu Hương",
    role: "Founder & Quản lý vận hành",
    company: "Doanh nghiệp Bán lẻ",
    project: "Hệ thống E-Commerce & Quản lý đơn hàng",
    content:
      "Trước đây bên mình quản lý đơn bằng Excel rất hay nhầm lẫn. Từ khi Công xây dựng hệ thống web mới tích hợp sẵn VNPay và báo cáo tự động, thời gian xử lý đơn mỗi ngày giảm hơn một nửa.",
    rating: 5,
  },
  {
    id: "t3",
    name: "Anh Hoàng Nam",
    role: "Quản lý chuỗi F&B",
    company: "Nhà hàng & Bistro",
    project: "Hệ thống Smart Restaurant POS",
    content:
      "Điểm mình thích nhất khi làm việc với Công là sự rõ ràng về timeline và hỗ trợ rất nhiệt tình. Màn hình POS và đồng bộ bếp chạy realtime cực nhạy, nhân viên chỉ mất 1 buổi là dùng thành thạo.",
    rating: 5,
  },
];

