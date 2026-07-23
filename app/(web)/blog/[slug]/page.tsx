import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
// import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, User as UserIcon } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { serverFetch } from "@/app/lib/api/server";
import { BlogPost } from "@/app/interfaces/blog.interface";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await serverFetch<BlogPost>(`/blog/slug/${slug}`, {
    revalidate: 300,
  });
  if (!post) return { title: "Article | OurSurePlug Blog" };

  // Strip HTML for a clean meta description
  const plainText = post.content.replace(/<[^>]+>/g, "").slice(0, 160);

  return {
    title: `${post.title} | OurSurePlug Blog`,
    description: plainText,
    openGraph: {
      title: post.title,
      description: plainText,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
  };
}

function formatDate(date?: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Fallback so the page renders during development with an empty DB
const fallbackPost: BlogPost = {
  id: "preview",
  title: "5 Web Design Trends Every Nigerian Business Should Know in 2026",
  slug: "preview",
  content: `<p>The digital landscape in Nigeria is evolving faster than ever. As more businesses move online, standing out requires staying ahead of design trends that actually drive results.</p><h2>1. Speed is everything</h2><p>Nigerian users are often on mobile data. A fast, lightweight site isn't optional — it's the difference between a customer and a bounce.</p><h2>2. Bold, confident typography</h2><p>Large, expressive headlines command attention and communicate confidence. Brands are moving away from timid, small text.</p><h2>3. Dark mode by default</h2><p>More users prefer dark interfaces. Designing for both light and dark modes is now a baseline expectation.</p><p>Want a website that follows these principles? <strong>Let's talk.</strong></p>`,
  coverImage: null,
  isPublished: true,
  publishedAt: "2026-06-01T00:00:00Z",
  authorId: "",
  createdAt: "2026-06-01T00:00:00Z",
  updatedAt: "",
  author: { id: "", firstName: "OurSurePlug", lastName: "Team", image: null },
  tags: [
    { id: "t1", name: "Design" },
    { id: "t2", name: "Web" },
  ],
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const fetched = await serverFetch<BlogPost>(`/blog/slug/${slug}`, {
    revalidate: 300,
  });
  const post = fetched ?? fallbackPost;

  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : "OurSurePlug Team";

  // Sanitize the HTML content before rendering
  const cleanContent = DOMPurify.sanitize(post.content);

  return (
    <article className="bg-background pt-28 pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft size={15} /> All Articles
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-primary/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="mb-5 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mb-8 flex flex-wrap items-center gap-5 border-b border-border pb-8 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <UserIcon size={15} className="text-primary" /> {authorName}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={15} className="text-primary" />{" "}
            {formatDate(post.publishedAt ?? post.createdAt)}
          </span>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative mb-10 aspect-video overflow-hidden rounded-2xl border border-border">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* Footer CTA */}
        <div className="mt-14 rounded-2xl border border-border bg-card p-8 text-center dark:bg-[#161427]">
          <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground">
            Enjoyed this article?
          </h2>
          <p className="mb-5 text-sm text-muted-foreground">
            Let&apos;s help your business grow with the same expertise.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:-translate-y-0.5 hover:opacity-90">
            Get In Touch
          </Link>
        </div>
      </div>
    </article>
  );
}
