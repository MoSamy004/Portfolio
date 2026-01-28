import { Experience } from "@/lib/types";

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <div className="card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{experience.title}</h3>
        {experience.date && (
          <span className="text-sm text-[var(--muted)]">{experience.date}</span>
        )}
      </div>
      {experience.position && (
        <p className="text-[var(--accent)] font-medium mb-2">{experience.position}</p>
      )}
      {experience.description && (
        <p className="text-sm text-[var(--muted)]">{experience.description}</p>
      )}
    </div>
  );
}
