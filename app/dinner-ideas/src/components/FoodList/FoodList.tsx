import {
  Action,
  ActionType,
  FoodItem,
  FoodItemsState,
} from "../../models/Models";
import FoodItemComponent from "../FoodItem/FoodItemComponent";
import { getFoodItems, useFoodItemsReducer } from "../../foodItemsApi";
import { useEffect, useState, useReducer } from "react";
import FoodItemContentLoader from "../FoodItem/FoodItemContentLoader";
import "./FoodList.css";

interface FoodListProps {
  listDate?: Date;
}

export default function FoodList(props: FoodListProps) {
  const initialState: FoodItemsState = {
    foodItems: [],
    isLoading: true,
    error: "",
  };

  const [state, dispatch] = useReducer(useFoodItemsReducer, initialState);
  const { isLoading, foodItems, error } = state;
  const formattedDate = props?.listDate?.toDateString();

  useEffect(() => {
    getFoodItems("").then((data) => {
      const success: Action = {
        type: ActionType.Success,
        data: data,
        error: "",
      };
      dispatch(success);
    });
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
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
