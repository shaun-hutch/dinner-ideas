interface BaseItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
}

export interface FoodItem extends BaseItem {
  name: string;
  description: string;
  image: string;
}

export interface FoodItemsState {
  foodItems: FoodItem[];
  isLoading: boolean;
  error: string;
}

export interface Action {
  type: ActionType;
  data: FoodItem[];
  error: string;
}

export enum ActionType {
  Call,
  Success,
  Error,
}
