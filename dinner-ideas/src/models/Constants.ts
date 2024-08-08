import { FoodTag } from "./FoodTag";

export const FoodTagColor = {
    [FoodTag.Quick]: "#FFB347",
    [FoodTag.Vegeterian]: "#77DD77",
    [FoodTag.Vegan]: "#B2F4E6",
    [FoodTag.GlutenFree]: "#C3B1E1",
    [FoodTag.Cheap]: "#FFCCBA",
    [FoodTag.LowCarb]: "#AEC6CF",
    [FoodTag.FamilyFriendly]: "#FDFD96",
};

export const FoodTagLabel = {
    [FoodTag.Quick]: "Quick",
    [FoodTag.Vegeterian]: "Vegeterian",
    [FoodTag.Vegan]: "Vegan",
    [FoodTag.GlutenFree]: "Gluten Free",
    [FoodTag.Cheap]: "Cheap",
    [FoodTag.LowCarb]: "Low Carb",
    [FoodTag.FamilyFriendly]: "Family Friendly",
};

export const ApiEndpoint = import.meta.env.VITE_APP_API_ENDPOINT;