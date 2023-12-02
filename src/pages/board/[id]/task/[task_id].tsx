import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

import BasicLayout from "~/components/BasicLayout";
import BoardSidenav from "~/components/BoardSidenav";
import TaskDetails from "~/components/TaskDetails";

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

  const boardSidenav = <BoardSidenav boardId={boardId} name={boardData.name} />;

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
