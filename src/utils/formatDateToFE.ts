import dayjs from "dayjs"

const formatDateToFE = (date:Date):string => {
   return dayjs(date).format("DD.MM.YYYY")
}

export default formatDateToFE