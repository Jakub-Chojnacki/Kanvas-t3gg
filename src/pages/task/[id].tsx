import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import BasicLayout from "~/components/BasicLayout";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SingleTaskPage: NextPage<{ id: string }> = ({ id }) => {
  const { data, isLoading } = api.tasks.getById.useQuery({
    id,
  });
  if (isLoading || !data) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>{`${data?.id}`}</title>
      </Head>
      <BasicLayout>test</BasicLayout>
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

export default SingleTaskPage;
