import { Measurement } from "./Measurement";

export interface Ingredient {
    id: string;
    name: string;
    description: string;
    measurement: Measurement;
    amount: number;
}
