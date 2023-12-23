import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

import BasicLayout from "~/components/BasicLayout";
import BoardSidenav from "~/components/BoardSidenav";
import KanbanBoard from "~/components/KanbanBoard";

import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const BoardPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.boards.getById.useQuery({
    id,
  });
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  const boardSidenav = <BoardSidenav boardId={id} name={data.name} />;

  return (
    <>
      <Head>
        <title>{`${data.name}`}</title>
      </Head>
      <BasicLayout sideNav={boardSidenav}>
        <KanbanBoard boardData={data} />
      </BasicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.boards.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default BoardPage;
