import { FoodTagLabel } from "models/Constants";
import { FoodTag } from "models/FoodTag";
import { Measurement } from "models/Measurement";
import { Ingredient } from "models/Ingredient";
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
        return `${hours} hour${hours > 1 ? "s" : ''}, ${mins} mins`;
    }
}

/** Returns the display abbreviation for a measurement enum value. */
export const measurementLabel = (measurement: Measurement): string => {
    const labels: Record<number, string> = {
        [Measurement.Millilitres]: 'ml',
        [Measurement.Teaspoon]: 'tsp',
        [Measurement.Tablespoon]: 'tbsp',
        [Measurement.Grams]: 'g',
        [Measurement.Cups]: 'cup',
        [Measurement.Ounces]: 'oz',
        [Measurement.Pounds]: 'lb',
        [Measurement.Pinch]: 'pinch',
        [Measurement.ToTaste]: 'to taste',
        [Measurement.Litres]: 'L',
        [Measurement.Kilograms]: 'kg',
        [Measurement.Slices]: 'slice',
        [Measurement.Cloves]: 'clove',
        [Measurement.Bunches]: 'bunch',
        [Measurement.Cans]: 'can',
        [Measurement.Amount]: '',
    };
    return labels[measurement] ?? '';
};

/** Formats an ingredient for display (e.g., "2 tbsp olive oil" or "to taste salt"). */
export const formatIngredient = (ingredient: Ingredient): string => {
    if (ingredient.quantity) {
        return `${ingredient.quantity} ${ingredient.name}`;
    }
    const label = measurementLabel(ingredient.measurement);
    const amountStr = ingredient.amount % 1 === 0 ? ingredient.amount.toString() : ingredient.amount.toFixed(1);
    if (label) {
        return `${amountStr} ${label} ${ingredient.name}`;
    }
    return `${amountStr} ${ingredient.name}`;
};

/** Returns all measurement enum values as select items for dropdowns. */
export const measurementListItems = (): SelectItem[] =>
    Object.keys(Measurement)
        .filter(k => isNaN(Number(k)))
        .map(key => ({
            label: measurementLabel(Measurement[key as keyof typeof Measurement]),
            value: Measurement[key as keyof typeof Measurement]
        }));