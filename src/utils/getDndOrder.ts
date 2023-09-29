import { Active, Over } from "@dnd-kit/core";

const getDndOrder = (active: Active, over: Over, elemName:string ) => {
    const activeOrder = active.data.current?.[elemName.toLowerCase()].order
    const overOrder = over.data.current?.[elemName.toLowerCase()].order
    return {
        activeOrder,
        overOrder
    }
};

export default getDndOrder;
