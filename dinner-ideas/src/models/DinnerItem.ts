import { BaseItem } from "./BaseItem";
import { FoodTag } from "./FoodTag";
import { Ingredient } from "./Ingredient";

export interface DinnerItem extends BaseItem {
    name: string;
    description: string;
    prepTime: number;
    cookTime: number;
    steps: DinnerItemStep[];
    tags: FoodTag[];
    ingredients: Ingredient[];
    imageKey?: string;
}

export interface DinnerItemStep {
    stepTitle: string;
    stepDescription: string;
    id: string;
    /** Denormalised list of ingredient IDs used in this step. */
    ingredientIds?: string[];
}