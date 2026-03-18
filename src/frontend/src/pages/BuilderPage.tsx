import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import ResumeMinimal from "@/components/resume/ResumeMinimal";
import ResumeModern from "@/components/resume/ResumeModern";
import ResumeProfessional from "@/components/resume/ResumeProfessional";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type AISuggestion,
  type GeneratedResume,
  type ResumeFormData,
  type ResumeScore,
  calculateScore,
  generateResume,
  generateSuggestions,
  loadResumeFromStorage,
  saveResumeToStorage,
} from "@/utils/resumeAI";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Gauge,
  Lightbulb,
  Loader2,
  Save,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Template types ──────────────────────────────────────────────────────────

type TemplateType = "modern" | "professional" | "minimal";

const TEMPLATES: {
  id: TemplateType;
  label: string;
  desc: string;
  colors: string[];
}[] = [
  {
    id: "modern",
    label: "Modern",
    desc: "Sidebar layout with indigo accents",
    colors: ["#1e1b4b", "#4f46e5", "#e0e7ff"],
  },
  {
    id: "professional",
    label: "Professional",
    desc: "Classic with horizontal rules",
    colors: ["#111827", "#374151", "#f9fafb"],
  },
  {
    id: "minimal",
    label: "Minimal",
    desc: "Clean whitespace-focused",
    colors: ["#111827", "#6b7280", "#ffffff"],
  },
];

// ─── Score circle ─────────────────────────────────────────────────────────────

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const radius = 20;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          className="-rotate-90"
          aria-hidden="true"
        >
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="4"
          />
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
          style={{ color }}
        >
          {score}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── AI Suggestion item ──────────────────────────────────────────────────────

function SuggestionItem({ suggestion }: { suggestion: AISuggestion }) {
  const config = {
    warning: {
      icon: AlertCircle,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
    },
    tip: {
      icon: Lightbulb,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
    success: {
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50 border-green-200",
    },
  }[suggestion.type];

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg}`}
    >
      <config.icon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
      <p className="text-xs text-foreground/80 leading-relaxed">
        {suggestion.text}
      </p>
    </div>
  );
}

// ─── Template thumbnail ──────────────────────────────────────────────────────

function TemplateThumbnail({ template }: { template: (typeof TEMPLATES)[0] }) {
  const [c1, c2, c3] = template.colors;
  const isModern = template.id === "modern";

  return (
    <div className="w-full h-20 rounded overflow-hidden border border-border/50 flex">
      {isModern && (
        <div className="w-1/3 shrink-0" style={{ background: c1 }}>
          <div className="p-1 space-y-0.5 mt-1">
            {[60, 50, 70].map((w) => (
              <div
                key={w}
                className="h-0.5 rounded-full bg-white/30"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      )}
      <div className="flex-1 p-2 space-y-1" style={{ background: c3 }}>
        <div
          className="h-1 rounded-full"
          style={{ background: c1, width: "60%" }}
        />
        <div className="h-px" style={{ background: c2, opacity: 0.3 }} />
        {[80, 65, 75, 55].map((w) => (
          <div
            key={w}
            className="h-0.5 rounded-full"
            style={{ background: c2, width: `${w}%`, opacity: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Empty preview placeholder ───────────────────────────────────────────────

function EmptyPreview() {
  return (
    <div className="bg-white rounded-xl border border-dashed border-border min-h-[600px] flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-glow">
        <FileText className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="font-display font-bold text-foreground mb-2">
          Your Resume Preview
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          Fill in your details on the left and click "Generate Resume with AI"
          to see your professional resume here.
        </p>
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {["AI Generated", "ATS Ready", "PDF Export"].map((tag) => (
          <span
            key={tag}
            className="text-xs bg-secondary text-muted-foreground px-3 py-1 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Builder Component ──────────────────────────────────────────────────

const DEFAULT_FORM: ResumeFormData = {
  fullName: "",
  email: "",
  phone: "",
  objective: "",
  education: "",
  experience: "",
  skills: "",
  projects: "",
};

export default function BuilderPage() {
  const [form, setForm] = useState<ResumeFormData>(DEFAULT_FORM);
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [generated, setGenerated] = useState<GeneratedResume | null>(null);
  const [score, setScore] = useState<ResumeScore | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved data on mount
  useEffect(() => {
    const saved = loadResumeFromStorage();
    if (saved) {
      const { template: savedTemplate, ...formData } = saved;
      setForm(formData as ResumeFormData);
      if (savedTemplate) setTemplate(savedTemplate as TemplateType);
      setHasSaved(true);
    }
  }, []);

  const updateField =
    (field: keyof ResumeFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleGenerate = async () => {
    if (!form.fullName.trim()) {
      toast.error("Please enter your full name to continue.");
      return;
    }
    setGenerating(true);
    // Simulate AI processing delay
    await new Promise((r) => setTimeout(r, 1200));
    const result = generateResume(form);
    const scoreResult = calculateScore(form);
    const suggestionResult = generateSuggestions(form);
    setGenerated(result);
    setScore(scoreResult);
    setSuggestions(suggestionResult);
    setGenerating(false);
    toast.success("Resume generated! Check the preview on the right.");
    // Scroll to preview on mobile
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        previewRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  };

  const handleSave = () => {
    if (!form.fullName.trim()) {
      toast.error("Please enter your full name before saving.");
      return;
    }
    saveResumeToStorage(form, template);
    setHasSaved(true);
    toast.success("Resume saved! It'll be here when you return.");
  };

  const handleDownload = () => {
    if (!generated) {
      toast.error("Please generate your resume first.");
      return;
    }
    window.print();
  };

  const scoreColor = score
    ? score.total >= 75
      ? "text-green-600"
      : score.total >= 50
        ? "text-amber-600"
        : "text-red-600"
    : "";

  const scoreBg = score
    ? score.total >= 75
      ? "bg-green-50 border-green-200"
      : score.total >= 50
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200"
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Page header */}
        <div className="gradient-hero border-b border-border/50 py-8">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">
                  Resume Builder
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fill in your details, generate, and download your professional
                  resume.
                </p>
              </div>
              {hasSaved && (
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Resume data loaded from saved session
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Builder layout */}
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8">
            {/* ── Left Panel: Form ── */}
            <div className="space-y-6">
              {/* Personal Info */}
              <Card className="shadow-card border-border/50">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="full-name"
                      className="text-sm font-semibold"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="full-name"
                      data-ocid="form.name_input"
                      placeholder="e.g. Jane Doe"
                      value={form.fullName}
                      onChange={updateField("fullName")}
                      className="h-10 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-semibold">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        data-ocid="form.email_input"
                        placeholder="you@email.com"
                        value={form.email}
                        onChange={updateField("email")}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm font-semibold">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        data-ocid="form.phone_input"
                        placeholder="+1 234 567 8900"
                        value={form.phone}
                        onChange={updateField("phone")}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Career Objective */}
              <Card className="shadow-card border-border/50">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Career Objective
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Textarea
                    data-ocid="form.objective_textarea"
                    placeholder="Briefly describe your career goals, key strengths, and the type of role you're seeking. The AI will expand and polish this for you."
                    value={form.objective}
                    onChange={updateField("objective")}
                    rows={3}
                    className="text-sm resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Even a few words work — AI will craft a professional
                    summary
                  </p>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="shadow-card border-border/50">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="font-display text-base">
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Textarea
                    data-ocid="form.education_textarea"
                    placeholder={
                      "B.Tech Computer Science, MIT, 2023\nHigh School Diploma, Central School, 2019"
                    }
                    value={form.education}
                    onChange={updateField("education")}
                    rows={3}
                    className="text-sm resize-none font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Format: Degree, Institution, Year (one per line)
                  </p>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="shadow-card border-border/50">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="font-display text-base">
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Textarea
                    data-ocid="form.experience_textarea"
                    placeholder={
                      "Software Engineer at Google, 2022–2024\n- Built scalable APIs serving 5M users\n- Led team of 3 engineers\n\nIntern at Startup, Summer 2021\n- Developed React components"
                    }
                    value={form.experience}
                    onChange={updateField("experience")}
                    rows={6}
                    className="text-sm resize-none font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Format: Role at Company, Duration — then bullet points on
                    new lines (separate roles with blank line)
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="shadow-card border-border/50">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="font-display text-base">
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Input
                    data-ocid="form.skills_input"
                    placeholder="React, TypeScript, Python, SQL, Leadership, Communication"
                    value={form.skills}
                    onChange={updateField("skills")}
                    className="h-10 text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Comma-separated list of technical and soft skills
                  </p>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="shadow-card border-border/50">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="font-display text-base">
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <Textarea
                    data-ocid="form.projects_textarea"
                    placeholder={
                      "Portfolio Website: Built with React and Tailwind CSS — features dark mode, animations, and contact form.\n\nInventory Management App: Full-stack MERN application with real-time updates for small businesses."
                    }
                    value={form.projects}
                    onChange={updateField("projects")}
                    rows={4}
                    className="text-sm resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Format: Project Name: Description (one per paragraph)
                  </p>
                </CardContent>
              </Card>

              {/* Template Selector */}
              <Card className="shadow-card border-border/50">
                <CardHeader className="pb-3 pt-5 px-6">
                  <CardTitle className="font-display text-base">
                    Resume Template
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-3 gap-3">
                    {TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        data-ocid={`form.template_${t.id}`}
                        onClick={() => setTemplate(t.id)}
                        className={`rounded-xl p-3 border-2 transition-all duration-200 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          template === t.id
                            ? "border-primary bg-primary/5 shadow-card"
                            : "border-border hover:border-primary/40 hover:bg-secondary"
                        }`}
                      >
                        <TemplateThumbnail template={t} />
                        <p
                          className={`text-xs font-bold mt-2 mb-0.5 ${template === t.id ? "text-primary" : "text-foreground"}`}
                        >
                          {t.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {t.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pb-4">
                <Button
                  data-ocid="form.generate_button"
                  size="lg"
                  onClick={handleGenerate}
                  disabled={generating}
                  className="gradient-brand text-white font-bold h-12 rounded-xl shadow-card hover:shadow-glow hover:opacity-90 transition-all gap-2 text-base"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI is generating your resume...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Resume with AI
                    </>
                  )}
                </Button>
                <Button
                  data-ocid="form.save_button"
                  variant="outline"
                  size="lg"
                  onClick={handleSave}
                  className="h-11 rounded-xl font-semibold border-border hover:bg-secondary gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Save Resume
                </Button>
              </div>
            </div>

            {/* ── Right Panel: Preview ── */}
            <div ref={previewRef} className="space-y-6">
              <div className="sticky top-20">
                {/* Preview header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Resume Preview
                  </h2>
                  {generated && (
                    <Button
                      data-ocid="resume.download_button"
                      onClick={handleDownload}
                      className="gradient-teal text-white font-semibold h-9 px-4 rounded-xl shadow-card-elevated hover:opacity-90 gap-2 text-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  )}
                </div>

                {/* Resume card */}
                <AnimatePresence mode="wait">
                  {!generated ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <EmptyPreview />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="resume"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div
                        id="resume-print-area"
                        className="rounded-xl overflow-hidden shadow-card-elevated border border-border/50"
                      >
                        {template === "modern" && (
                          <ResumeModern resume={generated} />
                        )}
                        {template === "professional" && (
                          <ResumeProfessional resume={generated} />
                        )}
                        {template === "minimal" && (
                          <ResumeMinimal resume={generated} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Score Card */}
                {score && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className={`mt-5 shadow-card border ${scoreBg}`}>
                      <CardHeader className="pb-2 pt-4 px-5">
                        <CardTitle className="font-display text-sm flex items-center gap-2">
                          <Gauge className={`w-4 h-4 ${scoreColor}`} />
                          <span className={scoreColor}>
                            Resume Score: {score.total}/100
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-5 pb-4">
                        <div className="flex justify-around">
                          <ScoreCircle
                            score={score.completeness}
                            label="Completeness"
                          />
                          <ScoreCircle
                            score={score.keywords}
                            label="Keywords"
                          />
                          <ScoreCircle
                            score={score.formatting}
                            label="Formatting"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* AI Suggestions */}
                {suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Card className="mt-4 shadow-card border-border/50">
                      <CardHeader className="pb-2 pt-4 px-5">
                        <CardTitle className="font-display text-sm flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          AI Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-5 pb-4 space-y-2">
                        {suggestions.map((s) => (
                          <SuggestionItem key={s.text} suggestion={s} />
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Download button (bottom) */}
                {generated && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4"
                  >
                    <Button
                      data-ocid="resume.download_button"
                      onClick={handleDownload}
                      className="w-full gradient-teal text-white font-bold h-12 rounded-xl shadow-glow-teal hover:opacity-90 gap-2 transition-all text-base"
                    >
                      <Download className="w-5 h-5" />
                      Download as PDF
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
