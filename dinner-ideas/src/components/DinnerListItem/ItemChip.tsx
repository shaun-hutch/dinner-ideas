import styled from "styled-components";
import { FoodTag } from "../../models/FoodTag"
import './ItemChip.css';
import { FoodTagColor } from "../../models/Constants";

interface ItemChipProps {
    FoodTag: FoodTag;
}

const ItemChip = (props: ItemChipProps) => {
    const Chip = styled.div`
        background-color: ${FoodTagColor[props.FoodTag]};
        border-radius: 2em;
        padding-left: 1em;
        padding-right: 1em;
        margin-right: 0.5em;
        font-size: 0.8em;
    `;

    console.log(props);


    return (
        <Chip>
            <p className="item-chip-text">{props.FoodTag}</p>
        </Chip>
    )
};


export default ItemChip;