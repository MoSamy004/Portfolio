export type SocialLinks = {
  linkedin?: string;
  github?: string;
  tableau?: string;
  powerbi?: string;
};

export type Profile = {
  name: string;
  title: string;
  bio?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  accentColor?: string;
  links: SocialLinks;
};

export type Project = {
  id: string;
  title: string;
  description?: string;
  link?: string;
  images: string[];
};

export type Experience = {
  id: string;
  title: string;
  position?: string;
  description?: string;
  date?: string;
};

export type Portfolio = {
  profile: Profile;
  projects: Project[];
  experiences: Experience[];
};
