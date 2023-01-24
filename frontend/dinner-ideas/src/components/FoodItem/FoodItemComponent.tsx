import { FoodItem } from "../../models/Models";

interface FoodItemProps
{
    foodItem: FoodItem;
}

const FoodItemComponent: React.FC<FoodItemProps> = ({
    foodItem,
}) => {
    return (
        <>
            <h2>{foodItem.Name}</h2>
            <p>{foodItem.Description}</p>
        </>
    );
}

export default FoodItemComponent;