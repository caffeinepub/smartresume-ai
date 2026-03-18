import type { GeneratedResume } from "@/utils/resumeAI";
import { Mail, Phone } from "lucide-react";

interface Props {
  resume: GeneratedResume;
}

export default function ResumeModern({ resume }: Props) {
  return (
    <div className="bg-white text-gray-900 font-sans text-sm leading-relaxed min-h-[1100px] flex">
      {/* Left sidebar */}
      <div className="w-[200px] shrink-0 bg-[#1e1b4b] text-white p-6 flex flex-col gap-6">
        {/* Avatar initial */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {resume.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h1 className="text-center text-base font-bold leading-tight">
            {resume.fullName}
          </h1>
        </div>

        {/* Contact */}
        <div className="space-y-2.5">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Contact
          </h2>
          {resume.email && (
            <div className="flex items-start gap-2">
              <Mail className="w-3 h-3 mt-0.5 shrink-0 text-indigo-300" />
              <span className="text-[11px] text-white/80 break-all">
                {resume.email}
              </span>
            </div>
          )}
          {resume.phone && (
            <div className="flex items-start gap-2">
              <Phone className="w-3 h-3 mt-0.5 shrink-0 text-indigo-300" />
              <span className="text-[11px] text-white/80">{resume.phone}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {resume.skillGroups.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skillGroups.map((skill) => (
                <span
                  key={skill}
                  className="bg-white/10 text-white/90 text-[10px] px-2 py-0.5 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.educationItems.length > 0 && (
          <div className="space-y-2.5">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/50">
              Education
            </h2>
            {resume.educationItems.map((edu) => (
              <div
                key={`${edu.degree}-${edu.institution}`}
                className="space-y-0.5"
              >
                <p className="text-[11px] font-semibold text-white">
                  {edu.degree}
                </p>
                <p className="text-[10px] text-white/70">{edu.institution}</p>
                {edu.year && (
                  <p className="text-[10px] text-indigo-300">{edu.year}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 p-7 space-y-5">
        {/* Objective */}
        {resume.objectiveSummary && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1e1b4b] mb-2 pb-1 border-b-2 border-[#1e1b4b]">
              Professional Summary
            </h2>
            <p className="text-[12px] text-gray-700 leading-relaxed">
              {resume.objectiveSummary}
            </p>
          </section>
        )}

        {/* Experience */}
        {resume.experienceItems.length > 0 && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1e1b4b] mb-3 pb-1 border-b-2 border-[#1e1b4b]">
              Work Experience
            </h2>
            <div className="space-y-4">
              {resume.experienceItems.map((exp) => (
                <div
                  key={`${exp.role}-${exp.company}`}
                  className="page-break-avoid"
                >
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="text-[13px] font-bold text-gray-900">
                        {exp.role}
                      </h3>
                      {exp.company && (
                        <p className="text-[11px] text-[#4f46e5] font-semibold">
                          {exp.company}
                        </p>
                      )}
                    </div>
                    {exp.duration && (
                      <span className="text-[10px] text-gray-500 shrink-0 ml-2">
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1 mt-1.5">
                    {exp.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="text-[12px] text-gray-700 flex gap-2"
                      >
                        <span className="text-[#4f46e5] mt-1 shrink-0">▸</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projectItems.length > 0 && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#1e1b4b] mb-3 pb-1 border-b-2 border-[#1e1b4b]">
              Projects
            </h2>
            <div className="space-y-3">
              {resume.projectItems.map((project) => (
                <div key={project.name} className="page-break-avoid">
                  <h3 className="text-[12px] font-bold text-gray-900">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-[11px] text-gray-700 mt-0.5 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
