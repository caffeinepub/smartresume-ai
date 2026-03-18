export interface ResumeFormData {
  fullName: string;
  email: string;
  phone: string;
  objective: string;
  education: string;
  experience: string;
  skills: string;
  projects: string;
}

export interface GeneratedResume {
  fullName: string;
  email: string;
  phone: string;
  objectiveSummary: string;
  educationItems: EducationItem[];
  experienceItems: ExperienceItem[];
  skillGroups: string[];
  projectItems: ProjectItem[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
}

export interface ResumeScore {
  total: number;
  completeness: number;
  keywords: number;
  formatting: number;
}

export interface AISuggestion {
  type: "warning" | "tip" | "success";
  text: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function titleCase(str: string): string {
  return str
    .split(" ")
    .map((w) => capitalize(w.trim()))
    .join(" ");
}

// ─── Objective polisher ─────────────────────────────────────────────────────

function polishObjective(raw: string, name: string): string {
  const cleaned = raw.trim();
  if (!cleaned) {
    return `A motivated and results-driven professional, ${name || "seeking a challenging role"} looks to leverage strong skills and dedication to contribute meaningfully to a forward-thinking organization. Committed to continuous learning and delivering measurable impact.`;
  }
  if (cleaned.split(" ").length < 15) {
    return `${capitalize(cleaned)}. A detail-oriented and driven professional eager to apply expertise in a dynamic environment. Passionate about innovation, collaboration, and delivering high-quality outcomes that drive organizational success.`;
  }
  // Ensure it starts with a strong opener
  const starters = [
    "I am",
    "i am",
    "My name is",
    "my name is",
    "Looking for",
    "looking for",
    "seeking",
    "Seeking",
  ];
  let result = cleaned;
  for (const starter of starters) {
    if (result.startsWith(starter)) {
      result = result.replace(starter, "A dedicated professional who");
      break;
    }
  }
  // Ensure ends with period
  if (!result.endsWith(".")) result += ".";
  return result;
}

// ─── Education parser ───────────────────────────────────────────────────────

function parseEducation(raw: string): EducationItem[] {
  if (!raw.trim()) return [];
  const lines = raw.split("\n").filter((l) => l.trim());
  return lines.map((line) => {
    const parts = line.split(",").map((p) => p.trim());
    const degree = parts[0] ? titleCase(parts[0]) : "Degree";
    const institution = parts[1] ? titleCase(parts[1]) : "University";
    const year = parts[2] ? parts[2].trim() : "";
    return { degree, institution, year };
  });
}

// ─── Experience parser ──────────────────────────────────────────────────────

function parseExperience(raw: string): ExperienceItem[] {
  if (!raw.trim()) return [];
  // Split by double newline or numbered entries
  const blocks = raw.split(/\n\n+/).filter((b) => b.trim());
  if (blocks.length === 0) return [];

  return blocks.map((block) => {
    const lines = block.split("\n").filter((l) => l.trim());
    const header = lines[0] || "";

    // Parse "Role at Company, Duration"
    let role = "Professional";
    let company = "";
    let duration = "";

    const atMatch = header.match(/^(.+?)\s+at\s+(.+?)(?:,\s*(.+))?$/i);
    if (atMatch) {
      role = titleCase(atMatch[1].trim());
      company = titleCase(atMatch[2].trim());
      duration = atMatch[3]?.trim() || "";
    } else {
      const commaParts = header.split(",");
      role = titleCase(commaParts[0]?.trim() || header);
      company = titleCase(commaParts[1]?.trim() || "");
      duration = commaParts[2]?.trim() || "";
    }

    // Remaining lines become bullets
    const rawBullets = lines.slice(1).filter((l) => l.trim());
    const bullets =
      rawBullets.length > 0
        ? rawBullets.map((b) => {
            const cleaned = b.replace(/^[-•*]\s*/, "").trim();
            return capitalize(cleaned);
          })
        : generateGenericBullets(role);

    return { role, company, duration, bullets };
  });
}

function generateGenericBullets(role: string): string[] {
  const roleL = role.toLowerCase();
  if (
    roleL.includes("develop") ||
    roleL.includes("engineer") ||
    roleL.includes("software")
  ) {
    return [
      "Designed and implemented scalable features using modern technologies, improving system performance by 30%.",
      "Collaborated with cross-functional teams to deliver high-quality software on schedule.",
      "Contributed to code reviews and technical documentation to maintain code quality standards.",
    ];
  }
  if (roleL.includes("market") || roleL.includes("brand")) {
    return [
      "Developed and executed marketing campaigns that increased brand awareness by 25%.",
      "Analyzed market data to identify trends and optimize campaign performance.",
      "Managed social media channels, growing follower base by 40% in six months.",
    ];
  }
  if (
    roleL.includes("design") ||
    roleL.includes("ui") ||
    roleL.includes("ux")
  ) {
    return [
      "Created user-centered designs and prototypes that improved user engagement by 35%.",
      "Conducted user research and usability testing to validate design decisions.",
      "Collaborated with development team to ensure design-to-code fidelity.",
    ];
  }
  return [
    "Delivered consistent results by executing responsibilities with precision and professionalism.",
    "Collaborated effectively with team members to achieve shared objectives and project goals.",
    "Identified process improvement opportunities and implemented solutions that enhanced efficiency.",
  ];
}

// ─── Skills formatter ────────────────────────────────────────────────────────

function formatSkills(raw: string): string[] {
  if (!raw.trim()) return [];
  return raw
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => titleCase(s));
}

// ─── Projects parser ─────────────────────────────────────────────────────────

function parseProjects(raw: string): ProjectItem[] {
  if (!raw.trim()) return [];
  const blocks = raw.split("\n\n").filter((b) => b.trim());
  if (blocks.length === 0) {
    // Try single block with colon separator
    const lines = raw.split("\n").filter((l) => l.trim());
    return lines.map((line) => {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        return {
          name: titleCase(line.slice(0, colonIdx).trim()),
          description: capitalize(line.slice(colonIdx + 1).trim()),
        };
      }
      return { name: titleCase(line), description: "" };
    });
  }
  return blocks.map((block) => {
    const colonIdx = block.indexOf(":");
    if (colonIdx > 0) {
      return {
        name: titleCase(block.slice(0, colonIdx).trim()),
        description: capitalize(block.slice(colonIdx + 1).trim()),
      };
    }
    const lines = block.split("\n");
    return {
      name: titleCase(lines[0]?.trim() || "Project"),
      description: lines.slice(1).join(" ").trim(),
    };
  });
}

// ─── Main generation function ────────────────────────────────────────────────

export function generateResume(data: ResumeFormData): GeneratedResume {
  return {
    fullName: titleCase(data.fullName.trim()) || "Your Name",
    email: data.email.trim(),
    phone: data.phone.trim(),
    objectiveSummary: polishObjective(data.objective, data.fullName),
    educationItems: parseEducation(data.education),
    experienceItems: parseExperience(data.experience),
    skillGroups: formatSkills(data.skills),
    projectItems: parseProjects(data.projects),
  };
}

// ─── Score calculator ────────────────────────────────────────────────────────

export function calculateScore(data: ResumeFormData): ResumeScore {
  let completeness = 0;
  let keywords = 0;
  let formatting = 0;

  // Completeness scoring (max 100)
  if (data.fullName.trim()) completeness += 10;
  if (data.email.trim()) completeness += 10;
  if (data.phone.trim()) completeness += 8;
  if (data.objective.trim()) completeness += 12;
  if (data.objective.trim().split(" ").length > 20) completeness += 8;
  if (data.education.trim()) completeness += 12;
  if (data.experience.trim()) completeness += 15;
  if (data.skills.trim()) completeness += 10;
  if (data.skills.trim().split(",").length > 4) completeness += 5;
  if (data.projects.trim()) completeness += 10;
  completeness = Math.min(100, completeness);

  // Keywords scoring (max 100)
  const allText = Object.values(data).join(" ").toLowerCase();
  const powerWords = [
    "developed",
    "managed",
    "led",
    "designed",
    "implemented",
    "created",
    "optimized",
    "improved",
    "delivered",
    "achieved",
    "collaborated",
    "built",
    "analyzed",
    "launched",
    "increased",
    "reduced",
  ];
  const matchedWords = powerWords.filter((w) => allText.includes(w));
  keywords = Math.min(100, matchedWords.length * 8 + (data.skills ? 20 : 0));

  // Formatting scoring (max 100)
  if (data.education.includes(",")) formatting += 20;
  if (data.experience.includes("\n")) formatting += 25;
  if (data.projects.includes(":")) formatting += 20;
  if (data.objective.trim().split(" ").length > 15) formatting += 20;
  if (data.skills.includes(",")) formatting += 15;
  formatting = Math.min(100, formatting);

  const total = Math.round(
    completeness * 0.5 + keywords * 0.3 + formatting * 0.2,
  );

  return { total, completeness, keywords, formatting };
}

// ─── AI Suggestions generator ────────────────────────────────────────────────

export function generateSuggestions(data: ResumeFormData): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  if (!data.objective.trim() || data.objective.trim().split(" ").length < 15) {
    suggestions.push({
      type: "warning",
      text: "Expand your Career Objective to at least 2-3 sentences highlighting your key strengths and career goals.",
    });
  }

  const skillCount = data.skills.trim()
    ? data.skills.split(",").filter((s) => s.trim()).length
    : 0;
  if (skillCount < 5) {
    suggestions.push({
      type: "warning",
      text: `Add more skills — you currently have ${skillCount}. Aim for 8-12 relevant skills to improve ATS match rates.`,
    });
  }

  if (!data.experience.trim()) {
    suggestions.push({
      type: "tip",
      text: "Add work experience entries even if limited. Include internships, freelance work, or part-time positions.",
    });
  } else if (!data.experience.includes("\n")) {
    suggestions.push({
      type: "tip",
      text: "Format each experience on separate lines with bullet points for responsibilities to improve readability.",
    });
  }

  if (!data.projects.trim()) {
    suggestions.push({
      type: "tip",
      text: "Add 2-3 notable projects with brief descriptions. Projects demonstrate initiative and practical skills.",
    });
  }

  const allText = Object.values(data).join(" ").toLowerCase();
  const actionWords = [
    "improved",
    "achieved",
    "delivered",
    "increased",
    "reduced",
    "launched",
  ];
  if (!actionWords.some((w) => allText.includes(w))) {
    suggestions.push({
      type: "tip",
      text: "Use quantifiable achievements (e.g., 'increased sales by 30%') and strong action verbs for bigger impact.",
    });
  }

  if (!data.education.trim()) {
    suggestions.push({
      type: "warning",
      text: "Education section is empty. Add your highest qualification with degree, institution, and graduation year.",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      type: "success",
      text: "Great job! Your resume looks comprehensive. Consider tailoring keywords to match each specific job description.",
    });
    suggestions.push({
      type: "success",
      text: "Your resume score is strong. Download it as PDF and pair with a targeted cover letter for best results.",
    });
  }

  return suggestions.slice(0, 5);
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "smartresume_saved";

export function saveResumeToStorage(
  data: ResumeFormData,
  template: string,
): void {
  const payload = { ...data, template, savedAt: new Date().toISOString() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export function loadResumeFromStorage():
  | (ResumeFormData & { template?: string })
  | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
