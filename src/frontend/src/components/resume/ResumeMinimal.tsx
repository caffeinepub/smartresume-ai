import type { GeneratedResume } from "@/utils/resumeAI";

interface Props {
  resume: GeneratedResume;
}

export default function ResumeMinimal({ resume }: Props) {
  return (
    <div className="bg-white text-gray-900 font-sans text-sm leading-relaxed min-h-[1100px] p-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-light tracking-tight text-gray-900 mb-2">
          {resume.fullName}
        </h1>
        <div className="flex items-center gap-5 text-[11px] text-gray-500">
          {resume.email && <span>{resume.email}</span>}
          {resume.phone && <span>{resume.phone}</span>}
        </div>
        <div className="mt-3 h-px bg-gray-200" />
      </div>

      <div className="space-y-6">
        {/* Objective */}
        {resume.objectiveSummary && (
          <section className="page-break-avoid">
            <p className="text-[12px] text-gray-600 leading-relaxed italic">
              {resume.objectiveSummary}
            </p>
          </section>
        )}

        {/* Skills */}
        {resume.skillGroups.length > 0 && (
          <section className="page-break-avoid">
            <div className="flex gap-8">
              <div className="w-28 shrink-0">
                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                  Skills
                </span>
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {resume.skillGroups.map((skill, idx) => (
                    <span key={skill} className="text-[12px] text-gray-700">
                      {skill}
                      {idx < resume.skillGroups.length - 1 && (
                        <span className="text-gray-300 ml-3">—</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Divider */}
        {resume.skillGroups.length > 0 && <div className="h-px bg-gray-100" />}

        {/* Experience */}
        {resume.experienceItems.length > 0 && (
          <section className="page-break-avoid">
            <div className="flex gap-8">
              <div className="w-28 shrink-0">
                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                  Experience
                </span>
              </div>
              <div className="flex-1 space-y-4">
                {resume.experienceItems.map((exp) => (
                  <div
                    key={`${exp.role}-${exp.company}`}
                    className="page-break-avoid"
                  >
                    <div className="flex justify-between items-baseline">
                      <span className="text-[13px] font-semibold text-gray-900">
                        {exp.role}
                      </span>
                      {exp.duration && (
                        <span className="text-[11px] text-gray-400">
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    {exp.company && (
                      <p className="text-[11px] text-gray-500 mb-1.5">
                        {exp.company}
                      </p>
                    )}
                    <ul className="space-y-1">
                      {exp.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="text-[12px] text-gray-600 flex gap-2"
                        >
                          <span className="text-gray-300 mt-1 shrink-0">–</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="h-px bg-gray-100" />

        {/* Education */}
        {resume.educationItems.length > 0 && (
          <section className="page-break-avoid">
            <div className="flex gap-8">
              <div className="w-28 shrink-0">
                <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                  Education
                </span>
              </div>
              <div className="flex-1 space-y-3">
                {resume.educationItems.map((edu) => (
                  <div
                    key={`${edu.degree}-${edu.institution}`}
                    className="flex justify-between items-baseline"
                  >
                    <div>
                      <span className="text-[13px] font-semibold text-gray-900">
                        {edu.degree}
                      </span>
                      {edu.institution && (
                        <p className="text-[11px] text-gray-500">
                          {edu.institution}
                        </p>
                      )}
                    </div>
                    {edu.year && (
                      <span className="text-[11px] text-gray-400">
                        {edu.year}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects */}
        {resume.projectItems.length > 0 && (
          <>
            <div className="h-px bg-gray-100" />
            <section className="page-break-avoid">
              <div className="flex gap-8">
                <div className="w-28 shrink-0">
                  <span className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                    Projects
                  </span>
                </div>
                <div className="flex-1 space-y-3">
                  {resume.projectItems.map((project) => (
                    <div key={project.name}>
                      <span className="text-[13px] font-semibold text-gray-900">
                        {project.name}
                      </span>
                      {project.description && (
                        <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                          {project.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
