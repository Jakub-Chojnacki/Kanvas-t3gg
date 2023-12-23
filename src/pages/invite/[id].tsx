import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import { Button, Modal, Text } from "@mantine/core";

import BasicLayout from "~/components/BasicLayout";
import InvitationModal from "~/components/InvitationModal";
import { useRouter } from "next/router";

const SingleTaskPage: NextPage<{ invitationId: string }> = ({
  invitationId,
}) => {
  const { data, isLoading, error } = api.invitations.getById.useQuery({
    id: invitationId,
  });
  const { push } = useRouter();

  const handleCloseExpired = (): void => {
    push("/");
  };

  if (error) {
    return (
      <>
        <Head>
          <title>Invitation Error</title>
        </Head>
        <BasicLayout sideNav={<></>} paddingTop={0}>
          <Modal
            title="Board invitation"
            opened
            onClose={handleCloseExpired}
            centered
          >
            <Text>{error?.message}</Text>
            <Button onClick={handleCloseExpired}>
              Go back to the dashboard
            </Button>
          </Modal>
        </BasicLayout>
      </>
    );
  }
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>404</div>;

  if (data.expired) {
    return (
      <>
        <Head>
          <title>Board invitation expired</title>
        </Head>
        <BasicLayout sideNav={<></>} paddingTop={0}>
          <Modal
            title="Invitation expired"
            opened
            onClose={handleCloseExpired}
            centered
          >
            <Text>This board invitation has expired</Text>
            <Button onClick={handleCloseExpired}>
              Go back to the dashboard
            </Button>
          </Modal>
        </BasicLayout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Board invitation</title>
      </Head>
      <BasicLayout sideNav={<></>} paddingTop={0}>
        <InvitationModal opened data={data} />{" "}
      </BasicLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const invitationId = context.params?.id;

  if (typeof invitationId !== "string") throw new Error("no task id");

  await ssg.invitations.getById.prefetch({ id: invitationId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      invitationId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SingleTaskPage;
