import type { GeneratedResume } from "@/utils/resumeAI";

interface Props {
  resume: GeneratedResume;
}

export default function ResumeProfessional({ resume }: Props) {
  return (
    <div className="bg-white text-gray-900 font-sans text-sm leading-relaxed min-h-[1100px] p-10">
      {/* Header */}
      <div className="text-center mb-5 pb-5 border-b-2 border-gray-800">
        <h1 className="text-[22px] font-bold tracking-wide text-gray-900 uppercase mb-1">
          {resume.fullName}
        </h1>
        <div className="flex items-center justify-center gap-4 text-[11px] text-gray-600 flex-wrap">
          {resume.email && <span>{resume.email}</span>}
          {resume.email && resume.phone && (
            <span className="text-gray-400">|</span>
          )}
          {resume.phone && <span>{resume.phone}</span>}
        </div>
      </div>

      <div className="space-y-5">
        {/* Objective */}
        {resume.objectiveSummary && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-1.5">
              Professional Summary
            </h2>
            <hr className="border-gray-400 mb-3" />
            <p className="text-[12px] text-gray-700 leading-relaxed">
              {resume.objectiveSummary}
            </p>
          </section>
        )}

        {/* Experience */}
        {resume.experienceItems.length > 0 && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-1.5">
              Professional Experience
            </h2>
            <hr className="border-gray-400 mb-3" />
            <div className="space-y-4">
              {resume.experienceItems.map((exp) => (
                <div
                  key={`${exp.role}-${exp.company}`}
                  className="page-break-avoid"
                >
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-[13px] font-bold text-gray-900">
                      {exp.role}
                    </h3>
                    {exp.duration && (
                      <span className="text-[11px] text-gray-500 italic">
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  {exp.company && (
                    <p className="text-[12px] text-gray-600 italic mb-1.5">
                      {exp.company}
                    </p>
                  )}
                  <ul className="list-disc list-inside space-y-1">
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} className="text-[12px] text-gray-700">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {resume.educationItems.length > 0 && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-1.5">
              Education
            </h2>
            <hr className="border-gray-400 mb-3" />
            <div className="space-y-3">
              {resume.educationItems.map((edu) => (
                <div
                  key={`${edu.degree}-${edu.institution}`}
                  className="flex justify-between items-baseline"
                >
                  <div>
                    <h3 className="text-[13px] font-bold text-gray-900">
                      {edu.degree}
                    </h3>
                    <p className="text-[12px] text-gray-600 italic">
                      {edu.institution}
                    </p>
                  </div>
                  {edu.year && (
                    <span className="text-[11px] text-gray-500">
                      {edu.year}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {resume.skillGroups.length > 0 && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-1.5">
              Skills &amp; Competencies
            </h2>
            <hr className="border-gray-400 mb-3" />
            <p className="text-[12px] text-gray-700">
              {resume.skillGroups.join(" • ")}
            </p>
          </section>
        )}

        {/* Projects */}
        {resume.projectItems.length > 0 && (
          <section className="page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-gray-800 mb-1.5">
              Projects &amp; Achievements
            </h2>
            <hr className="border-gray-400 mb-3" />
            <div className="space-y-3">
              {resume.projectItems.map((project) => (
                <div key={project.name}>
                  <h3 className="text-[12px] font-bold text-gray-900">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-[12px] text-gray-700 mt-0.5 leading-relaxed">
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
