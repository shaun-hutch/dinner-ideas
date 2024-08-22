import { FoodTag } from "models/FoodTag";
import { SelectItem } from "primereact/selectitem";

export const componentKey = (name?: string) => `${name ?? "component"}_${crypto.randomUUID()}`;

export const foodTagListItems = (): SelectItem[] => 
    Object.keys(FoodTag).map((key, index) => 
        ({
            label: key,
            value: index
        })
    );
