import type { TechCategory } from "@/types";

export const techStack: TechCategory[] = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "JavaScript"],
  },
  {
    category: "Backend",
    items: ["Node.js", "NestJS", "Express", "REST API"],
  },
  {
    category: "Database",
    items: ["PostgreSQL", "MySQL", "Prisma ORM", "Redis"],
  },
  {
    category: "Tools & Platform",
    items: ["Git", "Docker", "Figma", "Vercel", "Linux"],
  },
];

export const workSteps = [
  {
    number: "01",
    title: "Trao đổi yêu cầu",
    description:
      "Lắng nghe ý tưởng, mục tiêu và phạm vi dự án của bạn. Mình sẽ đặt câu hỏi để hiểu rõ bài toán cần giải quyết.",
  },
  {
    number: "02",
    title: "Phân tích & Lên kế hoạch",
    description:
      "Đề xuất giải pháp kỹ thuật, thống nhất danh sách chức năng, timeline và chi phí. Mọi thứ được ghi rõ ràng trước khi bắt đầu.",
  },
  {
    number: "03",
    title: "Phát triển",
    description:
      "Triển khai sản phẩm theo đúng kế hoạch. Cập nhật tiến độ định kỳ để bạn luôn nắm được tình trạng dự án.",
  },
  {
    number: "04",
    title: "Kiểm thử & Bàn giao",
    description:
      "Kiểm thử kỹ lưỡng, hoàn thiện theo phản hồi, bàn giao source code và hỗ trợ deploy theo thỏa thuận.",
  },
];
