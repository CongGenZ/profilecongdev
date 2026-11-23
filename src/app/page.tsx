import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { TechStack } from "@/components/sections/tech-stack";
import { ProjectEstimator } from "@/components/sections/project-estimator";
import { WorkProcess } from "@/components/sections/work-process";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { ChatWidget } from "@/components/shared/chat-widget";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
        <TechStack />
        <ProjectEstimator />
        <WorkProcess />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <ChatWidget />
    </>
  );
}
