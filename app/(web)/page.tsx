import type { Metadata } from "next";
import { Hero } from "../components/web/Hero";
import { TrustStrip } from "../components/web/trust-strip";
import { Services } from "../components/web/services";
import { Stats } from "../components/web/stats";
import { About } from "../components/web/about";
import { Process } from "../components/web/process";
import { TrainingHighlight } from "../components/web/training-highlight";
import { Testimonials } from "../components/web/testimonials";
import { FAQ } from "../components/web/faq";
import { BlogPreview } from "../components/web/blog-preview";
import { CTABanner } from "../components/web/cta-banner";
import { BlogPost, Course, Service } from "../interfaces";
import { serverFetch } from "../lib/api/server";

export const metadata: Metadata = {
  title: "Home",
  description:
    "OurSurePlug — Nigeria's premier digital agency in Port Harcourt. Web design, AI integration, and growth strategy.",
};

export default async function HomePage() {
  const [services, courses, posts] = await Promise.all([
    serverFetch<Service[]>("/services", { revalidate: 300 }),
    serverFetch<Course[]>("/courses", { revalidate: 300 }),
    serverFetch<BlogPost[]>("/blog", { revalidate: 300 }),
  ]);
  return (
    <>
      <Hero />
      <TrustStrip />
      <Services services={services ?? undefined} />
      <Stats />
      <About />
      <Process />
      <TrainingHighlight list={courses ?? undefined} />
      <Testimonials />
      <FAQ />
      <BlogPreview posts={posts ?? undefined} />
      <CTABanner />
    </>
  );
}
