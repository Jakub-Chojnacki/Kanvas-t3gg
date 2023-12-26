import React from "react";

import { useRouter } from "next/router";

import { Flex, Image, Text } from "@mantine/core";

import { RouterOutputs } from "~/utils/api";

export interface IDashboardSingleProject {
  board: RouterOutputs["boards"]["getAll"][0];
}

const DashboardSingleProject: React.FC<IDashboardSingleProject> = ({
  board,
}) => {
    const {push} = useRouter()
  const { name, imageUrl, id } = board;

  const handleRedirect = async():Promise<void> =>{
    await push(`/board/${id}`)
  }
  return (
    <Flex gap={32} align="center" justify="space-between" className="cursor-pointer max-w-fit" onClick={handleRedirect}>
      {!imageUrl && <Image src={"/placeholder.jpg"} maw={100} />}
      {imageUrl && <Image src={imageUrl} maw={100} />}
      <Text weight="bold" size="xl">
        {name}
      </Text>
    </Flex>
  );
};

export default DashboardSingleProject;
