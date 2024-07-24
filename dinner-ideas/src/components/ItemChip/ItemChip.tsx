import { FoodTag } from "../../models/FoodTag"
import './ItemChip.css';
import { FoodTagColor, FoodTagLabel } from "../../models/Constants";
import { Chip } from "primereact/chip";

interface ItemChipProps {
    FoodTag: FoodTag;
}

const ItemChip = (props: ItemChipProps) => {
    
    const {
        FoodTag
    } = props;


    return (
        <Chip label={FoodTagLabel[FoodTag]} style={{background: FoodTagColor[FoodTag]}} className="item-chip" />
    )
};

export default ItemChip;