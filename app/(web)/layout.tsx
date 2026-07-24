import { Footer } from "../components/web/Footer";
import { Navbar } from "../components/web/Navbar";
import { Service } from "../interfaces";
import { serverFetch } from "../lib/api/server";

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
      <main className="grow w-full">{children}</main>
      <Footer />
    </div>
  );
}
