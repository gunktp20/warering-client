import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  task: {
    id: string;
  };
}

function TaskCard({ task }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  useEffect(() => {
    console.log("task", task);
  }, [task]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-100
      bg-mainBackgroundColor p-2.5 h-[130px] min-h-[130px] items-center flex text-left rounded-xl border-2 border-[#1d4469] relative
      "
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="opacity-30
      bg-mainBackgroundColor p-2.5 h-[130px] min-h-[130px] items-center flex text-left rounded-xl border-2 border-[#1966fb] relative"
    ></div>
  );
}

export default TaskCard;
