import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { RxDotsHorizontal } from "react-icons/rx";
import SwitchMui from "./SwitchMui"

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content?: string;
  category?: string
};


ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  task: Task;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (active: boolean) => void;
  deleteTask?: (id: Id) => void;
  updateTask?: (id: Id, content: string) => void;
}

function ToggleSwitch({
  task,
  deleteTask,
  updateTask,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
}: Props) {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isOptionOpen, setIsOptionOpen] = useState<boolean>(false);

  const data = {
    labels: [],
    datasets: [
      {
        label: "Poll",
        data: [3, 24],
        backgroundColor: ["#a0727245", "#1966fb"],
        borderColor: ["#fff", "#fff"],
        circumference: 180,
        rotation: 270,
        borderWidth: 0,
        cutout: "84%",
      },
    ],
  };

  const options = {};

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
    // disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    console.log("toggleEditMode");
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[130px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-[#1966fb] cursor-grab relative
      "
      />
    );
  }

  if (editMode) {
    console.log("editMode", editMode, task.id);
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-[#000] p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-[#1966fb] cursor-grab relative"
      >
        <textarea
          className="
        h-[90%]
        w-full resize-none border-none rounded bg-transparent text-white focus:outline-none
        "
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) {
              // toggleEditMode();
            }
          }}
          // onChange={(e) => updateTask(task.id, e.target.value)}
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
      // onClick={toggleEditMode}
      className="h-[130px] w-[100%] bg-white relative rounded-md shadow-md flex justify-center items-center hover:ring-2 hover:ring-inset hover:ring-[#1966fb] cursor-grab"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div className="absolute left-2 top-2 text-[#1d4469] text-sm">
        Message Box
      </div>

      <div
        onClick={() => {
          setIsOptionOpen(!isOptionOpen);
        }}
        className="absolute right-3 top-2 text-[18px] text-[#7a7a7a] cursor-pointer hover:bg-[#f7f7f7] hover:rounded-md "
      >
        <RxDotsHorizontal />
      </div>
      {isOptionOpen && (
        <div className="bg-white flex flex-col absolute top-6 right-2 border-[1px] z-[2] rounded-md shadow-sm">
          <button className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]">
            Edit
          </button>
          <button
            onClick={() => {
              setIsDeleteConfirmOpen(!isDeleteConfirmOpen);
            }}
            className="text-[#7a7a7a] text-sm px-8 py-2 hover:bg-[#f7f7f7]"
          >
            Delete
          </button>
        </div>
      )}
      <SwitchMui
        setIsActive={setIsActive}
        isActive={isActive}
        checked={isActive}
      />
    </div>
  );
}

export default ToggleSwitch;
