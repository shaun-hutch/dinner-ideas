import { useEffect, useState } from "react"
import { getAll } from "../api/Api";
import { DinnerItem } from "../models/DinnerItem";

export const useDinnerItemList = () => {
    const [list, setList] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            getAll().then(response => {
                setList(response);
                setLoading(false);
            });
        }
    },[loading]);

    return { list, loading };
}