# Project Structure — profilecongdev

Portfolio website cho Nguyen Van Cong (Cong Dev) — Freelance Web Developer.  
Stack: **Next.js 16 · React 19 · TypeScript 5 · Tailwind CSS v4 · shadcn/ui (base-nova)**  
Ngôn ngữ giao diện: **Tiếng Việt**

---

## Tổng quan kiến trúc

- Không có database — toàn bộ nội dung (profile, projects, services) là dữ liệu tĩnh trong `src/data/`
- Không có authentication
- Project detail pages dùng SSG (`generateStaticParams`)
- Server Action `submitContact` chỉ log ra console, chưa gửi email thật (TODO: Resend/Nodemailer)
- **Thiếu**: `/projects` index page và các file ảnh trong `public/images/`

---

## Cây thư mục

```
d:\profilecongdev\
├── public/
│   ├── images/              ← THƯ MỤC RỖNG — cần thêm avatar & project screenshots
│   └── *.svg                ← SVG mặc định từ Create Next App (chưa dùng)
├── src/
│   ├── app/                 ← Next.js App Router
│   ├── actions/             ← Next.js Server Actions
│   ├── components/          ← React components
│   ├── data/                ← Dữ liệu tĩnh (content)
│   ├── lib/                 ← Utilities & validations
│   └── types/               ← TypeScript interfaces
├── CLAUDE.md                ← Chỉ reference @AGENTS.md
├── AGENTS.md                ← Tự sinh bởi `next dev`, đừng xóa
├── components.json          ← Config shadcn/ui CLI
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

---

## Config files

### `package.json`
Dependencies chính:
| Package | Mục đích |
|---|---|
| `next@16.3.6` | Framework |
| `react@19.2.8` | UI runtime |
| `@base-ui/react@^1.8.0` | UI primitives (thay Radix UI) |
| `motion@^13.4.4` | Animation (Framer Motion v11+ đổi tên) |
| `react-hook-form` + `@hookform/resolvers` | Form state + Zod validation |
| `zod@^4.6.5` | Schema validation |
| `lucide-react@^1.48.0` | Icon library |
| `class-variance-authority` | Component variant utility |
| `cn@^0.4.0` | Tailwind class merge (như clsx) |
| `tailwindcss@^4` | Styling |
| `shadcn@^4.21.0` | Component CLI |

Scripts: `dev`, `build`, `start`, `lint`

### `next.config.ts`
Minimal config. Chỉ có `images: { unoptimized: false, remotePatterns: [] }`.

### `tsconfig.json`
- Target ES2017, moduleResolution: bundler
- Path alias: `@/*` → `./src/*`
- Strict mode bật

### `components.json`
shadcn/ui với style **base-nova** (dùng `@base-ui/react` thay Radix):
- Base color: `neutral`, CSS variables: true
- Tailwind CSS file: `src/app/globals.css`
- Icon library: `lucide`
- Aliases: `@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`, `@/hooks`

### `postcss.config.mjs`
Chỉ dùng `@tailwindcss/postcss` (tích hợp Tailwind v4).

### `eslint.config.mjs`
Rules: `next/core-web-vitals` + `next/typescript`.

---

## src/types/index.ts
**Tất cả TypeScript interfaces của project.**

| Interface | Fields |
|---|---|
| `Project` | `slug`, `title`, `shortDescription`, `description`, `problem`, `solution`, `role`, `technologies[]`, `features[]`, `screenshots[]`, `demoUrl?`, `githubUrl?`, `year`, `status` (`"completed"` \| `"in-progress"`), `featured` |
| `Service` | `id`, `title`, `description`, `features[]`, `icon` (string name) |
| `TechCategory` | `category`, `items[]` |
| `WorkStep` | `number`, `title`, `description` |
| `Profile` | `name`, `displayName`, `title`, `tagline`, `bio`, `email`, `github`, `linkedin`, `avatar`, `available`, `location` |
| `ContactFormData` | `name`, `email`, `projectType`, `message` |

---

## src/data/

### `profile.ts`
Singleton `profile: Profile`. Thông tin cá nhân duy nhất:
- `name`: "Nguyen Van Cong", `displayName`: "Cong Dev"
- `title`: "Freelance Web Developer"
- `tagline`: dòng H1 trên hero section
- `bio`: 3 đoạn tiếng Việt (hiển thị ở About section)
- `email`: nvcong25042003@gmail.com
- `github`: https://github.com/nvcong25042003
- `linkedin`: https://linkedin.com/in/nvcong25042003
- `avatar`: `/images/profile/avatar.jpg` (**file chưa có**)
- `available`: `true`

### `projects.ts`
Mảng 4 `Project` + 2 helper functions:

| slug | Tên | Featured | Status |
|---|---|---|---|
| `ecommerce-platform` | E-Commerce Platform | ✓ | completed |
| `task-management-app` | Task Management System | ✓ | completed |
| `restaurant-pos` | Restaurant POS System | ✓ | completed |
| `portfolio-website` | Portfolio Website | ✗ | completed |

Exports:
- `getProjectBySlug(slug: string): Project | undefined`
- `getFeaturedProjects(): Project[]` — filter `featured === true`, trả về 3 dự án

**Lưu ý**: Tất cả `screenshots[]` đều tham chiếu ảnh trong `public/images/projects/` — thư mục hiện rỗng.

### `services.ts`
Mảng 4 `Service`:
1. `website` — Website Development (icon: `Globe`)
2. `webapp` — Web Application (icon: `Layout`)
3. `mobile` — Mobile App Development (icon: `Smartphone`)
4. `maintenance` — Maintenance & Optimization (icon: `Wrench`)

### `tech-stack.ts`
Exports:
- `techStack: TechCategory[]` — 5 nhóm: Frontend, Backend, Database, Tools & Platform
- `workSteps` — 4 bước quy trình làm việc (plain object, không type `WorkStep`)

---

## src/lib/

### `utils.ts`
Re-export `cn` từ package `cn` — utility merge Tailwind class names.  
Dùng ở khắp nơi: `cn("base-class", conditional && "variant-class")`.

### `validations.ts`
Zod schema `contactSchema` cho contact form:
- `name`: string, min 2, max 100
- `email`: email format, max 200
- `projectType`: string, min 1
- `message`: string, min 20, max 2000

Export type `ContactFormValues = z.infer<typeof contactSchema>`.

---

## src/actions/contact.ts
`"use server"` — Next.js Server Action.

```ts
submitContact(data: unknown): Promise<ContactResult>
```

Flow: validate với `contactSchema.safeParse` → nếu lỗi trả `{ success: false, message }` → nếu hợp lệ: delay 1200ms (giả lập network), log ra console, trả `{ success: true, message }`.

**TODO**: Tích hợp Resend hoặc Nodemailer để gửi email thật.

---

## src/app/

### `layout.tsx`
Root layout. Thiết lập:
- Font: Geist Sans + Geist Mono (qua `next/font/google`, CSS variables)
- `<html lang="vi">`
- SEO metadata đầy đủ từ `profile` data: title, description, keywords, authors, OpenGraph, robots
- Body: `min-h-full flex flex-col`

### `page.tsx`
Home page — compose toàn bộ single-page layout theo thứ tự:
```
<Header>
<main>
  <Hero>
  <About>
  <Services>
  <Projects>
  <TechStack>
  <WorkProcess>
  <Contact>
</main>
<Footer>
```
Không có data fetching — tất cả đến từ `src/data/`.

### `globals.css`
Design system toàn cục (Tailwind v4):

**CSS Custom Properties (`:root`):**
| Token | Giá trị | Dùng cho |
|---|---|---|
| `--background` | `#FAFAF8` | Nền trang (off-white ấm) |
| `--foreground` | `#242424` | Text chính |
| `--accent` / `--primary` | `#315C85` | Màu thương hiệu (steel blue) |
| `--accent-hover` | `#264a6c` | Hover state |
| `--muted` | `#F4F4F2` | Nền phụ |
| `--muted-foreground` | `#737373` | Text phụ |
| `--border` | `#E7E7E5` | Đường viền |

**Utility classes hay dùng:**
| Class | Value |
|---|---|
| `.section-padding` | `py-20 md:py-28` |
| `.container-width` | `max-w-[1120px] mx-auto px-6` |
| `.text-accent` | `color: var(--accent)` |
| `.bg-accent` | `background: var(--accent)` |
| `.text-primary-text` | `color: var(--foreground)` |
| `.text-secondary-text` | `color: var(--muted-foreground)` |

**Lưu ý**: Dark mode được định nghĩa (`.dark` class, `@media prefers-color-scheme`) nhưng **chưa có toggle** trong UI.

### `favicon.ico`
Favicon mặc định.

---

## src/app/projects/[slug]/page.tsx
Dynamic route cho chi tiết dự án — **Server Component, SSG**.

- `generateStaticParams()`: pre-render tất cả slugs lúc build
- `generateMetadata({ params })`: meta title/description từ project data
- Render:
  - `<Header>` + `<Footer>` bao ngoài
  - Back link → `/#projects`
  - Header: year badge, role, title, shortDescription, GitHub/Demo links
  - Hero screenshot (16:9, `next/image`)
  - Grid 2 cột (`2fr / 1fr`):
    - Trái: Tổng quan, Bài toán, Giải pháp, Tính năng chính, thêm screenshots
    - Phải (sidebar): Tech tags, metadata (role, year, status)

**Lưu ý**: Không có `src/app/projects/page.tsx` — link "Tất cả dự án" trong header trỏ đến `/projects` nhưng **page này chưa tồn tại**.

---

## src/components/layout/

### `header.tsx` — `"use client"`
Fixed top nav bar.
- Scroll detection: thêm backdrop-blur + border khi `scrollY > 20`
- Desktop nav: 5 anchor links (Home, About, Services, Projects, Contact) — smooth scroll qua `document.getElementById`
- CTA: "Hire Me" button → scroll đến `#contact`
- Mobile: `<Sheet>` slide-in từ phải (260px wide), hamburger/X toggle

### `footer.tsx` — Server Component
3 cột flex:
- Brand: "Cong Dev." + subtitle
- Email link
- Social icons: GitHub, LinkedIn, Mail
- Copyright line với dynamic year

---

## src/components/sections/

| File | Type | Mô tả |
|---|---|---|
| `hero.tsx` | Client | Fade-up animation (`motion/react`). Grid 2 cột: availability badge + H1 tagline + CTAs + SocialLinks / Avatar image |
| `about.tsx` | Server | Grid 2 cột: SectionHeading / Bio paragraphs + stat grid (2+ năm, 10+ projects, Freelance) |
| `services.tsx` | Server | Grid 2 cột: 4 service cards với icon, title, description, feature list |
| `projects.tsx` | Server | 3 `<ProjectCard>` featured projects + link "Tất cả dự án" |
| `tech-stack.tsx` | Server | Grid 4 cột: tech categories với pill tags |
| `work-process.tsx` | Server | Grid 4 cột: 4 work steps với step numbers + connector dots |
| `contact.tsx` | Client | Form (react-hook-form + zod) gọi `submitContact` / Panel thông tin liên hệ |

---

## src/components/shared/

### `section-heading.tsx`
Props: `label?`, `title`, `description?`, `align?` ("left" | "center")
- `label`: tag nhỏ uppercase, màu accent
- `title`: H2, 2xl–3xl
- `description`: đoạn mô tả mờ, max-w-xl

### `project-card.tsx`
Card dùng trong Projects section:
- Screenshot 16:9 với `next/image` (scale on hover)
- Title + year, shortDescription (line-clamp-2)
- Tech tags (tối đa 4, "+N more" nếu thừa)
- Footer: link "Xem chi tiết" → `/projects/[slug]` + GitHub/Demo icon links

### `social-links.tsx`
Props: `iconSize?`  
Render GitHub, LinkedIn, Email dạng icon button vuông (9×9, border).  
Dùng `GithubIcon`, `LinkedinIcon` từ `icons.tsx` và `Mail` từ lucide.

### `icons.tsx`
Custom SVG components: `GithubIcon`, `LinkedinIcon`.  
Props: `size`, `className`. Render inline SVG với `fill="currentColor"`.

---

## src/components/ui/
shadcn/ui components — **base-nova style** (dùng `@base-ui/react`, không phải Radix UI).  
Tất cả đều dùng `cva` cho variants và `cn()` cho class merging.

| File | Mô tả |
|---|---|
| `button.tsx` | Variants: default, outline, secondary, ghost, destructive, link. Sizes: default(h-8), xs, sm, lg, icon, icon-xs, icon-sm, icon-lg |
| `input.tsx` | Text input, h-8, focus ring, aria-invalid states |
| `textarea.tsx` | `field-sizing-content` auto-height, min-h-16 |
| `select.tsx` | Full select system: `Select`, `SelectTrigger`, `SelectContent` (Portal + Positioner + slide animation), `SelectItem` (check indicator) |
| `form.tsx` | react-hook-form bridge: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage` |
| `badge.tsx` | Variants: default (primary bg), secondary, destructive, outline, ghost, link. Height h-5, rounded-4xl |
| `separator.tsx` | Horizontal (h-px) hoặc vertical (w-px) |
| `sheet.tsx` | Slide-in panel (Sheet). `SheetContent` có prop `side`: top/right/bottom/left. Dùng cho mobile menu |
| `dialog.tsx` | Modal dialog. `DialogContent`: centered fixed, max-w-sm, zoom animation |
| `tooltip.tsx` | `TooltipProvider` (delay=0), `TooltipContent` (Portal + arrow, fade+zoom animation) |

---

## public/

| Path | Trạng thái | Cần làm |
|---|---|---|
| `public/images/profile/avatar.jpg` | **Thiếu** | Thêm ảnh avatar |
| `public/images/projects/*.jpg` | **Thiếu** | Thêm screenshots cho 4 projects |
| `public/*.svg` | Có nhưng chưa dùng | Có thể xóa |

---

## Những việc còn thiếu (TODOs)

1. **Ảnh**: Thêm `avatar.jpg` và project screenshots vào `public/images/`
2. **Email**: Tích hợp Resend hoặc Nodemailer vào `src/actions/contact.ts`
3. **Projects index page**: Tạo `src/app/projects/page.tsx` — header đang có link "Tất cả dự án" trỏ đến đây
4. **Dark mode toggle**: CSS variables đã sẵn sàng, chỉ cần thêm toggle UI
5. **`workSteps` type**: `src/data/tech-stack.ts` export `workSteps` chưa dùng type `WorkStep[]` đã định nghĩa trong `src/types/index.ts`
