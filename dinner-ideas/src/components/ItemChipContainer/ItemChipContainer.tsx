import { componentKey } from "../../helpers/componentHelpers";
import { FoodTag } from "../../models/FoodTag"
import ItemChip from "../ItemChip/ItemChip";
import './ItemChipContainer.css';

interface ItemChipContainerProps
{
    tags: FoodTag[]
}

const ItemChipContainer = (props: ItemChipContainerProps) => {
    return (
        <div className="item-chips">
                {props.tags.map(x => 
                    <ItemChip FoodTag={x} key={componentKey("Chip")} />
                )}
        </div>
    )
}

export default ItemChipContainer;