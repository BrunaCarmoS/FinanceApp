"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AccountForm } from "./account-form";

export function AccountDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="gap-2"><Plus size={16} />Nova conta</Button>} />
      <DialogContent>
        <DialogHeader><DialogTitle>Nova conta</DialogTitle></DialogHeader>
        <AccountForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}