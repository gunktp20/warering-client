import { useState } from "react";
import { Id, Task } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const data = {
    labels: [],
    datasets: [{
      label: 'Poll',
      data: [3, 24],
      backgroundColor: ['#00000045', '#208da1'],
      borderColor: ['#fff', '#fff'],
      circumference: 180,
      rotation: 270,
      borderWidth: 0,
      cutout: "85.6%",
    }]
  }

  const options = {

  }

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
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[130px] min-h-[130px] items-center flex text-left rounded-xl border-2 border-[#1966fb]  cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-2.5 h-[130px] min-h-[130px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-[#1966fb] cursor-grab relative"
      >
        <textarea
          className="
        h-[90%]
        w-full resize-none border-none rounded bg-transparent text-white focus:outline-none
        "
          value={task.content}
          autoFocus
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-white relative border-[1px] border-[#afafaf] p-2.5 h-[100px] min-h-[100px] flex rounded-xl hover:ring-2 hover:ring-inset hover:ring-[#1966fb] cursor-grab task justify-center items-center"
    > 
    <div className="absolute text-[black] top-[0%] right-1 text-[30px] pt-[0%] flex border-[#000] h-[30px] w-[30px] rounded-[100%]">
      <div className="relative top-[-1.1rem] left-0">...</div>
    </div>
    <div className="absolute text-[black] top-[1.3rem] left-2 text-[30px] pt-[0%] flex border-[#000] h-[30px] w-[30px] rounded-[100%]">
      <div className="relative top-[-1.1rem] left-0 text-[25px]">{task.id}</div>
    </div>
      <div className='w-[100px]'>
        <Doughnut data={data} options={options}>

        </Doughnut>
      </div>
      {mouseIsOver && (
        <button 
          onClick={() => {
            deleteTask(task.id);
          }}
          className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100"
        >
          TrashIcon
        </button>
      )}
    </div>
  );
}

export default TaskCard;
