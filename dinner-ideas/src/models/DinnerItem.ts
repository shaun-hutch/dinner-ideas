import { BaseItem } from "./BaseItem";
import { FoodTag } from "./FoodTag";

export interface DinnerItem extends BaseItem {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    steps: string[];
    tags: FoodTag[];
}