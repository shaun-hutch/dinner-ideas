import { Skeleton } from "primereact/skeleton";
import DinnerListItem from "components/DinnerListItem/DinnerListItem";
import { useDinnerItemList } from "hooks/useDinnerItemList";
import { DataView } from "primereact/dataview";
import { DinnerItem } from "models/DinnerItem";
import { Card } from "primereact/card";
import './DinnerList.css';

const DinnerList = () => {  
    const { list, loading } = useDinnerItemList();


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
                onClick={() => console.log('yee')} 
                />
        );
    }

    console.log('loading', loading);

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
    <div className="loading-skeleton">
        <Skeleton width="15rem" height="15rem" className="mb-2"></Skeleton>
        <Skeleton width="10rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" className="mb-2"></Skeleton>
        <Skeleton width="15rem" height="4rem"></Skeleton>
    </div>
);