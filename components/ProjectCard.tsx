"use client";

import { useState, useEffect } from "react";
import { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (project.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % project.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [project.images.length]);

  const handleClick = () => {
    if (project.link) {
      window.open(project.link, "_blank");
    }
  };

  return (
    <div
      className="card cursor-pointer group relative overflow-hidden"
      onClick={handleClick}
    >
      {/* Image Carousel */}
      <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-[var(--card-border)]">
        {project.images.length > 0 ? (
          <>
            {project.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${project.title} ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  idx === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {/* Image indicators */}
            {project.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {project.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentIndex ? "bg-[var(--accent)]" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--muted)]">
            No Image
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2">{project.title}</h3>

      {/* Description on Hover */}
      {project.description && (
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 rounded-xl">
          <p className="text-center text-sm text-white">{project.description}</p>
        </div>
      )}
    </div>
  );
}
