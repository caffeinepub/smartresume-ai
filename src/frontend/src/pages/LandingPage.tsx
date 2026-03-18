import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Gauge,
  Lightbulb,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Sparkles,
  Star,
  User,
  Wand2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Feature cards data ──────────────────────────────────────────────────────

const features = [
  {
    icon: Brain,
    title: "AI Generation",
    description:
      "Our AI transforms raw input into polished, professional resume copy with action verbs and impact statements.",
    color: "from-violet-500/10 to-indigo-500/10",
    iconColor: "text-violet-600",
  },
  {
    icon: FileText,
    title: "Multiple Templates",
    description:
      "Choose from Modern, Professional, or Minimal layouts — each crafted to impress ATS systems and hiring managers.",
    color: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: Download,
    title: "PDF Download",
    description:
      "Export your resume as a clean, print-ready PDF in one click. No watermarks, no subscriptions needed.",
    color: "from-teal-500/10 to-green-500/10",
    iconColor: "text-teal-600",
  },
  {
    icon: Gauge,
    title: "Resume Score",
    description:
      "Get instant feedback with a score breakdown — completeness, keywords, and formatting analyzed in real-time.",
    color: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600",
  },
  {
    icon: Lightbulb,
    title: "AI Suggestions",
    description:
      "Personalized tips to strengthen your resume: add more skills, improve your summary, quantify achievements.",
    color: "from-yellow-500/10 to-amber-500/10",
    iconColor: "text-yellow-600",
  },
  {
    icon: Save,
    title: "Save & Edit",
    description:
      "Save your resume locally and come back anytime to update it. Your data stays private on your device.",
    color: "from-pink-500/10 to-rose-500/10",
    iconColor: "text-pink-600",
  },
];

// ─── FAQ data ────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Is SmartResume AI free to use?",
    a: "Yes! SmartResume AI is completely free. Generate, preview, and download your resume as a PDF with no sign-up required and no hidden fees.",
  },
  {
    q: "How does AI generate my resume?",
    a: "Our client-side AI engine takes your raw input — job history, skills, education — and intelligently reformats it using professional templates, action verbs, and structured sections that align with modern hiring standards.",
  },
  {
    q: "Can I edit my resume after generating it?",
    a: "Absolutely. Simply update the form fields and click 'Generate Resume with AI' again. Use the Save feature to preserve your current data between sessions.",
  },
  {
    q: "Which resume templates are available?",
    a: "Three templates: Modern (sidebar layout with indigo accents), Professional (classic two-column with horizontal rules), and Minimal (ultra-clean whitespace-focused design). All are ATS-compatible.",
  },
  {
    q: "How do I download my resume as PDF?",
    a: "After generating your resume, click the 'Download PDF' button. Your browser's print dialog will open — select 'Save as PDF' as the destination for a clean, professional output.",
  },
  {
    q: "Is my resume data secure?",
    a: "Your data never leaves your browser. SmartResume AI runs entirely client-side — nothing is sent to any server. The Save feature uses your browser's localStorage exclusively.",
  },
];

// ─── Steps data ──────────────────────────────────────────────────────────────

const steps = [
  {
    num: "01",
    icon: User,
    title: "Fill Your Info",
    description:
      "Enter your name, experience, education, skills, and projects in our intuitive form.",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
  },
  {
    num: "02",
    icon: Wand2,
    title: "AI Generates Resume",
    description:
      "Our AI polishes your content, structures it professionally, and selects the best formatting.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    num: "03",
    icon: Download,
    title: "Download as PDF",
    description:
      "Preview your finished resume and export it as a clean, ATS-ready PDF instantly.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
  },
];

// ─── Testimonials ────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer, TechCorp",
    text: "SmartResume AI transformed my messy notes into a polished resume in under 2 minutes. I landed 3 interviews in a week!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Marketing Manager",
    text: "The AI suggestions were spot-on — it told me exactly what was missing and the resume score kept me motivated to improve.",
    rating: 5,
  },
  {
    name: "Arjun Patel",
    role: "Recent Graduate",
    text: "As a fresh graduate, I had no idea how to format my resume. The Modern template made me look incredibly professional.",
    rating: 5,
  },
];

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────

function FadeInSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setContactForm({ name: "", email: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative gradient-hero overflow-hidden min-h-[calc(100vh-64px)] flex items-center noise-bg">
        {/* Background orbs */}
        <div
          className="orb w-[600px] h-[600px] -top-40 -left-40 opacity-30"
          style={{ background: "oklch(0.38 0.18 275 / 0.15)" }}
        />
        <div
          className="orb w-[500px] h-[500px] top-10 right-0 opacity-20"
          style={{ background: "oklch(0.62 0.18 195 / 0.15)" }}
        />
        <div
          className="orb w-[300px] h-[300px] bottom-20 left-1/3 opacity-15"
          style={{ background: "oklch(0.45 0.2 290 / 0.15)" }}
        />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Left: copy */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-6 px-4 py-1.5 text-sm font-semibold gradient-brand text-white border-0 shadow-sm gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI-Powered Resume Builder
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.1] text-foreground mb-6"
              >
                Generate Your{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text gradient-brand">
                    Dream Resume
                  </span>
                  <span
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "oklch(0.38 0.18 275 / 0.08)" }}
                  />
                </span>{" "}
                in Seconds
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed"
              >
                Fill in your details, and our AI instantly crafts a polished,
                ATS-ready resume. No formatting headaches. No writing blocks.
                Just results.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
              >
                <Link to="/builder">
                  <Button
                    data-ocid="hero.primary_button"
                    size="lg"
                    className="gradient-brand text-white font-bold px-8 h-12 rounded-xl shadow-glow hover:opacity-90 hover:shadow-hero transition-all duration-300 gap-2 text-base"
                  >
                    <Sparkles className="w-5 h-5" />
                    Build My Resume — Free
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 rounded-xl font-semibold text-base border-border hover:bg-secondary gap-2 transition-all"
                  >
                    See How It Works
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-10 flex items-center gap-6 justify-center lg:justify-start flex-wrap"
              >
                {["100% Free", "No Sign-up", "Instant PDF", "ATS Ready"].map(
                  (badge) => (
                    <div
                      key={badge}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600" />
                      <span className="font-medium">{badge}</span>
                    </div>
                  ),
                )}
              </motion.div>
            </div>

            {/* Right: preview mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex-1 flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-sm">
                {/* Glow behind card */}
                <div className="absolute inset-0 rounded-3xl glow-indigo blur-2xl opacity-40 scale-95" />
                <div className="relative bg-white rounded-2xl shadow-hero overflow-hidden border border-border/50">
                  {/* Mock resume header */}
                  <div className="gradient-brand px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">JD</span>
                      </div>
                      <div>
                        <div className="h-3 w-28 bg-white/80 rounded mb-1.5" />
                        <div className="h-2 w-20 bg-white/50 rounded" />
                      </div>
                    </div>
                  </div>
                  {/* Mock content lines */}
                  <div className="p-5 space-y-4">
                    {[
                      { label: "Summary", lines: [0.9, 0.7] },
                      { label: "Experience", lines: [0.8, 0.65, 0.75] },
                      { label: "Skills", lines: [0.6] },
                    ].map((section) => (
                      <div key={section.label}>
                        <div className="h-2 w-16 bg-indigo-200 rounded mb-2" />
                        <div className="h-px bg-indigo-100 mb-2" />
                        <div className="space-y-1.5">
                          {section.lines.map((width) => (
                            <div
                              key={width}
                              className="h-2 bg-gray-100 rounded"
                              style={{ width: `${width * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Score badge */}
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            92
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-green-700">
                          Resume Score
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className="w-3 h-3 fill-green-400 text-green-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating labels */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-card-elevated px-3 py-2 flex items-center gap-2 border border-border/50"
                >
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-semibold text-foreground">
                    AI Generated
                  </span>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{
                    duration: 3.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card-elevated px-3 py-2 flex items-center gap-2 border border-border/50"
                >
                  <Download className="w-4 h-4 text-teal-500" />
                  <span className="text-xs font-semibold text-foreground">
                    PDF Ready
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 gradient-section-soft">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInSection className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-3 py-1 font-semibold">
              Features
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Everything You Need to Land the Job
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              SmartResume AI combines intelligent generation, professional
              templates, and real-time feedback — all in one free tool.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FadeInSection key={feature.title} delay={i * 0.08}>
                <Card className="card-hover shadow-card border-border/50 h-full cursor-default">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        className={`w-6 h-6 ${feature.iconColor}`}
                      />
                    </div>
                    <h3 className="font-display font-bold text-base text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── About the Tool ── */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text side */}
            <FadeInSection>
              <Badge
                variant="secondary"
                className="mb-4 px-3 py-1 font-semibold"
              >
                About
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-6 leading-tight">
                Built for the Modern Job Seeker
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                SmartResume AI was designed with one goal: to eliminate the
                friction between your experience and a job-winning resume.
                Traditional resume builders make you start from scratch. We
                start with what you know and make it shine.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Our AI engine doesn't just format — it rephrases, strengthens,
                and structures your content using proven patterns that get past
                ATS filters and capture recruiter attention within 6 seconds.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    stat: "3 Templates",
                    label: "Modern, Professional, Minimal",
                  },
                  { stat: "Instant", label: "AI generation in seconds" },
                  { stat: "100% Free", label: "No credit card needed" },
                  { stat: "Private", label: "Data stays on your device" },
                ].map((item) => (
                  <div key={item.stat} className="bg-secondary rounded-xl p-4">
                    <p className="font-display font-bold text-lg text-foreground mb-0.5">
                      {item.stat}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </FadeInSection>

            {/* Illustration side */}
            <FadeInSection delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl gradient-brand opacity-10 blur-3xl scale-110" />
                <div className="relative bg-white rounded-2xl shadow-hero p-8 border border-border/50">
                  {/* Builder UI mockup */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-display font-bold text-foreground">
                        Resume Builder
                      </span>
                    </div>
                    {/* Mock form fields */}
                    {[
                      "Full Name",
                      "Career Objective",
                      "Work Experience",
                      "Skills",
                    ].map((field, i) => (
                      <div key={field}>
                        <div className="h-2 w-16 bg-muted rounded mb-1.5" />
                        <div
                          className={`${i === 1 || i === 2 ? "h-16" : "h-9"} rounded-lg bg-secondary border border-border/50`}
                        />
                      </div>
                    ))}
                    {/* Mock generate button */}
                    <div className="h-11 rounded-lg gradient-brand mt-2" />
                  </div>
                </div>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 gradient-section-soft">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInSection className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 px-3 py-1 font-semibold">
              How It Works
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Three Steps to Your Perfect Resume
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              No design skills required. No writing talent needed. Just your
              story.
            </p>
          </FadeInSection>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Connector lines */}
            <div
              className="hidden md:block absolute top-12 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.38 0.18 275 / 0.3), oklch(0.62 0.18 195 / 0.3))",
              }}
            />

            {steps.map((step, i) => (
              <FadeInSection key={step.title} delay={i * 0.15}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`relative w-24 h-24 rounded-2xl ${step.bg} border-2 ${step.border} flex flex-col items-center justify-center mb-5 shadow-card`}
                  >
                    <step.icon className={`w-8 h-8 ${step.color} mb-1`} />
                    <span
                      className={`text-xs font-bold font-mono ${step.color} opacity-60`}
                    >
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>

          <FadeInSection delay={0.4} className="text-center mt-12">
            <Link to="/builder">
              <Button
                size="lg"
                className="gradient-brand text-white font-bold px-8 h-12 rounded-xl shadow-card hover:shadow-glow hover:opacity-90 transition-all gap-2"
              >
                <ArrowRight className="w-5 h-5" />
                Start Building Now
              </Button>
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInSection className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 px-3 py-1 font-semibold">
              Testimonials
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground">
              Loved by Job Seekers Worldwide
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeInSection key={t.name} delay={i * 0.1}>
                <Card className="card-hover shadow-card border-border/50 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: t.rating }, (_, j) => j).map(
                        (j) => (
                          <Star
                            key={j}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-5 italic">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">
                          {t.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 gradient-section-soft">
        <div className="container mx-auto px-4 max-w-3xl">
          <FadeInSection className="text-center mb-14">
            <Badge variant="secondary" className="mb-4 px-3 py-1 font-semibold">
              FAQ
            </Badge>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Everything you need to know about SmartResume AI.
            </p>
          </FadeInSection>

          <FadeInSection>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, faqIdx) => (
                <AccordionItem
                  key={faq.q}
                  value={`faq-${faqIdx + 1}`}
                  data-ocid={`faq.item.${faqIdx + 1}`}
                  className="bg-white rounded-xl border border-border/60 shadow-xs px-2 overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-4 text-sm font-semibold text-foreground hover:no-underline hover:text-primary text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeInSection>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <FadeInSection>
              <Badge
                variant="secondary"
                className="mb-4 px-3 py-1 font-semibold"
              >
                Contact
              </Badge>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground mb-5">
                Have Questions? We'd Love to Help.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Reach out with any feedback, feature requests, or support
                questions. We read every message.
              </p>
              <div className="space-y-4">
                {[
                  { Icon: Mail, label: "Email", value: "hello@smartresume.ai" },
                  {
                    Icon: MessageSquare,
                    label: "Response time",
                    value: "Within 24 hours",
                  },
                  { Icon: Phone, label: "Support", value: "Mon–Fri, 9am–6pm" },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <Card className="shadow-card-elevated border-border/50">
                <CardContent className="p-7">
                  <form onSubmit={handleContact} className="space-y-5">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="contact-name"
                        className="text-sm font-semibold"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="contact-name"
                        data-ocid="contact.name_input"
                        placeholder="Your name"
                        value={contactForm.name}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        required
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="contact-email"
                        className="text-sm font-semibold"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="contact-email"
                        type="email"
                        data-ocid="contact.email_input"
                        placeholder="you@example.com"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        required
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="contact-message"
                        className="text-sm font-semibold"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="contact-message"
                        data-ocid="contact.message_textarea"
                        placeholder="Tell us what's on your mind..."
                        value={contactForm.message}
                        onChange={(e) =>
                          setContactForm((p) => ({
                            ...p,
                            message: e.target.value,
                          }))
                        }
                        required
                        rows={4}
                        className="text-sm resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      data-ocid="contact.submit_button"
                      className="w-full gradient-brand text-white font-bold h-11 rounded-xl hover:opacity-90 transition-all gap-2"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 gradient-brand relative overflow-hidden">
        <div
          className="orb w-96 h-96 -top-20 -right-20 opacity-20"
          style={{ background: "oklch(0.62 0.18 195 / 0.3)" }}
        />
        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          <FadeInSection>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4">
              Your Dream Job is One Resume Away
            </h2>
            <p className="text-white/80 text-lg mb-8">
              Join thousands of job seekers who built standout resumes with
              SmartResume AI — for free.
            </p>
            <Link to="/builder">
              <Button
                size="lg"
                className="bg-white text-brand-indigo font-bold px-10 h-13 rounded-xl shadow-hero hover:bg-white/90 transition-all gap-2 text-base"
              >
                <Sparkles className="w-5 h-5" />
                Start Building for Free
              </Button>
            </Link>
          </FadeInSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
