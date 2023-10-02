import { Center, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

const BoardList = () => {
  const { data } = api.boards.getAll.useQuery();

  return (
    <div>
      <Menu>
        <Menu.Target>
          <Center className="cursor-pointer">
            <span>Projects</span>
            <IconChevronDown size="0.9rem" stroke={1.5} />
          </Center>
        </Menu.Target>
        <Menu.Dropdown>
          {data?.map((board) => {
            return (
              <Link className="no-underline" href={`/board/${board.id}`}>
                <Menu.Item  key={board.id}>{board.name}</Menu.Item>
              </Link>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default BoardList;
