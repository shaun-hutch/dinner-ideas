import { getAll, update } from "api/Api";
import { DinnerItem } from "models/DinnerItem";
import React, { Dispatch, useEffect, useState } from "react";

interface DinnerContext
{
    dinnerItemList: DinnerItem[];
    getDinnerItem?: (id: string) => DinnerItem | undefined;
    updateDinnerItem?: (item: DinnerItem) => void;
    setDinnerItemList?: Dispatch<React.SetStateAction<DinnerItem[]>>;
    loading: boolean;
}

export const useDiinnerItemListContext = () => {
    const [dinnerItemList, setDinnerItemList] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const getDinnerItem = (id: string) => dinnerItemList.find(x => x.id === id);
    const updateDinnerItem = (item: DinnerItem) => {
        const index = dinnerItemList.findIndex(x => x.id === item.id);
        if (index !== -1) {
            dinnerItemList[index] = item;
        }
    };

    useEffect(() => {
        const getData = async () => {
            const data = await getAll();
            setDinnerItemList(populateStepIds(data));
            setLoading(false);
        }

        if (loading) {
            getData();
        }
    }, [loading]);

    return {
        dinnerItemList,
        getDinnerItem,
        updateDinnerItem,
        setDinnerItemList,
        loading
    }
};

const populateStepIds = (items: DinnerItem[]): DinnerItem[] => 
    items.map(x => {
        x.steps.map(y => {
        y.id = crypto.randomUUID();
        return y;
    });
    return x;
});

export const DinnerItemContext = React.createContext<DinnerContext>({ dinnerItemList: [], loading: false });