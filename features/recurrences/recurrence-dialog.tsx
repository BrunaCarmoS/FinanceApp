"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RecurrenceForm } from "./recurrence-form";

export function RecurrenceDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><Plus size={16} />Nova recorrência</Button>} />
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Nova recorrência</DialogTitle></DialogHeader>
        <RecurrenceForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}