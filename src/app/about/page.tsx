import React from "react";
import Image from "next/image";
import { Link } from "@/components/ui/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { TopicsGrid } from "@/features/about/topics-grid";

export const metadata = {
  title: "About | Blogspot",
  description:
    "Learn more about the programmer behind Blogspot, the topics covered, and how to get in touch.",
};

export default async function Page() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16">
        <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0 rounded-full overflow-hidden border-4 border-secondary/20 shadow-xl bg-card">
          <Image
            src="/programmer_avatar.png"
            alt="Programmer Avatar"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex-1 text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary font-semibold text-xs rounded-full mb-3 uppercase tracking-wider">
            About the Author
          </span>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
            Hi, I&apos;m a Programmer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Welcome to my blog. I write about software engineering, developer lifestyle, productivity tools,
            and random ramblings on things I build.
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center md:text-left text-foreground">
          What You&apos;ll Find Here
        </h2>
        <TopicsGrid />
      </div>

      <div className="prose prose-stone dark:prose-invert max-w-none mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">My Philosophy</h2>
        <div className="space-y-6 text-muted-foreground text-base leading-relaxed">
          <p>
            This blog serves as my notebook and playground. Writing helps me process new information,
            structure my thoughts, and document my learning path. I hope the guides, ideas, and rambles shared
            here inspire you or save you a few hours of debugging.
          </p>
          <p>
            Take a look around at the posts, and if you find something that resonates or have a question, feel
            free to reach out using the channels below!
          </p>
        </div>
      </div>

      <div className="p-8 md:p-10 bg-secondary/5 border border-secondary/10 rounded-2xl flex flex-col items-center text-center gap-6">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">Let&apos;s Connect</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Have a project in mind, feedback on a post, or just want to talk shop? Drop a line on any of these
            platforms!
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="https://github.com"
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/10 hover:text-secondary-foreground transition-all duration-200"
          >
            <Github className="size-4" />
            <span>GitHub</span>
          </Link>
          <Link
            href="https://twitter.com"
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/10 hover:text-secondary-foreground transition-all duration-200"
          >
            <Twitter className="size-4" />
            <span>Twitter</span>
          </Link>
          <Link
            href="https://linkedin.com"
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 hover:bg-secondary/10 hover:text-secondary-foreground transition-all duration-200"
          >
            <Linkedin className="size-4" />
            <span>LinkedIn</span>
          </Link>
          <Link
            href="mailto:hello@example.com"
            variant="secondary"
            className="flex items-center gap-2 px-4 py-2 hover:opacity-90 transition-all duration-200"
          >
            <Mail className="size-4" />
            <span>Email Me</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
