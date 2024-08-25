import { BaseItem } from "./BaseItem";
import { Dictionary } from "./Dictionary";
import { FoodTag } from "./FoodTag";

export interface DinnerItem extends BaseItem {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    steps: DinnerItemStep[];
    tags: FoodTag[];
}

export interface DinnerItemStep {
    stepTitle: string;
    stepDescription: string;
}