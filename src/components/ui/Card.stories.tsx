import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { children: <p className="text-zinc-300">Glass card content</p> },
};

export const Interactive: Story = {
  args: {
    interactive: true,
    children: <p className="text-zinc-300">Hover me</p>,
  },
};
