import { Measurement } from "./Measurement";

export interface Ingredient {
    id: number;
    dinnerItemId: number;
    name: string;
    description: string;
    measurement: Measurement;
    amount: number;
}