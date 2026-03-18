import { Button } from "@/components/ui/button";
import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  const isBuilder = currentPath === "/builder";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-nav border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            SmartResume <span className="text-brand-indigo">AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        {!isBuilder && (
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isBuilder ? (
            <Link to="/">
              <Button variant="ghost" className="font-medium">
                ← Back to Home
              </Button>
            </Link>
          ) : (
            <Link to="/builder">
              <Button
                data-ocid="nav.builder_link"
                className="gradient-brand text-white font-semibold px-5 shadow-card hover:shadow-card-elevated hover:opacity-90 transition-all duration-200 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Build My Resume
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md transition-colors hover:bg-secondary"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-foreground" />
          ) : (
            <Menu className="w-5 h-5 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-border shadow-nav">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1 max-w-7xl">
            {!isBuilder &&
              navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            <Link
              to="/builder"
              className="mt-2"
              onClick={() => setIsOpen(false)}
            >
              <Button
                data-ocid="nav.builder_link"
                className="w-full gradient-brand text-white font-semibold gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Build My Resume
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
