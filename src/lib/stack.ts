export type StackItem = {
  id: string;
  name: string;
  role: string;
  href: string;
  tone: "teal" | "amber" | "violet" | "zinc" | "blue";
};

export const ECOSYSTEM_STACK: StackItem[] = [
  {
    id: "genlayer",
    name: "GenLayer",
    role: "Intelligent contracts",
    href: "https://docs.genlayer.com/",
    tone: "teal",
  },
  {
    id: "genlayer-js",
    name: "genlayer-js",
    role: "Studionet SDK",
    href: "https://github.com/genlayerlabs/genlayer-js",
    tone: "teal",
  },
  {
    id: "evidence-snapshot",
    name: "EvidenceSnapshot",
    role: "URL freeze primitive",
    href: "https://github.com/valentinzubok/EvidenceSnapshot",
    tone: "amber",
  },
  {
    id: "prompt-registry",
    name: "PromptRegistry",
    role: "Criteria registry",
    href: "https://github.com/valentinzubok/PromptRegistry",
    tone: "amber",
  },
  {
    id: "next",
    name: "Next.js",
    role: "App framework",
    href: "https://nextjs.org/",
    tone: "zinc",
  },
  {
    id: "typescript",
    name: "TypeScript",
    role: "Type safety",
    href: "https://www.typescriptlang.org/",
    tone: "blue",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    role: "UI styling",
    href: "https://tailwindcss.com/",
    tone: "violet",
  },
  {
    id: "metamask",
    name: "MetaMask",
    role: "Wallet",
    href: "https://metamask.io/",
    tone: "amber",
  },
];

export type PartnerItem = {
  name: string;
  href: string;
  descKey: "genlayer" | "snapshot" | "registry" | "portal";
};

export const PARTNERS: PartnerItem[] = [
  {
    name: "GenLayer",
    href: "https://genlayer.com/",
    descKey: "genlayer",
  },
  {
    name: "EvidenceSnapshot",
    href: "https://github.com/valentinzubok/EvidenceSnapshot",
    descKey: "snapshot",
  },
  {
    name: "PromptRegistry",
    href: "https://github.com/valentinzubok/PromptRegistry",
    descKey: "registry",
  },
  {
    name: "GenLayer Portal",
    href: "https://portal.genlayer.foundation/",
    descKey: "portal",
  },
];

const TONE_CLASS: Record<StackItem["tone"], string> = {
  teal: "border-teal-500/30 bg-teal-500/10 text-teal-200 hover:border-teal-400/50",
  amber: "border-amber-500/30 bg-amber-500/10 text-amber-200 hover:border-amber-400/50",
  violet: "border-violet-500/30 bg-violet-500/10 text-violet-200 hover:border-violet-400/50",
  zinc: "border-zinc-500/30 bg-zinc-500/10 text-zinc-200 hover:border-zinc-400/50",
  blue: "border-sky-500/30 bg-sky-500/10 text-sky-200 hover:border-sky-400/50",
};

export function stackToneClass(tone: StackItem["tone"]): string {
  return TONE_CLASS[tone];
}
