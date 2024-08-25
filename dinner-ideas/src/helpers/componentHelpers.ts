import { FoodTagLabel } from "models/Constants";
import { FoodTag } from "models/FoodTag";
import { SelectItem } from "primereact/selectitem";

export const componentKey = (name?: string) => `${name ?? "component"}_${crypto.randomUUID()}`;

export const foodTagListItems = (): SelectItem[] => 
    Object.keys(FoodTag).filter(x => isNaN(Number(x))).map((key, index) => 
        ({
            label: FoodTagLabel[index as FoodTag],
            value: index
        })
    );

export const totalTime = (... times: number[]): string => {
    if (!times || times?.length === 0) {
        return "0 mins";
    }
    const total = times.reduce((sum, current) => sum + current);
    if (total < 60) {
        return `${total} mins`;
    } else if ( total === 60 ) {
        return `60 mins`;
    } else {
        const hours = Math.floor(total / 60);
        const mins = total % 60;
        return `${hours} hour${mins > 60 ? "s" : ''}, ${mins} mins`;
    }
}