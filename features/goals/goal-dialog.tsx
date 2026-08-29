"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GoalForm } from "./goal-form";

export function GoalDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><Plus size={16} />Nova meta</Button>} />
      <DialogContent>
        <DialogHeader><DialogTitle>Nova meta</DialogTitle></DialogHeader>
        <GoalForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}