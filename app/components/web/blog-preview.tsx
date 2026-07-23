import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import { BlogPost } from "@/app/interfaces/blog.interface";
// import { useBlogPosts } from "@/app/hooks/use-blog";
// Fallback posts — shaped like real BlogPost
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
// ];

export function BlogPreview({ posts }: { posts?: BlogPost[] }) {
  //   const { data, isLoading } = useBlogPosts();

  const list =
    posts && posts.length > 0
      ? posts.filter((p) => p.isPublished).slice(0, 3)
      : fallbackPosts;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <span className="mb-3 inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-primary">
              From the Blog
            </span>
            <h2 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              Insights to help you <span className="text-primary">grow</span>
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tips, trends and strategies from our team of digital experts.
            </p>
          </div>
          <Link
            href="/blog"
            className="group hidden shrink-0 items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 sm:inline-flex dark:bg-[#161427]">
            View all posts
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-md shadow-black/4 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/12 dark:border-white/10 dark:bg-[#161427] dark:shadow-none">
              {/* Cover */}
              <div className="relative h-48 overflow-hidden bg-muted">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText size={34} className="text-muted-foreground/40" />
                  </div>
                )}
                {post.tags && post.tags.length > 0 && (
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary backdrop-blur-sm">
                    {post.tags[0].name}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                  <Calendar size={12} className="text-primary" />
                  {formatDate(post.publishedAt ?? post.createdAt)}
                </div>
                <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {post.title}
                </h3>
                <span className="mt-auto flex items-center gap-1.5 text-xs font-semibold text-primary">
                  Read article
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view-all */}
        <div className="mt-10 flex justify-center sm:hidden">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground dark:bg-[#161427]">
            View all posts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
