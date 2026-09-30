import type { Service } from "@/types";

export const services: Service[] = [
  {
    id: "website",
    title: "Website Development",
    description:
      "Thiết kế và phát triển website từ landing page đơn giản đến website doanh nghiệp đầy đủ tính năng.",
    features: [
      "Website doanh nghiệp",
      "Landing Page",
      "Portfolio cá nhân",
      "Blog & CMS",
      "Website theo yêu cầu",
    ],
    icon: "Globe",
  },
  {
    id: "webapp",
    title: "Web Application",
    description:
      "Phát triển các ứng dụng web phức tạp với đầy đủ tính năng nghiệp vụ, quản lý dữ liệu và giao diện thân thiện.",
    features: [
      "Dashboard quản trị",
      "Hệ thống quản lý (ERP, CRM)",
      "Web App theo nghiệp vụ",
      "Tích hợp API bên thứ ba",
      "Xác thực và phân quyền",
    ],
    icon: "Layout",
  },
  {
    id: "mobile",
    title: "Mobile App Development",
    description:
      "Phát triển ứng dụng di động đa nền tảng cho iOS và Android, tích hợp API và các dịch vụ bên ngoài.",
    features: [
      "React Native (iOS & Android)",
      "Tích hợp REST API",
      "Push notification",
      "Offline mode",
      "App Store deployment",
    ],
    icon: "Smartphone",
  },
  {
    id: "maintenance",
    title: "Maintenance & Optimization",
    description:
      "Hỗ trợ bảo trì, sửa lỗi, nâng cấp tính năng và tối ưu hiệu suất cho các hệ thống hiện có.",
    features: [
      "Sửa lỗi và debug",
      "Nâng cấp tính năng",
      "Tối ưu hiệu suất",
      "Code review & refactor",
      "Hỗ trợ kỹ thuật",
    ],
    icon: "Wrench",
  },
];
