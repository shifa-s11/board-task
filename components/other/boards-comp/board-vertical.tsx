"use client";

import type React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";

export function KanbanColumn({
  id,
  title,
  children,
  taskIds,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  taskIds: string[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
      </div>
      <Card
        ref={setNodeRef}
        className={`p-3 transition-all ${isOver ? "ring-2 ring-emerald-500" : ""}`}
      >
        <div className="grid gap-2">{children}</div>
      </Card>
    </div>
  );
}
