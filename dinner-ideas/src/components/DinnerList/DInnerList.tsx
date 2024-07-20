import { Skeleton } from "primereact/skeleton";
import { useDinnerItemList } from "../../hooks/useDinnerItemList";
import DinnerListItem from "../DinnerListItem/DinnerListItem";

const DinnerList = () => {  
    const { list, loading } = useDinnerItemList();

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
            <>
                <div className="dinner-list">
                    {list.map(item => 
                        <DinnerListItem 
                            key={item.id} 
                            isLoading={loading} 
                            name={item.name} 
                            tags={item.tags} 
                            totalTime={item.cookTime + item.prepTime} 
                            id={item.id} 
                            onClick={() => console.log('yee')} 
                            />
                    )}
                </div>
            </>
        )
    )
}

export default DinnerList;