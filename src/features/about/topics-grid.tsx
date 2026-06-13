import React from "react";
import { Terminal, Coffee, BookOpen, LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Topic {
  title: string;
  description: string;
  icon: LucideIcon;
}

const TOPICS: Topic[] = [
  {
    title: "Code & Tech",
    description: "Practical guides, deep-dives into modern web technologies, and software architecture.",
    icon: Terminal,
  },
  {
    title: "Dev Life",
    description:
      "Career insights, lessons learned from side projects, personal productivity habits, and developer culture.",
    icon: Coffee,
  },
  {
    title: "Rambles & Guides",
    description: "Tech commentary, walkthroughs of projects under development, and random learnings.",
    icon: BookOpen,
  },
];

export function TopicsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {TOPICS.map((topic, index) => {
        const Icon = topic.icon;
        return (
          <Card key={index} className="border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                <Icon className="size-5" />
              </div>
              <CardTitle className="text-lg font-bold">{topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{topic.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
