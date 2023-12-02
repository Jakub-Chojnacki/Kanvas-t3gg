import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import BasicLayout from "~/components/BasicLayout";
import KanbanBoard from "~/components/KanbanBoard";
import TaskDetails from "~/components/TaskDetails";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SingleTaskPage: NextPage<{ boardId: string; taskId: string }> = ({
  boardId,
  taskId,
}) => {
  const { data, isLoading } = api.tasks.getById.useQuery({
    id: taskId,
  });

  const { data: boardData, isLoading: isBoardLoading } =
    api.boards.getById.useQuery({
      id: boardId,
    });
  if (isLoading || !data || isBoardLoading || !boardData)
    return <div>Loading...</div>;
  if (!data) return <div>404</div>;
  const boardSidenav = <div></div>;

  return (
    <>
      <Head>
        <title>{`${data?.id}`}</title>
      </Head>
      <BasicLayout sideNav={boardSidenav} paddingTop={0}>
        <TaskDetails boardId={boardId} taskId={taskId} taskData={data} />
      </BasicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const taskId = context.params?.task_id;

  const boardId = context.params?.id;

  if (typeof boardId !== "string") throw new Error("no board id");

  await ssg.boards.getById.prefetch({ id: boardId });

  if (typeof taskId !== "string") throw new Error("no task id");

  await ssg.tasks.getById.prefetch({ id: taskId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      boardId,
      taskId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SingleTaskPage;
