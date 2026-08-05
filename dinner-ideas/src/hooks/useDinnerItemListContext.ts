import { getAll, update } from "api/Api";
import { DinnerItem, DinnerItemStep } from "models/DinnerItem";
import React, { Dispatch, useEffect, useState } from "react";

interface DinnerContext
{
    dinnerItemList: DinnerItem[];
    getDinnerItem?: (id: string) => DinnerItem | undefined;
    updateDinnerItem?: (item: DinnerItem) => void;
    addDinnerItem?: (item: DinnerItem) => void;
    setDinnerItemList?: Dispatch<React.SetStateAction<DinnerItem[]>>;
    loading: boolean;
}

export const useDiinnerItemListContext = () => {
    const [dinnerItemList, setDinnerItemList] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const getDinnerItem = (id: string) => dinnerItemList.find(x => x.id === id);
    const updateDinnerItem = (item: DinnerItem) => {
        setDinnerItemList(prev => {
            const index = prev.findIndex(x => x.id === item.id);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = item;
                return updated;
            }
            return prev;
        });
    };
    const addDinnerItem = (item: DinnerItem) => {
        setDinnerItemList(prev => [...prev, item]);
    }

    useEffect(() => {
        const getData = async () => {
            const data = await getAll();
            // Filter out junk items with no name
            setDinnerItemList(data.filter(item => item.name && item.name !== "None"));
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
        addDinnerItem,
        loading
    }
};

export const DinnerItemContext = React.createContext<DinnerContext>({ dinnerItemList: [], loading: false });