import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { BlogPost } from "@/app/interfaces/blog.interface";
import { serverFetch } from "@/app/lib/api/server";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog | OurSurePlug",
  description:
    "Insights, tips and strategies on web design, AI, digital marketing and growing your brand online — from the OurSurePlug team.",
  openGraph: {
    title: "Blog | OurSurePlug",
    description: "Insights to help your business grow online.",
    type: "website",
  },
};

const fallbackPosts: BlogPost[] = [
  {
    id: "fb1",
    title: "5 Web Design Trends Every Nigerian Business Should Know in 2026",
    slug: "web-design-trends-2026",
    content: "",
    coverImage: null,
    isPublished: true,
    publishedAt: "2026-06-01T00:00:00Z",
    authorId: "",
    createdAt: "2026-06-01T00:00:00Z",
    updatedAt: "",
    author: { id: "", firstName: "OurSurePlug", lastName: "Team", image: null },
    tags: [{ id: "t1", name: "Design" }],
  },
  {
    id: "fb2",
    title: "How AI Is Transforming Small Businesses Across Africa",
    slug: "ai-transforming-small-business",
    content: "",
    coverImage: null,
    isPublished: true,
    publishedAt: "2026-05-20T00:00:00Z",
    authorId: "",
    createdAt: "2026-05-20T00:00:00Z",
    updatedAt: "",
    author: { id: "", firstName: "OurSurePlug", lastName: "Team", image: null },
    tags: [{ id: "t2", name: "AI" }],
  },
  {
    id: "fb3",
    title: "A Beginner's Guide to Growing Your Brand on Social Media",
    slug: "growing-brand-social-media",
    content: "",
    coverImage: null,
    isPublished: true,
    publishedAt: "2026-05-08T00:00:00Z",
    authorId: "",
    createdAt: "2026-05-08T00:00:00Z",
    updatedAt: "",
    author: { id: "", firstName: "OurSurePlug", lastName: "Team", image: null },
    tags: [{ id: "t3", name: "Marketing" }],
  },
  {
    id: "fb4",
    title: "Why Every Business Needs a Fast, Mobile-First Website",
    slug: "mobile-first-website",
    content: "",
    coverImage: null,
    isPublished: true,
    publishedAt: "2026-04-22T00:00:00Z",
    authorId: "",
    createdAt: "2026-04-22T00:00:00Z",
    updatedAt: "",
    author: { id: "", firstName: "OurSurePlug", lastName: "Team", image: null },
    tags: [{ id: "t4", name: "Web" }],
  },
  {
    id: "fb5",
    title: "Digital Skills That Will Land You a Job in 2026",
    slug: "digital-skills-jobs-2026",
    content: "",
    coverImage: null,
    isPublished: true,
    publishedAt: "2026-04-10T00:00:00Z",
    authorId: "",
    createdAt: "2026-04-10T00:00:00Z",
    updatedAt: "",
    author: { id: "", firstName: "OurSurePlug", lastName: "Team", image: null },
    tags: [{ id: "t5", name: "Career" }],
  },
  {
    id: "fb6",
    title: "Automating Your Business: Where to Start",
    slug: "automating-your-business",
    content: "",
    coverImage: null,
    isPublished: true,
    publishedAt: "2026-03-28T00:00:00Z",
    authorId: "",
    createdAt: "2026-03-28T00:00:00Z",
    updatedAt: "",
    author: { id: "", firstName: "OurSurePlug", lastName: "Team", image: null },
    tags: [{ id: "t6", name: "Automation" }],
  },
];

function formatDate(date?: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// const gradients = [
//   "from-[#1e3a5f] to-[#2d5a8c]",
//   "from-[#3d1f6b] to-[#6b21d6]",
//   "from-[#5f4a1e] to-[#8c7a2d]",
//   "from-[#1a5c3a] to-[#2d8c5a]",
//   "from-[#5f1e4a] to-[#8c2d6b]",
//   "from-[#2d4a5f] to-[#2d6b8c]",
// ];

export default async function BlogPage() {
  const data = await serverFetch<BlogPost[]>("/blog", { revalidate: 300 });
  const posts = data && data.length > 0 ? data : fallbackPosts;

  const [featured, ...rest] = posts;

  return (
    <div className="bg-background pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
            Our Blog
          </span>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Insights to help you <span className="text-primary">grow</span>
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground">
            Tips, trends and strategies on digital growth from our team of
            experts.
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-10 grid overflow-hidden rounded-3xl border border-border bg-card shadow-md shadow-black/4 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/12 dark:border-white/10 dark:bg-[#161427] dark:shadow-none lg:grid-cols-2">
            <div className="relative h-56 overflow-hidden lg:h-auto">
              {featured.coverImage ? (
                <Image
                  src={featured.coverImage}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div
                  className={`flex h-full min-h-55 w-full items-center justify-center bg-linear-to-br`}>
                  <FileText size={48} className="text-white/80" />
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-10">
              {featured.tags?.[0] && (
                <span className="mb-3 w-fit rounded-full bg-primary/12 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {featured.tags[0].name}
                </span>
              )}
              <h2 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
                {featured.title}
              </h2>
              <div className="mb-4 flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
                <Calendar size={13} className="text-primary" />
                {formatDate(featured.publishedAt ?? featured.createdAt)}
              </div>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article{" "}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </div>
          </Link>
        )}

        {/* Rest of posts */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-black/4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/12 dark:border-white/10 dark:bg-[#161427] dark:shadow-none">
              <div className="relative h-44 overflow-hidden bg-muted">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText size={32} className="text-muted-foreground/40" />
                  </div>
                )}
                {post.tags?.[0] && (
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary backdrop-blur-sm">
                    {post.tags[0].name}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <Calendar size={12} className="text-primary" />
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </div>
                <h2 className="mb-3 line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h2>
                <span className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-primary">
                  Read article{" "}
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
