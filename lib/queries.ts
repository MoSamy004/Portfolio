import { getDb } from "./db";
import { Profile, Project, Experience, Portfolio } from "./types";

// Define the document type for our portfolio collection
interface PortfolioDoc {
  _id: string;
  profile?: Profile;
  projects?: Project[];
  experiences?: Experience[];
}

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
  const col = db.collection<PortfolioDoc>("portfolio");
  const doc = await col.findOne({ _id: "main" });
  if (!doc) {
    return {
      profile: DEFAULT_PROFILE,
      projects: [],
      experiences: [],
    };
  }
  return {
    profile: doc.profile ?? DEFAULT_PROFILE,
    projects: doc.projects ?? [],
    experiences: doc.experiences ?? [],
  };
}

export async function updateProfile(profile: Profile): Promise<void> {
  const db = await getDb();
  const col = db.collection<PortfolioDoc>("portfolio");
  await col.updateOne(
    { _id: "main" },
    { $set: { profile } },
    { upsert: true }
  );
}

export async function updateProjects(projects: Project[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<PortfolioDoc>("portfolio");
  await col.updateOne(
    { _id: "main" },
    { $set: { projects } },
    { upsert: true }
  );
}

export async function updateExperiences(experiences: Experience[]): Promise<void> {
  const db = await getDb();
  const col = db.collection<PortfolioDoc>("portfolio");
  await col.updateOne(
    { _id: "main" },
    { $set: { experiences } },
    { upsert: true }
  );
}
