import { getDb } from "./db";
import { Profile, Project, Experience, Portfolio } from "./types";

const DEFAULT_PROFILE: Profile = {
  name: "Mohamed Samy",
  title: "Data Analyst",
  bio: "",
  email: "",
  phone: "",
  avatarUrl: "",
  accentColor: "#3b82f6",
  links: {},
};

export async function getPortfolio(): Promise<Portfolio> {
  const db = await getDb();
  const col = db.collection("portfolio");
  const doc = await col.findOne({ _id: "main" });
  if (!doc) {
    return {
      profile: DEFAULT_PROFILE,
      projects: [],
      experiences: [],
    };
  }
  return {
    profile: (doc.profile as Profile) ?? DEFAULT_PROFILE,
    projects: (doc.projects as Project[]) ?? [],
    experiences: (doc.experiences as Experience[]) ?? [],
  };
}

export async function updateProfile(profile: Profile): Promise<void> {
  const db = await getDb();
  const col = db.collection("portfolio");
  await col.updateOne(
    { _id: "main" as any },
    { $set: { profile } },
    { upsert: true }
  );
}

export async function updateProjects(projects: Project[]): Promise<void> {
  const db = await getDb();
  const col = db.collection("portfolio");
  await col.updateOne(
    { _id: "main" as any },
    { $set: { projects } },
    { upsert: true }
  );
}

export async function updateExperiences(experiences: Experience[]): Promise<void> {
  const db = await getDb();
  const col = db.collection("portfolio");
  await col.updateOne(
    { _id: "main" as any },
    { $set: { experiences } },
    { upsert: true }
  );
}
