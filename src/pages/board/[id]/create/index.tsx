import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

import BasicLayout from "~/components/BasicLayout";
import KanbanBoard from "~/components/KanbanBoard";
import CreateTaskModal from "~/components/CreateTaskModal";

import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const CreateTaskPage: NextPage<{ boardId: string }> = ({ boardId }) => {
  const { data, isLoading } = api.boards.getById.useQuery({
    id:boardId,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;
  const boardSidenav = <div></div>;

  return (
    <>
      <Head>
        <title>{`${data.name}`}</title>
      </Head>
      <BasicLayout sideNav={boardSidenav}>
        <KanbanBoard boardData={data} />
        <CreateTaskModal boardId={boardId} />
      </BasicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const boardId = context.params?.id;

  if (typeof boardId !== "string") throw new Error("no id");

  await ssg.boards.getById.prefetch({ id:boardId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      boardId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default CreateTaskPage;
