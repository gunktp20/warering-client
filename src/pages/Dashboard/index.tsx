import { useEffect, useMemo, useState } from "react";
import { Column, Id, Task } from "./types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { BigNavbar, NavDialog, NavLinkSidebar } from "../../components";
import Wrapper from "../../assets/wrappers/Dashboard";

const defaultCols: Column[] = [
  {
    id: "col1",
    title: "Column 1",
  },
  {
    id: "col2",
    title: "Colum 2",
  },
  {
    id: "col3",
    title: "Colum 3",
  },
];

const tasksStorage = localStorage.getItem("tasks")

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "col1",
    category: "Gauge",
  },
  {
    id: "2",
    columnId: "col1",
    category: "ButtonControl",
  },
  {
    id: "3",
    columnId: "col2",
    category: "MessageBox",
  },
  {
    id: "4",
    columnId: "col2",
    category: "RangeSlider",
  },
  {
    id: "5",
    columnId: "col3",
    category: "ToggleSwitch",
  },
  {
    id: "6",
    columnId: "col3",
    content: "Dev meeting",
  },
];

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // tasksStorage ? JSON.parse(tasksStorage) : vvv
  const [tasks, setTasks] = useState<Task[]>(tasksStorage ? JSON.parse(tasksStorage) : defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAccountUserDrawerOpen, setIsAccountUserDrawerOpen] =
    useState<boolean>(false);
  const [isSidebarShow, setIsSidebarShow] = useState<boolean>(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    console.log("useEffect tasks : ", tasks);
  }, [tasks]);

  return (
    <Wrapper>
      <BigNavbar
        isAccountUserDrawerOpen={isAccountUserDrawerOpen}
        setIsAccountUserDrawerOpen={setIsAccountUserDrawerOpen}
        setIsSidebarShow={setIsSidebarShow}
        isSidebarShow={isSidebarShow}
      />
      <div className="flex h-[100%]">
        <NavLinkSidebar isSidebarShow={isSidebarShow} />
        <NavDialog
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
        />
        {/* content container */}
        <div className="m-[3rem] w-[100%]  mt-0">
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="m-auto flex gap-4 ">
              <div className="flex gap-4 w-[100%] h-[100vh]">
                <SortableContext items={columnsId}>
                {/* bg-yellow-500 */}
                  <div className="grid grid-cols-3 w-[100%] gap-2 md:grid-cols-2 sm:grid-cols-1 h-fit mt-9">
                    {columns.map((col) => (
                      <ColumnContainer
                        key={col.id}
                        column={col}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        tasks={tasks.filter((task) => task.columnId === col.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
              {/* <button
            onClick={() => {
              createNewColumn();
            }}
            className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      "
          >
            <PlusIcon />
            Add Column
          </button> */}
            </div>

            {createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter(
                      (task) => task.columnId === activeColumn.id
                    )}
                  />
                )}
                {activeTask && (
                  <TaskCard
                    task={activeTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      </div>
    </Wrapper>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  // function createNewColumn() {
  //   const columnToAdd: Column = {
  //     id: generateId(),
  //     title: `Column ${columns.length + 1}`,
  //   };

  //   setColumns([...columns, columnToAdd]);
  // }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    console.log("onDragStart ", event);
    console.log("Column and Task", event.active.data.current?.type);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    console.log("DragEndEvent", event.active.data.current?.sortable.items);
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    console.log("Over", active);
    console.log("Active", active);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    console.log("activeId", activeId);
    console.log("overId", overId);

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    console.log("isActiveAColumn", isActiveAColumn);
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  async function onDragOver(event: DragOverEvent) {
    console.log("onDragOver", event);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        localStorage.setItem("tasks", JSON.stringify(arrayMove(tasks, activeIndex, overIndex)))
        console.log(arrayMove(tasks, activeIndex, overIndex));
        return arrayMove(tasks, activeIndex, overIndex);
        
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        localStorage.setItem("tasks", JSON.stringify(arrayMove(tasks, activeIndex, activeIndex)))
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
