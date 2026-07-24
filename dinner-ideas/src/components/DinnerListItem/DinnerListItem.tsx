import { Card } from "primereact/card";
import { FoodTag } from "../../models/FoodTag";
import './DinnerListItem.css';
import meta_salad from '../../../src/images/meta_salad.png'
import React from "react";
import ItemChipContainer from "../ItemChipContainer/ItemChipContainer";
import { Button } from "primereact/button";

interface DinnerItemProps {
    isLoading: boolean;
    id: string;
    name: string;
    totalTime: number;
    tags: FoodTag[];
    imageKey?: string;
    onClick: (id: string) => void;
    onEditButtonClick: (id: string) => void;
}

const DinnerListItem = (props: DinnerItemProps) => {

    const {
        id,
        name,
        tags,
        totalTime,
        imageKey,
        onClick,
        onEditButtonClick
    } = props;

    const formattedTime = `${totalTime} mins`
    const processedImage = imageKey
        ? `https://shaun-web-app-bucket.s3.us-west-1.amazonaws.com/${imageKey}`
        : meta_salad;
    
    const photo = (
        <div className="image">
            <img src={processedImage} alt={name}/>
        </div>
    );

    const onItemClick = React.useCallback(() => {
        onClick(id)
    }, [id, onClick]);

    const onItemButtonClick = React.useCallback(() => {
        onEditButtonClick(id);
    }, [id, onEditButtonClick]);

    return (
        <div className="dinner-list-item xl:col-3 lg:col-3 sm:col-4 p-2">
            <Card 
                title={name} 
                subTitle={formattedTime} 
                header={photo} 
                footer={
                    <ItemChipContainer tags={tags}/>
                }
                onClick={onItemClick}
            />
            <Button icon="pi pi-pencil" className="edit-button" raised rounded onClick={onItemButtonClick}/>
            
        </div> 
    );
}

export default DinnerListItem;
