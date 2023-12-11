import { IFilteredUser } from "~/server/api/routers/tasks";

const getUserFullName = (user: IFilteredUser):string =>
  `${user.firstName} ${user.lastName}`;

export default getUserFullName;
