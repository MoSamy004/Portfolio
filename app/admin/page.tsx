"use client";

import { useState, useEffect } from "react";
import { Profile, Project, Experience, Portfolio } from "@/lib/types";

const VALID_USERNAME = process.env.NEXT_PUBLIC_USERNAME;
const VALID_PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState<Profile>({
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    avatarUrl: "",
    accentColor: "#3b82f6",
    links: {},
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [activeTab, setActiveTab] = useState<"profile" | "projects" | "experiences">("profile");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid username or password");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchPortfolio();
    }
  }, [isLoggedIn]);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data: Portfolio = await res.json();
      setProfile(data.profile);
      setProjects(data.projects);
      setExperiences(data.experiences);
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      showMessage("Profile saved successfully!");
    } catch (err) {
      showMessage("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const saveProjects = async () => {
    setSaving(true);
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projects),
      });
      showMessage("Projects saved successfully!");
    } catch (err) {
      showMessage("Failed to save projects");
    } finally {
      setSaving(false);
    }
  };

  const saveExperiences = async () => {
    setSaving(true);
    try {
      await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experiences),
      });
      showMessage("Experiences saved successfully!");
    } catch (err) {
      showMessage("Failed to save experiences");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.url;
    } catch (err) {
      console.error("Upload failed:", err);
      return null;
    }
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        id: Date.now().toString(),
        title: "New Project",
        description: "",
        link: "",
        images: [],
      },
    ]);
  };

  const removeProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        title: "New Experience",
        position: "",
        description: "",
        date: "",
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter password"
              />
            </div>
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button type="submit" className="btn-primary w-full">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/20 text-green-400 text-center">
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "btn-primary" : "btn-secondary"}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={activeTab === "projects" ? "btn-primary" : "btn-secondary"}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("experiences")}
            className={activeTab === "experiences" ? "btn-primary" : "btn-secondary"}
          >
            Experiences
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="card space-y-6">
            <h2 className="text-xl font-semibold">Edit Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="input-field"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Data Analyst"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Bio</label>
              <textarea
                value={profile.bio || ""}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="input-field min-h-[100px]"
                placeholder="Write about yourself..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Email</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="input-field"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="input-field"
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">Avatar</label>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={profile.avatarUrl || ""}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  className="input-field flex-1"
                  placeholder="Image URL or upload below"
                />
                <label className="btn-secondary cursor-pointer">
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await uploadImage(file);
                        if (url) setProfile({ ...profile, avatarUrl: url });
                      }
                    }}
                  />
                </label>
              </div>
              {profile.avatarUrl && (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar preview"
                  className="mt-2 w-24 h-24 object-cover rounded-full"
                />
              )}
            </div>

            <h3 className="text-lg font-semibold pt-4 border-t border-[var(--card-border)]">
              Social Links
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={profile.links.linkedin || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, linkedin: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">GitHub</label>
                <input
                  type="url"
                  value={profile.links.github || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, github: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Tableau</label>
                <input
                  type="url"
                  value={profile.links.tableau || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, tableau: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://public.tableau.com/..."
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted)] mb-1">Power BI</label>
                <input
                  type="url"
                  value={profile.links.powerbi || ""}
                  onChange={(e) =>
                    setProfile({ ...profile, links: { ...profile.links, powerbi: e.target.value } })
                  }
                  className="input-field"
                  placeholder="https://app.powerbi.com/..."
                />
              </div>
            </div>

            <button onClick={saveProfile} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Projects</h2>
              <button onClick={addProject} className="btn-primary">
                + Add Project
              </button>
            </div>

            {projects.map((project) => (
              <ProjectEditor
                key={project.id}
                project={project}
                onUpdate={(updates) => updateProject(project.id, updates)}
                onRemove={() => removeProject(project.id)}
                onUploadImage={uploadImage}
              />
            ))}

            {projects.length > 0 && (
              <button onClick={saveProjects} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save All Projects"}
              </button>
            )}
          </div>
        )}

        {/* Experiences Tab */}
        {activeTab === "experiences" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Manage Experiences</h2>
              <button onClick={addExperience} className="btn-primary">
                + Add Experience
              </button>
            </div>

            {experiences.map((exp) => (
              <div key={exp.id} className="card space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Experience</h3>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">Title / Company</label>
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                      className="input-field"
                      placeholder="Company or role title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[var(--muted)] mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position || ""}
                      onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Data Analyst"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Date</label>
                  <input
                    type="text"
                    value={exp.date || ""}
                    onChange={(e) => updateExperience(exp.id, { date: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Jan 2023 - Present"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--muted)] mb-1">Description</label>
                  <textarea
                    value={exp.description || ""}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    className="input-field min-h-[80px]"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}

            {experiences.length > 0 && (
              <button onClick={saveExperiences} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save All Experiences"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Project Editor Component
function ProjectEditor({
  project,
  onUpdate,
  onRemove,
  onUploadImage,
}: {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onRemove: () => void;
  onUploadImage: (file: File) => Promise<string | null>;
}) {
  const [newImageUrl, setNewImageUrl] = useState("");

  const addImageUrl = () => {
    if (newImageUrl.trim()) {
      onUpdate({ images: [...project.images, newImageUrl.trim()] });
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    onUpdate({ images: project.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium">Project</h3>
        <button onClick={onRemove} className="text-red-500 hover:text-red-400">
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Title</label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="input-field"
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="block text-sm text-[var(--muted)] mb-1">Link</label>
          <input
            type="url"
            value={project.link || ""}
            onChange={(e) => onUpdate({ link: e.target.value })}
            className="input-field"
            placeholder="https://..."
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-[var(--muted)] mb-1">
          Description (appears on hover)
        </label>
        <textarea
          value={project.description || ""}
          onChange={(e) => onUpdate({ description: e.target.value })}
          className="input-field min-h-[80px]"
          placeholder="Describe the project..."
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm text-[var(--muted)] mb-1">Images</label>

        {/* Existing images */}
        {project.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Project image ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add image by URL */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="input-field flex-1"
            placeholder="Image URL"
          />
          <button onClick={addImageUrl} className="btn-secondary">
            Add URL
          </button>
        </div>

        {/* Upload image */}
        <label className="btn-secondary cursor-pointer inline-block">
          Upload Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = await onUploadImage(file);
                if (url) {
                  onUpdate({ images: [...project.images, url] });
                }
              }
            }}
          />
        </label>
      </div>
    </div>
  );
}
