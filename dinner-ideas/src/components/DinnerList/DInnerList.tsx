import { useDinnerItemList } from "../../hooks/useDinnerItemList";
import DinnerListItem from "../DinnerListItem/DinnerListItem";

const DinnerList = () => {

    const { loading, list } = useDinnerItemList();

    return (
        <div className="body">
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
            </div>
    )
}



export default DinnerList;