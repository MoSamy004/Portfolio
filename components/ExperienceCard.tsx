import { Experience } from "@/lib/types";

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="card p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2 mb-2">
        <h3 className="text-base sm:text-lg font-semibold">{experience.title}</h3>
        {experience.date && (
          <span className="text-xs sm:text-sm text-[var(--muted)] shrink-0">{experience.date}</span>
        )}
      </div>
      {experience.position && (
        <p className="text-sm sm:text-base text-[var(--accent)] font-medium mb-2">{experience.position}</p>
      )}
      {experience.description && (
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">{experience.description}</p>
      )}
    </div>
  );
}
