import { API, GraphQLQuery, GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { Action, ActionType, FoodItem, FoodItemsState } from "./models/Models";
import { listFoodItems } from "./graphql/queries";
import { createFoodItem, deleteFoodItem, updateFoodItem } from "./graphql/mutations";
import { CreateFoodItemInput, CreateFoodItemMutation, DeleteFoodItemInput, DeleteFoodItemMutation, ListFoodItemsQuery, UpdateFoodItemInput, UpdateFoodItemMutation } from "./API";

export async function getFoodItems(weekItemId: string): Promise<FoodItem[]> {
  try {
    const foodData = await API.graphql<GraphQLQuery<ListFoodItemsQuery>>({
      query: listFoodItems,
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    });
    const foodList = foodData.data?.listFoodItems?.items as FoodItem[];

    return foodList;
  } catch (err) {
    console.error("error getting food item list:", err);
    return [];
  }
}

export async function createItem(name: string, description: string, file: string) {
  try {
    const input: CreateFoodItemInput = {
      description,
      name,
      image: file
    };

    await API.graphql<GraphQLQuery<CreateFoodItemMutation>>({
      query: createFoodItem,
      variables: { input },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    });
  } catch (err) {
    console.error("error creating food item:", err);
  }
}

export async function updateItem(name: string, description: string, id: string, file: string) {
  try {
    const input: UpdateFoodItemInput = {
      description,
      name,
      id,
      image: file
    };

    await API.graphql<GraphQLQuery<UpdateFoodItemMutation>>({
      query: updateFoodItem,
      variables: { input },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    });
  } catch (err) {
    console.error("error updating food item:", err);
  }
}

export async function deleteItem(id: string) {
  try {
    const input: DeleteFoodItemInput = {
      id
    };

    await API.graphql<GraphQLQuery<DeleteFoodItemMutation>>({
      query: deleteFoodItem,
      variables: { input },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    });
  } catch (err) {
    console.error('error deleting food item');
  }
}

export const useFoodItemsReducer = (state: FoodItemsState, action: Action) => {
  switch (action.type) {
    case ActionType.Call: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case ActionType.Success: {
      return {
        ...state,
        foodItems: action.data,
        isLoading: false,
      };
    }
    case ActionType.Error: {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
  }
};
