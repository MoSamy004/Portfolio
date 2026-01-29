import { getPortfolio } from "@/lib/queries";
import ProjectCard from "@/components/ProjectCard";
import ExperienceCard from "@/components/ExperienceCard";
import SocialLinksBar from "@/components/SocialLinksBar";

export const dynamic = "force-dynamic";

export default async function Home() {
  const portfolio = await getPortfolio();
  const { profile, projects, experiences } = portfolio;

  return (
    <div className="min-h-screen">
      {/* Hero / Profile Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="card flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:items-start p-4 sm:p-6">
            {/* Avatar */}
            {profile.avatarUrl && (
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-[var(--accent)]">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 text-center md:text-left w-full">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-lg sm:text-xl text-[var(--accent)] mb-3 sm:mb-4">{profile.title}</p>
              {profile.bio && (
                <p className="text-sm sm:text-base text-[var(--muted)] mb-4 sm:mb-6 max-w-2xl mx-auto md:mx-0">{profile.bio}</p>
              )}
              <SocialLinksBar
                links={profile.links}
                email={profile.email}
                phone={profile.phone}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      {projects.length > 0 && (
        <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Projects</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section - Only show if experiences exist */}
      {experiences.length > 0 && (
        <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto text-center text-[var(--muted)] text-xs sm:text-sm">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
