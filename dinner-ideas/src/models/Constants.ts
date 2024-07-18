import { FoodTag } from "./FoodTag";

export const FoodTagColor = {
    [FoodTag.Quick]: "#00FF00",
    [FoodTag.Vegeterian]: "#FFFF00",
    [FoodTag.Vegan]: "#FF7F50",
    [FoodTag.GlutenFree]: "#FFE4B5",
    [FoodTag.Cheap]: "#FFFF00",
    [FoodTag.LowCarb]: "#00BFFF",
    [FoodTag.FamilyFriendly]: "#FF0000",
};

export const ApiEndpoint = process.env.REACT_APP_API_ENDPOINT;