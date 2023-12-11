import dayjs from "dayjs";

const formatDateToLongFE = (date: Date): string => {
  return dayjs(date).format("DD.MM.YYYY HH:mm");
};

export default formatDateToLongFE;
