import { FoodItem } from "../../models/FoodItem";

interface FoodItemProps
{
    foodItem: FoodItem;
    isLoading: boolean;
}

const FoodItemComponent: React.FC<FoodItemProps> = ({
    foodItem,
    isLoading
}) => {
    return (
        <>
            <h2>{foodItem.Name}</h2>
            <p>{foodItem.Description}</p>
        </>
    );
}

export default FoodItemComponent;