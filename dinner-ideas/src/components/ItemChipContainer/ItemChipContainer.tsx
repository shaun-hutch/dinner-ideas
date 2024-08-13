import ItemChip from "components/ItemChip/ItemChip";
import { componentKey } from "../../helpers/componentHelpers";
import { FoodTag } from "../../models/FoodTag"
import './ItemChipContainer.css';

interface ItemChipContainerProps
{
    tags: FoodTag[]
}

const ItemChipContainer = (props: ItemChipContainerProps) => {

    const chips = props.tags.slice(0, 3);

    return (
        <div className="item-chips">
                {chips.map(x => 
                    <ItemChip FoodTag={x} key={componentKey("Chip")} />
                )}
        </div>
    )
}

export default ItemChipContainer;