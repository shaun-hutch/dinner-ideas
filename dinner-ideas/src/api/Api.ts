import { ApiEndpoint } from "../models/Constants";
import { DinnerItem } from "../models/DinnerItem";

const baseEndpoont = `${ApiEndpoint}/dinner-ideas-db`;

export const getAll = async (): Promise<DinnerItem[]> => {
    try {
        const response = await fetch(baseEndpoont);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}, ${response}`);
        }
        const data: DinnerItem[] = await response.json();

        return data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};