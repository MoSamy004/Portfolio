"use client";

import { useState, useEffect } from "react";
import { Project } from "@/lib/types";

export default function ProjectCard({ project }: { project: Project }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);

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

  // Toggle description on mobile tap
  const handleTouch = (e: React.TouchEvent) => {
    if (project.description) {
      e.preventDefault();
      setShowDescription(!showDescription);
    }
  };

  return (
    <div
      className="card cursor-pointer group relative overflow-hidden p-3 sm:p-4"
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      {/* Image Carousel */}
      <div className="relative w-full h-36 sm:h-44 md:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden bg-[var(--card-border)]">
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
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5">
                {project.images.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                      idx === currentIndex ? "bg-[var(--accent)]" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--muted)] text-sm">
            No Image
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 line-clamp-2">{project.title}</h3>

      {/* Description on Hover (desktop) or Touch (mobile) */}
      {project.description && (
        <div
          className={`absolute inset-0 bg-black/85 transition-opacity duration-300 flex items-center justify-center p-4 sm:p-6 rounded-xl ${
            showDescription ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <p className="text-center text-xs sm:text-sm text-white leading-relaxed">{project.description}</p>
        </div>
      )}
    </div>
  );
}
