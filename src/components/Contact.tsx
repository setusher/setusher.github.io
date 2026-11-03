import { site } from "@/lib/content";
import { ContactForm } from "./ContactForm";
import { GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { Section } from "./Section";

export function Contact() {
  const links = [
    { href: `mailto:${site.email}`, label: site.email, Icon: MailIcon },
    { href: site.github, label: "github.com/setusher", Icon: GitHubIcon },
    ...(site.linkedin ? [{ href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon }] : []),
  ];
  return (
    <Section id="contact" index="05" label="contact" title="Let's build something.">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-24">
        <div data-reveal>
          <p className="max-w-[420px] text-[15px] leading-[1.8] text-[#b4b4b4]">
            Have a project, an internship or an idea for an AI product? Send me a message.
          </p>
          <ul className="mt-8 space-y-4">
            {links.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex items-center gap-3 text-[14px] text-white transition-colors hover:text-mint"
                >
                  <Icon className="h-4 w-4 text-muted" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
