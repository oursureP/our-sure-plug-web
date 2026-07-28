import { Footer } from "../components/web/Footer";
import { Navbar } from "../components/web/Navbar";
import { Service } from "../interfaces";
import { serverFetch } from "../lib/api/server";
import NextTopLoader from "nextjs-toploader";
import { ScrollToTop } from "../components/web/scroll-to-top";

export default async function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const services = await serverFetch<Service[]>("/services", {
    revalidate: 600,
  });
  const categories = (services ?? []).filter((s) => s.isActive).slice(0, 6);
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      <Navbar categories={categories} />
      <NextTopLoader
        color="var(--brand-green)"
        height={3}
        showSpinner={false}
        shadow="0 0 10px var(--brand-green), 0 0 5px var(--brand-green)"
      />
      <main className="grow w-full">{children}</main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}
