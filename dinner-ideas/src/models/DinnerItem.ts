import { FoodTag } from "./FoodTag";

export interface DinnerItem {
    id: number;
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    steps: string[];
    tags: FoodTag[];
}