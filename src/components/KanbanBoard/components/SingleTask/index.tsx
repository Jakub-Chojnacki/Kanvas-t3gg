import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Flex, Text } from "@mantine/core";
import toast from "react-hot-toast";
import { RouterOutputs, api } from "~/utils/api";
import { SORTABLE_TYPE } from "../../const";

type TaskWithUser = RouterOutputs["tasks"]["getTasksByColumn"][number];

const SingleTask = ({ task }: { task: TaskWithUser }) => {
  const { content, createdAt, id } = task;
  const ctx = api.useContext();

  const { mutate: reorderTasks } = api.tasks.reorderTasks.useMutation({
    onSuccess: async () => { },
    onError: (e) => {
      toast.error(`${JSON.parse(e.message)[0].message}`);
    },
  });
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
      type: SORTABLE_TYPE.TASK,
      task,
    },
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
        className="bg-slate-500 flex h-[100px] min-h-[100px]  cursor-grab items-center rounded-xl border-2 border-solid border-rose-500 p-2.5  text-left opacity-30
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className=" bg-slate-700 flex h-[100px] min-h-[100px]  cursor-grab items-center rounded-xl m-2 max-w-xs  border-2 border-solid border-gray-400 p-4"
      style={style}
      {...listeners}
      {...attributes}
    >
      <Text>{content}</Text>
      <Text>{`Created at ${new Intl.DateTimeFormat().format(createdAt)}`}</Text>
      {/* //TO DO: Add a date-formatting library (day.js or date-fns) */}
      <Flex gap="md" align="center">
        {/* <Text>{`Created by ${task.authorId}`}</Text> */}
        {/* <Avatar src={author?.profileImageUrl} radius="xl" /> */}
      </Flex>
    </div>
  );
};

export default SingleTask;
