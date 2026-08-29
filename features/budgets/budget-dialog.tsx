"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BudgetForm } from "./budget-form";

export function BudgetDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><Plus size={16} />Novo orçamento</Button>} />
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Novo orçamento</DialogTitle></DialogHeader>
        <BudgetForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}