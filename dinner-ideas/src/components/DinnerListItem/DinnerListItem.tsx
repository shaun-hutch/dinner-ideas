import { Card } from "primereact/card";
import { FoodTag } from "../../models/FoodTag";
import './DinnerListItem.css';
import meta_salad from '../../../src/images/meta_salad.png'
import React from "react";
import ItemChipContainer from "../ItemChipContainer/ItemChipContainer";

interface DinnerItemProps {
    isLoading: boolean;
    id: number;
    name: string;
    totalTime: number;
    tags: FoodTag[];
    image?: string; // s3 prefix location
    onClick: (id: number) => void;
}

const DinnerListItem = (props: DinnerItemProps) => {

    const {
        id,
        name,
        tags,
        totalTime,
        image,
        onClick
    } = props;

    const formattedTime = `${totalTime} mins`
    const processedImage = !!image ? `data:image/png;base64,${image}` : meta_salad;
    
    const photo = (
        <div className="image">
            <img src={processedImage} width="300" alt="placeholder"/>
        </div>
    );

    const onItemClick = React.useCallback(() => {
        onClick(id)
    }, [id, onClick]);

    return (
        <div className="dinner-list-item">
            <Card 
                className="md:w25rem" 
                title={name} 
                subTitle={formattedTime} 
                header={photo} 
                footer={
                    <ItemChipContainer tags={tags}/>
                }
                onClick={onItemClick}
            />
        </div> 
    );
}

export default DinnerListItem;