import { Avatar, Text } from "@mantine/core";
import React from "react";
import { IFilteredUser } from "~/server/api/routers/tasks";

export interface IUserAvatarWithNameProps {
  user: IFilteredUser;
  pointer?: boolean;
}

const UserAvatarWithName: React.FC<IUserAvatarWithNameProps> = ({ user, pointer=false }) => {
  const { profileImageUrl, firstName, lastName } = user;
  return (
    <span className={`flex gap-2 ${pointer && 'cursor-pointer'}`}>
      <Avatar src={profileImageUrl} radius="xl" size="sm" />{" "}
      <Text>{`${firstName} ${lastName}`}</Text>
    </span>
  );
};

export default UserAvatarWithName;
