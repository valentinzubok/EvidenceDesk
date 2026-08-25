import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

function ModalDemo() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Case wizard">
        <p className="text-sm text-zinc-400">Step 1 — enter case ID</p>
      </Modal>
    </>
  );
}

const meta: Meta<typeof ModalDemo> = {
  title: "UI/Modal",
  component: ModalDemo,
};

export default meta;
type Story = StoryObj<typeof ModalDemo>;

export const Open: Story = {};
