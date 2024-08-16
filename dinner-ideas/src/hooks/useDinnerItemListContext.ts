import { getAll } from "api/Api";
import { DinnerItem } from "models/DinnerItem";
import React, { Dispatch, useEffect, useState } from "react";

interface DinnerContext
{
    dinnerItemList: DinnerItem[];
    getDinnerItem: (id: string) => void;
    setDinnerItemList: Dispatch<React.SetStateAction<DinnerItem[]>>;
    loading: boolean;
}

export const useDiinnerItemListContext = () => {
    const [dinnerItemList, setDinnerItemList] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const getDinnerItem = (id: string) => dinnerItemList.find(x => x.id === id);

    useEffect(() => {
        const getData = async () => {
            const data = await getAll();
            setDinnerItemList(data);
            setLoading(false);
        }

        if (loading) {
            setTimeout(() => {
                getData();
            });
        }
    }, [loading]);

    return {
        dinnerItemList,
        getDinnerItem,
        setDinnerItemList,
        loading
    }
};

export const DinnerItemContext = React.createContext<DinnerContext>({ dinnerItemList: [], getDinnerItem: () => {}, setDinnerItemList: () => {}, loading: false });