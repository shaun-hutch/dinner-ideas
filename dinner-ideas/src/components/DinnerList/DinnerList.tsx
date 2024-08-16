import { Skeleton } from "primereact/skeleton";
import DinnerListItem from "components/DinnerListItem/DinnerListItem";
import { useDinnerItemList } from "hooks/useDinnerItemList";
import { DataView } from "primereact/dataview";
import { DinnerItem } from "models/DinnerItem";
import { Card } from "primereact/card";
import './DinnerList.css';
import React from "react";
import { useNavigate } from "react-router-dom";

const DinnerList = () => {  
    const { list, loading } = useDinnerItemList();
    const navigate = useNavigate();

    const onItemClick = React.useCallback((id: string) => {
        navigate(`/view/${id}`);
    }, [navigate]);

    const onEditItemClick = React.useCallback((id: string) => {
        navigate(`/edit/${id}`);
    }, [navigate]);


    const itemTemplate = (item: DinnerItem) => 
    {
        return (
            <DinnerListItem 
                key={item.id} 
                isLoading={loading} 
                name={item.name} 
                tags={item.tags} 
                totalTime={item.cookTime + item.prepTime} 
                id={item.id} 
                onClick={onItemClick} 
                onEditButtonClick={onEditItemClick}
                />
        );
    }

    return (
        <Card>
            {loading ? (
                <div className="grid">
                    {loadingSkeleton}
                </div>
            ) : (
                    <DataView value={list} layout={"grid"} itemTemplate={itemTemplate}/>
            )}
        </Card>
    )
}

export default DinnerList;


const loadingSkeleton = [...Array(6).keys()].map(x => 
    <div className="loading-skeleton" key={`skeleton_${x}`}>
        <Skeleton width="15rem" height="15rem" className="mb-2"></Skeleton>
        <Skeleton width="10rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" height="4rem"></Skeleton>
    </div>
);