import {
  Action,
  ActionType,
  FoodItemsState,
} from "../../models/Models";
import FoodItemComponent from "../FoodItem/FoodItemComponent";
import { deleteItem, getFoodItems, useFoodItemsReducer } from "../../foodItemsApi";
import { useEffect, useReducer } from "react";
import FoodItemContentLoader from "../FoodItem/FoodItemContentLoader";
import "./FoodList.css";
import React from "react";

export default function FoodList() {
  const initialState: FoodItemsState = {
    foodItems: [],
    isLoading: true,
    error: "",
  };

  const [state, dispatch] = useReducer(useFoodItemsReducer, initialState);
  const { isLoading, foodItems } = state;

  const deleteFoodItem = React.useCallback((id: string) => {
    deleteItem(id).then(() => {
      load();
    });
  }, []);

  const load = () => {
    getFoodItems("").then((data) => {
      const success: Action = {
        type: ActionType.Success,
        data: data,
        error: "",
      };
      dispatch(success);
    });
  };

  useEffect(() => {
    load();
  }, []);

  console.log("is loading", isLoading);
  return (
    <>
      <div className="food-list-items">
        {isLoading ? (
            <FoodItemContentLoader key={"loading"} />
        ) : (
          <>
            <div>
              {foodItems.map((foodItem) => (
                <FoodItemComponent
                  key={foodItem.id}
                  description={foodItem.description}
                  name={foodItem.name}
                  id={foodItem.id}
                  onDeleteFoodItem={deleteFoodItem}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
