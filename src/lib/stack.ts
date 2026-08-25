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
