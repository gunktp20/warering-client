import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "./types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}
import { ButtonControl, Gauge, MessageBox, ToggleSwitch } from "../../components/widgets";
import RangeSlider from "../../components/widgets/RangeSlider";

function ColumnContainer({
  column,
  updateColumn,
  createTask,
  tasks,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] =
    useState<boolean>(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

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
      bg-columnBackgroundColor
      opacity-40
      border-[30px]
     
      w-[500px]
      h-[100vh]
      rounded-md
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="
  w-[100%]
  h-[100%]
  rounded-md
  flex
  flex-col
  "
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        // border-2
        className="
      text-md
      h-[60px]
      cursor-grab
      rounded-md
      rounded-b-none
      p-3
      font-bold
      
      flex
      items-center
      justify-between
      text-black
      "
      >
        <div className="flex gap-2">
          <div
            className="
        flex
        justify-center
        items-center
        px-2
        py-1
        text-sm
        rounded-full
        text-white
        "
          >
            0
          </div>
          {/* {!editMode && column.id} */}
          {editMode && (
            <input
              className=" focus:border-[#1966fb] border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        {/* <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
        stroke-gray-500
        hover:stroke-white
        hover:bg-columnBackgroundColor
        rounded
        px-1
        py-2
        "
        >
          TrashIcon
        </button> */}
      </div>

      {/* Column task container */}
      <div className="flex grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto ">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => {
            if (task?.category === "Gauge") {
              return (
                <Gauge
                  key={task.id}
                  task={task}
                  isDeleteConfirmOpen={isDeleteConfirmOpen}
                  setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
                />
              );
            }
            if (task?.category === "ButtonControl") {
              return (
                <ButtonControl
                  key={task.id}
                  task={task}
                  isDeleteConfirmOpen={isDeleteConfirmOpen}
                  setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
                />
              );
            }
            if (task?.category === "MessageBox") {
              return (
                <MessageBox
                  key={task.id}
                  task={task}
                  isDeleteConfirmOpen={isDeleteConfirmOpen}
                  setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
                />
              );
            }
            if (task?.category === "RangeSlider") {
              return (
                <RangeSlider
                  key={task.id}
                  task={task}
                  isDeleteConfirmOpen={isDeleteConfirmOpen}
                  setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
                />
              );
            }
            if (task?.category === "ToggleSwitch") {
              return (
                <ToggleSwitch
                  key={task.id}
                  task={task}
                  isDeleteConfirmOpen={isDeleteConfirmOpen}
                  setIsDeleteConfirmOpen={setIsDeleteConfirmOpen}
                />
              );
            }
          })}
        </SortableContext>
      </div>
      {/* Column footer */}
      <button
        className="hidden gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-[#1966fb] active:bg-black"
        onClick={() => {
          createTask(column.id);
        }}
      >
        {/* + Add task */}
      </button>
    </div>
  );
}

export default ColumnContainer;
