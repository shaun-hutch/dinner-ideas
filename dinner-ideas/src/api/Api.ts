import { ApiEndpoint } from "../models/Constants";
import { DinnerItem } from "../models/DinnerItem";

const baseEndpoint = `${ApiEndpoint}/dinner-ideas-db`;

export const getAll = async (): Promise<DinnerItem[]> => {
    try {
        const response = await fetch(baseEndpoint);
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

export const update = async (item: DinnerItem): Promise<DinnerItem> => {
    try {
        const response = await fetch(baseEndpoint, {
            method: "PUT",
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}, ${response}`);
        }

        const data: DinnerItem = await response.json();

        return data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const add = async (item: DinnerItem): Promise<DinnerItem> => {
    try {
        const response = await fetch(baseEndpoint, {
            method: "POST",
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}, ${response}`);
        }

        const data: DinnerItem = await response.json();

        return data;
    }
    catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}