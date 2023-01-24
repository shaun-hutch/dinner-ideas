import { FoodItem } from "../../models/Models";
import FoodItemComponent from "../FoodItem/FoodItemComponent";
import { getFoodItems } from "../../foodItemsApi";
import { useEffect, useState } from "react";

interface FoodListProps
{
    listDate: Date;
}


const FoodList: React.FC<FoodListProps> = ({
    listDate
}) => {

    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const items = 10;

    const formattedDate = listDate.toDateString();


    useEffect(() => {
        if (isLoading) {
            getFoodItems('').then(data => {
                console.log(data);
                setFoodItems(data);
                setIsLoading(false);
            });
        }
    }, []);


    if (isLoading) {
        return <>loading items...</>
    }

    const foodListItems = foodItems?.map(foodItem => {
        return (
            <>
                
            </>
        );
    })


    return (
        <>
            <h2>Food list thing</h2>
            <div className='date-label'>
                <h3>{formattedDate}</h3>
            </div>
            <div className="food-list">
                <ul>
                    {foodItems.map(foodItem => 
                    <li>
                        <FoodItemComponent
                            key={foodItem.Id}
                            foodItem={foodItem}
                            isLoading={isLoading}
                        />
                    </li>
                    )}
                </ul>
            </div>
        </>
    )
};

export default FoodList;