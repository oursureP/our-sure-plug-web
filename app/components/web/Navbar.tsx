/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ArrowRight, Menu, X, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Service } from "@/app/interfaces/lms.interface";

interface NavMenu {
  name: string;
  href: string;
  exact?: boolean; // exact match instead of startsWith
  hasDropdown?: boolean; // Training uses the mega dropdown
}

const navMenus: NavMenu[] = [
  { name: "Home", href: "/", exact: true },
  { name: "Services", href: "/services", exact: true },
  { name: "Courses", href: "/courses", hasDropdown: true },
  // { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];
export function Navbar({ categories = [] }: { categories?: Service[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [trainingOpen, setTrainingOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (menu: NavMenu) =>
    menu.exact ? pathname === menu.href : pathname.startsWith(menu.href);

  // Shared desktop link classes with active underline + bold
  const desktopLink = (active: boolean) =>
    cn(
      "relative flex py-2 items-center gap-1 px-4 text-[13.5px] transition-colors",
      "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[3px] after:rounded-full after:transition-all",
      active
        ? "font-bold text-primary after:bg-primary"
        : "font-medium text-muted-foreground hover:text-foreground after:bg-transparent",
    );

  const mobileLink = (active: boolean) =>
    cn(
      "block rounded-lg px-3 py-2.5 text-[14px] transition-colors",
      active
        ? "bg-primary/[0.08] font-bold text-primary"
        : "font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
    );

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-card/50 ",
      )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-17 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-end">
            {/* <div className="flex h-8.5 w-8.5 items-center justify-center rounded-lg bg-primary text-[14px] font-extrabold tracking-tight text-primary-foreground">
              OS
            </div> */}
            <img
              src="/images/logo.png"
              alt="logo"
              className="w-20 h-15 object-cover"
            />
            {/* <span className="text-[15px] mb-1.25 -ml-3 font-bold tracking-tight text-foreground">
              Our<span className="text-primary">Sure</span>Plug
            </span> */}
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center lg:flex">
            {navMenus.map((menu) => {
              const active = isActive(menu);

              if (menu.hasDropdown) {
                return (
                  <li
                    key={menu.href}
                    className="relative"
                    onMouseEnter={() => setTrainingOpen(true)}
                    onMouseLeave={() => setTrainingOpen(false)}>
                    <Link href={menu.href} className={desktopLink(active)}>
                      {menu.name}
                      <ChevronDown
                        size={14}
                        className={cn(
                          "opacity-60 transition-transform duration-200",
                          trainingOpen && "rotate-180 opacity-100",
                        )}
                      />
                    </Link>

                    {/* Mega dropdown */}
                    {/* Mega dropdown */}
                    <div
                      className={cn(
                        "absolute left-1/2 top-full w-145 -translate-x-1/2 rounded-[14px] border border-border bg-popover p-5 shadow-xl transition-all duration-200",
                        trainingOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-2 opacity-0",
                      )}>
                      <p className="mb-3.5 text-[11px] font-bold uppercase tracking-widest text-primary">
                        Browse Courses
                      </p>

                      {categories.length > 0 ? (
                        <div className="mb-4 grid grid-cols-2 gap-2">
                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/courses?service=${cat.slug}`}
                              className="group flex items-start gap-2.5 rounded-lg p-2.5 transition-colors hover:bg-primary/[0.07]">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-primary/10 text-primary">
                                <GraduationCap size={15} />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-foreground transition-colors group-hover:text-primary">
                                  {cat.name}
                                </p>
                                <p className="text-[11.5px] leading-snug text-muted-foreground">
                                  {cat._count?.courses ?? 0} course
                                  {(cat._count?.courses ?? 0) === 1 ? "" : "s"}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="mb-4 px-2.5 py-3 text-[12.5px] text-muted-foreground">
                          New courses coming soon.
                        </p>
                      )}

                      <div className="mb-3.5 h-px bg-border" />
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-muted-foreground">
                          🎓 Learn in-demand digital skills
                        </span>
                        <Link
                          href="/courses"
                          className="flex items-center gap-1 text-[12px] font-semibold text-primary transition-all hover:gap-2">
                          View all <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={menu.href}>
                  <Link href={menu.href} className={desktopLink(active)}>
                    {menu.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* CTA + toggle */}
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <Link
              href="/"
              className="px-4 py-2 text-[13.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Login
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-[13.5px] font-bold text-primary-foreground transition-all hover:-translate-y-px hover:opacity-90">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <ThemeToggle />
            {/* <button
              className="p-2 text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button> */}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="border-t border-border bg-popover px-4 py-4 lg:hidden"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) {
              setMobileOpen(false);
            }
          }}>
          <ul className="flex flex-col gap-1">
            {navMenus.map((menu) => (
              <li key={menu.href}>
                <Link href={menu.href} className={mobileLink(isActive(menu))}>
                  {menu.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Link
              href="/login"
              className="px-3 py-2.5 text-center text-[14px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Login
            </Link>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-[14px] font-bold text-primary-foreground transition-colors hover:opacity-90">
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
