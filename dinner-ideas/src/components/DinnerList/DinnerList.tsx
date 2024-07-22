import { Skeleton } from "primereact/skeleton";
import DinnerListItem from "components/DinnerListItem/DinnerListItem";
import { useDinnerItemList } from "hooks/useDinnerItemList";
import { DataView } from "primereact/dataview";
import { DinnerItem } from "models/DinnerItem";
import { Card } from "primereact/card";

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

    return (
        loading ? (
            <div>
                <Skeleton className="mb-2"></Skeleton>
                <Skeleton width="10rem" className="mb-2"></Skeleton>
                <Skeleton width="5rem" className="mb-2"></Skeleton>
                <Skeleton height="2rem" className="mb-2"></Skeleton>
                <Skeleton width="10rem" height="4rem"></Skeleton>
            </div>
        ) : (
            <Card>
                <DataView value={list} layout={"grid"} itemTemplate={itemTemplate}/>
            </Card>
        )
    )
}

export default DinnerList;