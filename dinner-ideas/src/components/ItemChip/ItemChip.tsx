import styled from "styled-components";
import { FoodTag } from "../../models/FoodTag"
import './ItemChip.css';
import { FoodTagColor, FoodTagLabel } from "../../models/Constants";
import { componentKey } from "../../helpers/componentHelpers";
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

// const Chip = styled.div<{ $tag?: FoodTag; }>`
//         background-color: ${props => FoodTagColor[props.$tag as FoodTag]};
//         border-radius: 1em;
//         padding-left: 1em;
//         padding-right: 1em;
//         margin-right: 0.5em;
//         margin-top: 0.5em;
//         font-size: 0.8em;
//     `;

export default ItemChip;