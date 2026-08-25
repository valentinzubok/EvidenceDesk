import type { Meta, StoryObj } from "@storybook/react";
import { Tooltip } from "./Tooltip";
import { Button } from "./Button";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const CrossCheck: Story = {
  args: {
    label: "Re-fetch live URLs and submit cross_check on Studionet",
    children: <Button variant="icon">cross_check</Button>,
  },
};
