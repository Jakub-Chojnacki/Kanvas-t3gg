const reorderDndArray = ({
  data,
  activeId,
  overId,
  activeOrder,
  overOrder,
}: {
  data: any[];
  activeId: string;
  overId: string;
  activeOrder: number;
  overOrder: number;
}) => {
  return data.map((elem) => {
    if (elem.id === activeId)
      return {
        ...elem,
        order: overOrder,
      };

    if (elem.id === overId)
      return {
        ...elem,
        order: activeOrder,
      };

    return elem;
  });
};

export default reorderDndArray;
