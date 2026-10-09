"use client";

import React from "react";
import { ResumeData, ResumeTemplate } from "@/lib/resume/types";
import { ShieldCheck, ExternalLink, Mail, Phone, MapPin, Globe } from "lucide-react";

interface ResumePreviewProps {
  resume: ResumeData;
  template: ResumeTemplate;
}

export function ResumePreview({ resume, template }: ResumePreviewProps) {
  const { personalInfo, education, experience, projects, skills, certifications } = resume;

  if (template === "modern") {
    return (
      <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200 min-h-[1050px] space-y-6 text-sm">
        {/* Modern Header with Indigo Accent */}
        <div className="border-b-2 border-indigo-600 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
              {personalInfo.fullName || "Your Full Name"}
            </h1>
            <p className="text-base font-semibold text-indigo-600 mt-0.5">
              {personalInfo.headline || "Professional Headline"}
            </p>
          </div>
          <div className="text-xs text-slate-600 space-y-0.5 text-left sm:text-right">
            {personalInfo.email && <div className="flex items-center gap-1 sm:justify-end"><Mail className="w-3 h-3 text-indigo-500" /> {personalInfo.email}</div>}
            {personalInfo.phone && <div className="flex items-center gap-1 sm:justify-end"><Phone className="w-3 h-3 text-indigo-500" /> {personalInfo.phone}</div>}
            {personalInfo.location && <div className="flex items-center gap-1 sm:justify-end"><MapPin className="w-3 h-3 text-indigo-500" /> {personalInfo.location}</div>}
            <div className="flex items-center gap-2 sm:justify-end pt-1">
              {personalInfo.github && <span className="text-indigo-600 font-mono text-[11px]">{personalInfo.github}</span>}
              {personalInfo.linkedin && <span className="text-indigo-600 font-mono text-[11px]">{personalInfo.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-semibold text-slate-900 text-xs">
                  <span>{exp.role} <span className="text-indigo-600 font-normal">at {exp.company}</span></span>
                  <span className="text-[11px] text-slate-500 font-mono">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Technical Projects */}
        {projects.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1">
              Key Engineering Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex justify-between items-baseline font-semibold text-slate-900 text-xs">
                  <div className="flex items-center gap-2">
                    <span>{proj.name}</span>
                    {proj.techStack.length > 0 && (
                      <span className="text-[10px] text-indigo-600 font-mono font-normal">
                        ({proj.techStack.join(" • ")})
                      </span>
                    )}
                  </div>
                  {proj.liveUrl && <span className="text-[11px] text-indigo-600 font-mono">{proj.liveUrl}</span>}
                </div>
                <p className="text-xs text-slate-600">{proj.description}</p>
                <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5 pl-1">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-2">
            Technical Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skills.languages.length > 0 && (
              <div><strong className="text-slate-900">Languages:</strong> <span className="text-slate-700">{skills.languages.join(", ")}</span></div>
            )}
            {skills.frameworks.length > 0 && (
              <div><strong className="text-slate-900">Frameworks:</strong> <span className="text-slate-700">{skills.frameworks.join(", ")}</span></div>
            )}
            {skills.toolsAndCloud.length > 0 && (
              <div><strong className="text-slate-900">Tools & Cloud:</strong> <span className="text-slate-700">{skills.toolsAndCloud.join(", ")}</span></div>
            )}
            {skills.coreConcepts.length > 0 && (
              <div><strong className="text-slate-900">Core Concepts:</strong> <span className="text-slate-700">{skills.coreConcepts.join(", ")}</span></div>
            )}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs space-y-0.5">
                <div className="font-semibold text-slate-900">{edu.institution}</div>
                <div className="text-slate-700">{edu.degree} in {edu.fieldOfStudy}</div>
                <div className="text-[11px] text-slate-500">{edu.graduationYear} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">Certifications & Badges</h2>
            {certifications.map((cert) => (
              <div key={cert.id} className="text-xs space-y-0.5 mb-1.5">
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  {cert.isProofLearnCert && <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 inline shrink-0" />}
                  <span>{cert.title}</span>
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  {cert.issuer} {cert.credentialId && `• ${cert.credentialId}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (template === "classic") {
    return (
      <div className="bg-white text-slate-900 font-serif p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200 min-h-[1050px] space-y-5 text-sm">
        {/* Classic Ivy Academic Header */}
        <div className="text-center space-y-1.5 border-b-2 border-slate-800 pb-3">
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-slate-950 font-serif">
            {personalInfo.fullName || "Your Full Name"}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-700 font-sans">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.email && <span>• {personalInfo.email}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 font-sans">
              Summary
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">{personalInfo.summary}</p>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 font-sans">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="text-xs font-sans">
                <div className="flex justify-between font-bold text-slate-950">
                  <span>{edu.institution}</span>
                  <span>{edu.graduationYear}</span>
                </div>
                <div className="flex justify-between text-slate-800 italic">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
                {edu.honors && <div className="text-[11px] text-slate-600">{edu.honors}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 font-sans">
              Professional Experience
            </h2>
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1 font-sans">
                <div className="flex justify-between font-bold text-slate-950 text-xs">
                  <span>{exp.company} — <span className="italic font-normal">{exp.role}</span></span>
                  <span>{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-800 space-y-1 pl-1">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-3 font-sans">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
              Technical Projects
            </h2>
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-950">
                  <span>{proj.name} <span className="font-normal italic text-slate-600">| {proj.techStack.join(", ")}</span></span>
                  {proj.liveUrl && <span className="font-mono text-[11px]">{proj.liveUrl}</span>}
                </div>
                <ul className="list-disc list-inside text-slate-800 space-y-0.5 pl-1">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx} className="leading-snug">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        <div className="font-sans">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="text-xs text-slate-800 space-y-1">
            <div><strong className="text-slate-950">Languages:</strong> {skills.languages.join(", ")}</div>
            <div><strong className="text-slate-950">Frameworks & Tools:</strong> {skills.frameworks.concat(skills.toolsAndCloud).join(", ")}</div>
            <div><strong className="text-slate-950">Concepts:</strong> {skills.coreConcepts.join(", ")}</div>
          </div>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="font-sans">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
              Honors & Certifications
            </h2>
            <div className="text-xs space-y-1">
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between text-slate-800">
                  <span><strong>{c.title}</strong> — {c.issuer}</span>
                  <span className="font-mono text-[11px]">{c.credentialId || c.issueDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (template === "developer") {
    return (
      <div className="bg-slate-950 text-slate-100 font-mono p-8 sm:p-10 rounded-xl shadow-xl border border-slate-800 min-h-[1050px] space-y-6 text-xs">
        {/* Developer Terminal-Inspired Header */}
        <div className="border-b border-emerald-500/40 pb-4">
          <div className="text-emerald-400 text-xs font-semibold mb-1">
            &gt; whoami --title &quot;{personalInfo.headline}&quot;
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {personalInfo.fullName || "Candidate Name"}
          </h1>
          <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 mt-2 font-mono">
            {personalInfo.email && <span className="text-emerald-300">{personalInfo.email}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.github && <span>• github:{personalInfo.github}</span>}
            {personalInfo.linkedin && <span>• linkedin:{personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="space-y-1">
            <div className="text-emerald-400 font-bold text-[11px] uppercase">&gt; cat summary.txt</div>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">{personalInfo.summary}</p>
          </div>
        )}

        {/* Skills with Badges */}
        <div className="space-y-2">
          <div className="text-emerald-400 font-bold text-[11px] uppercase">&gt; ls -la skills/</div>
          <div className="space-y-1.5 text-[11px]">
            <div>
              <span className="text-slate-400">languages: </span>
              {skills.languages.map((l) => (
                <span key={l} className="inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-300 mr-1.5 mb-1 font-mono">{l}</span>
              ))}
            </div>
            <div>
              <span className="text-slate-400">frameworks: </span>
              {skills.frameworks.map((f) => (
                <span key={f} className="inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-300 mr-1.5 mb-1 font-mono">{f}</span>
              ))}
            </div>
            <div>
              <span className="text-slate-400">tools_cloud: </span>
              {skills.toolsAndCloud.map((t) => (
                <span key={t} className="inline-block px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 mr-1.5 mb-1 font-mono">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <div className="space-y-3">
            <div className="text-emerald-400 font-bold text-[11px] uppercase">&gt; git log --experience</div>
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-1 pl-2 border-l-2 border-slate-800">
                <div className="flex justify-between text-xs text-white font-bold">
                  <span>{exp.role} @ {exp.company}</span>
                  <span className="text-slate-400 text-[11px]">{exp.startDate} - {exp.isCurrent ? "now" : exp.endDate}</span>
                </div>
                <ul className="list-disc list-inside text-slate-300 text-xs font-sans space-y-1">
                  {exp.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="space-y-3">
            <div className="text-emerald-400 font-bold text-[11px] uppercase">&gt; docker ps --projects</div>
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1 pl-2 border-l-2 border-slate-800">
                <div className="flex justify-between text-xs text-white font-bold">
                  <span>{proj.name} <span className="text-emerald-400 font-normal">[{proj.techStack.join(", ")}]</span></span>
                  {proj.liveUrl && <span className="text-sky-400 text-[11px]">{proj.liveUrl}</span>}
                </div>
                <ul className="list-disc list-inside text-slate-300 text-xs font-sans space-y-0.5">
                  {proj.bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Certifications with ProofLearn */}
        {certifications.length > 0 && (
          <div className="space-y-2">
            <div className="text-emerald-400 font-bold text-[11px] uppercase">&gt; gpg --verify credentials</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              {certifications.map((c) => (
                <div key={c.id} className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5 text-white">
                    {c.isProofLearnCert && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <span>{c.title}</span>
                  </div>
                  <div className="text-slate-400">{c.issuer}</div>
                  {c.credentialId && <div className="text-emerald-300 font-mono text-[10px]">{c.credentialId}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Minimalist Tech (FAANG Recruiter Favorite)
  return (
    <div className="bg-white text-slate-900 font-sans p-8 sm:p-10 rounded-xl shadow-lg border border-slate-200 min-h-[1050px] space-y-5 text-xs">
      {/* Centered Minimal Header */}
      <div className="text-center space-y-1 border-b border-slate-300 pb-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight uppercase">
          {personalInfo.fullName || "Your Full Name"}
        </h1>
        {personalInfo.headline && (
          <p className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
            {personalInfo.headline}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-slate-600 text-[11px] pt-1">
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.email && <span>• {personalInfo.email}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.github && <span>• {personalInfo.github}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-relaxed text-[11px] sm:text-xs">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Work Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-slate-950 text-xs">
                <span>{exp.role} — <span className="font-semibold text-slate-800">{exp.company}</span></span>
                <span className="text-[11px] font-normal text-slate-600">{exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate} | {exp.location}</span>
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-1 pl-1 text-[11px] sm:text-xs">
                {exp.bullets.map((b, idx) => (
                  <li key={idx} className="leading-snug">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Technical Projects */}
      {projects.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Key Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-slate-950 text-xs">
                <div className="flex items-center gap-1.5">
                  <span>{proj.name}</span>
                  {proj.techStack.length > 0 && (
                    <span className="font-normal text-slate-600 text-[11px]">| {proj.techStack.join(", ")}</span>
                  )}
                </div>
                {proj.liveUrl && <span className="text-[11px] font-normal text-slate-600">{proj.liveUrl}</span>}
              </div>
              <ul className="list-disc list-inside text-slate-700 space-y-0.5 pl-1 text-[11px] sm:text-xs">
                {proj.bullets.map((b, idx) => (
                  <li key={idx} className="leading-snug">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      <div className="space-y-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
          Technical Skills
        </h2>
        <div className="text-[11px] sm:text-xs text-slate-800 space-y-1">
          {skills.languages.length > 0 && (
            <div><strong className="text-slate-950">Languages:</strong> {skills.languages.join(", ")}</div>
          )}
          {skills.frameworks.length > 0 && (
            <div><strong className="text-slate-950">Frameworks & Libraries:</strong> {skills.frameworks.join(", ")}</div>
          )}
          {skills.toolsAndCloud.length > 0 && (
            <div><strong className="text-slate-950">Tools & Cloud Infrastructure:</strong> {skills.toolsAndCloud.join(", ")}</div>
          )}
          {skills.coreConcepts.length > 0 && (
            <div><strong className="text-slate-950">Core Competencies:</strong> {skills.coreConcepts.join(", ")}</div>
          )}
        </div>
      </div>

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} className="text-[11px] sm:text-xs">
              <div className="flex justify-between font-bold text-slate-950">
                <span>{edu.institution}</span>
                <span className="font-normal text-slate-600">{edu.graduationYear}</span>
              </div>
              <div className="text-slate-700">
                {edu.degree} in {edu.fieldOfStudy} {edu.gpa && `| GPA: ${edu.gpa}`}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Badges */}
      {certifications.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Certifications & Verified Credentials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] sm:text-xs">
            {certifications.map((c) => (
              <div key={c.id} className="space-y-0.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  {c.isProofLearnCert && <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0 inline" />}
                  <span>{c.title}</span>
                </div>
                <div className="text-slate-600 text-[11px]">
                  {c.issuer} {c.credentialId && `• ID: ${c.credentialId}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
