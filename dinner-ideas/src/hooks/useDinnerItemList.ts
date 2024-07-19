import { useEffect, useState } from "react"
import { getAll } from "../api/Api";
import { DinnerItem } from "../models/DinnerItem";

export const useDinnerItemList = () => {
    const [list, setList] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            const data = await getAll();
            setList(data);
            setLoading(false);
        }

        if (loading) {
            setTimeout(() => {
                getData();
            }, 5000);
        }
    }, [loading]);

    return { list, loading };
}