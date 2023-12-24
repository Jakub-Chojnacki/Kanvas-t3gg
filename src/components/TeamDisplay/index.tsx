import React from "react";
import { RouterOutputs } from "~/utils/api";
import SingleTeamMember from "../SingleTeamMember";
import { Flex, Text } from "@mantine/core";

export interface ITeamDisplay {
  boardMembers: RouterOutputs["boards"]["getBoardMembers"];
  boardId:string;
}

const TeamDisplay: React.FC<ITeamDisplay> = ({ boardMembers,boardId }) => {
   
  return (
    <Flex direction="column" className="">
      <Text weight="bold" className="text-3xl my-4 text-logoPurple-100">Your team</Text>
      <Flex direction="column" gap={16}>
        {boardMembers.map((member, index) => (
          <SingleTeamMember member={member} index={index} boardId={boardId}/>
        ))}
      </Flex>
    </Flex>
  );
};

export default TeamDisplay;
