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
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="card flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            {profile.avatarUrl && (
              <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-[var(--accent)]">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-xl text-[var(--accent)] mb-4">{profile.title}</p>
              {profile.bio && (
                <p className="text-[var(--muted)] mb-6 max-w-2xl">{profile.bio}</p>
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
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section - Only show if experiences exist */}
      {experiences.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto text-center text-[var(--muted)] text-sm">
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
