import styled from "styled-components";
import { FoodTag } from "../../models/FoodTag"
import './ItemChip.css';
import { FoodTagColor } from "../../models/Constants";
import { componentKey } from "../../helpers/componentHelpers";

interface ItemChipProps {
    FoodTag: FoodTag;
}

const ItemChip = (props: ItemChipProps) => {
    
    const {
        FoodTag
    } = props;

    return (
        <Chip $tag={FoodTag} key={componentKey("Chip")}>
            <p className="item-chip-text">{props.FoodTag}</p>
        </Chip>
    )
};

const Chip = styled.div<{ $tag?: FoodTag; }>`
        background-color: ${props => FoodTagColor[props.$tag as FoodTag]};
        border-radius: 2em;
        padding-left: 1em;
        padding-right: 1em;
        margin-right: 0.5em;
        margin-top: 0.5em;
        font-size: 0.8em;
    `;

export default ItemChip;