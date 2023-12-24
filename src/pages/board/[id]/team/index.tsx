import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

import BasicLayout from "~/components/BasicLayout";
import BoardSidenav from "~/components/BoardSidenav";
import TeamDisplay from "~/components/TeamDisplay";

import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const BoardTeamPage: NextPage<{ boardId: string }> = ({ boardId }) => {
  const { data, isLoading } = api.boards.getById.useQuery({
    id: boardId,
  });

  const { data:boardMembers, isLoading:isLoadingBoardMembers } = api.boards.getBoardMembers.useQuery({
    id: boardId,
    showCurrentUserFirst:true,
  });
  if (isLoading || isLoadingBoardMembers) return <div>Loading...</div>;
  if (!data || !boardMembers) return <div>404</div>;
  const boardSidenav = <BoardSidenav boardId={boardId} name={data.name} />;

  return (
    <>
      <Head>
        <title>{`${data.name}`}</title>
      </Head>
      <BasicLayout sideNav={boardSidenav}>
        <TeamDisplay boardMembers={boardMembers} boardId={boardId} />
      </BasicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const boardId = context.params?.id;

  if (typeof boardId !== "string") throw new Error("no id");

  await ssg.boards.getById.prefetch({ id: boardId });
  await ssg.boards.getBoardMembers.prefetch({ id: boardId });

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

export default BoardTeamPage;
