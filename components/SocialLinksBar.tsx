import { SocialLinks } from "@/lib/types";

const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const TableauIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.654 0v2.321H9.692V4.73h1.962v2.321h2.346V4.73h1.962V2.321h-1.962V0h-2.346zm-3.923 4.615v2.77H5.154V10H7.73v2.77h2.77V10h2.577V7.385H10.5V4.615H7.731zm8.077 0v2.77h-2.577V10h2.577v2.77h2.77V10h2.577V7.385h-2.577V4.615h-2.77zM4.038 9.231v2.769H1.462v2.615h2.576v2.77h2.77v-2.77h2.577V12h-2.577V9.231h-2.77zm15.924 0v2.769h-2.577v2.615h2.577v2.77h2.77v-2.77H24.31V12h-2.577V9.231h-2.77zm-7.962 4.615v2.77H9.423v2.615h2.577v2.769h2.77v-2.769h2.577v-2.615h-2.577v-2.77h-2.77z"/>
  </svg>
);

const PowerBIIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 12V4c0-1.1.9-2 2-2s2 .9 2 2v8c0 1.1-.9 2-2 2s-2-.9-2-2zm5 8V8c0-1.1.9-2 2-2s2 .9 2 2v12c0 1.1-.9 2-2 2s-2-.9-2-2zm-10 0v-6c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2s-2-.9-2-2z"/>
  </svg>
);

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

type Props = {
  links: SocialLinks;
  email?: string;
  phone?: string;
};

export default function SocialLinksBar({ links, email, phone }: Props) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center justify-center md:justify-start">
      {/* Contact info - stacked on mobile */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center w-full sm:w-auto">
        {email && (
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <EmailIcon />
            <span className="text-xs sm:text-sm break-all">{email}</span>
          </a>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <PhoneIcon />
            <span className="text-xs sm:text-sm">{phone}</span>
          </a>
        )}
      </div>

      {/* Social icons - horizontal row */}
      <div className="flex gap-3 sm:gap-4 items-center">
        {links.linkedin && (
          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            title="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        )}
        {links.github && (
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            title="GitHub"
          >
            <GitHubIcon />
          </a>
        )}
        {links.tableau && (
          <a
            href={links.tableau}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            title="Tableau"
          >
            <TableauIcon />
          </a>
        )}
        {links.powerbi && (
          <a
            href={links.powerbi}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            title="Power BI"
          >
            <PowerBIIcon />
          </a>
        )}
      </div>
    </div>
  );
}
