import { Button, HoverCard } from "@mantine/core";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

const BoardList = () => {
  const { data } = api.boards.getAll.useQuery();

  return (
    <div className="flex flex-1 flex-row gap-2">
      <HoverCard width={280} shadow="md">
        <HoverCard.Target>
          <Button>Projects</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          {data?.map((board) => {
            return <Link key={board.id} href={`/board/${board.id}`}>{board.id}</Link>;
          })}
        </HoverCard.Dropdown>
      </HoverCard>
    </div>
  );
};

export default BoardList;
