"use client";

import {
  DndContext,
  type DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { z } from "zod";
import { KanbanColumn } from "./board-vertical";
import type { Task } from "@/lib/types";
import { TaskStatusEnum } from "@/lib/types";

type TaskStatus = z.infer<typeof TaskStatusEnum>;

const COLUMNS: { key: TaskStatus; title: string }[] = [
  { key: "Pending", title: "Pending" },
  { key: "Critical", title: "Critical" },
  { key: "Urgent", title: "Urgent" },
  { key: "Complete", title: "Complete" },
];

export function KanbanBoard({
  tasks,
  onMove,
  renderColumn,
}: {
  tasks: Task[];
  onMove: (taskId: string, status: Task["status"]) => Promise<void>;
  renderColumn: (status: Task["status"]) => React.ReactNode;
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
  );

  const groupedTasks = COLUMNS.reduce<Record<TaskStatus, Task[]>>((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  async function handleDragEnd(event: DragEndEvent) {
    const taskId = event.active.id as string;
    const overId = event.over?.id as string | undefined;
    if (!overId) return;

    const [_, newStatus] = overId.split("-"); // Droppable ID: "column-Pending"
    await onMove(taskId, newStatus as Task["status"]);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            id={`column-${col.key}`} // Important: unique droppable ID
            title={col.title}
            taskIds={groupedTasks[col.key].map((t) => t.id)}
          >
            <SortableContext items={groupedTasks[col.key].map((t) => t.id)} strategy={verticalListSortingStrategy}>
              {renderColumn(col.key)}
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>
    </DndContext>
  );
}

