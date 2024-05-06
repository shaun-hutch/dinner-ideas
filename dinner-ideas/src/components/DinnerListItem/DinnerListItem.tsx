import { Card } from "primereact/card";
import { FoodTag } from "../../models/FoodTag";
import './DinnerListItem.css';
import ItemChip from "./ItemChip";

interface DinnerListItemProps {
    isLoading: boolean;
    name: string;
    totalTime: number;
    tags: FoodTag[];
    image?: string; // base64
}

const DinnerListItem = (props: DinnerListItemProps) => {

    const {
        isLoading,
        name,
        tags,
        totalTime
    } = props;


    const formattedTime = `${totalTime} mins`
    
    const photo = (
        <div className="image">
            <img src="https://picsum.photos/400" width="400" alt="placeholder"/>
        </div>
    );

    const itemChips = (
        <div className="item-chips">
                {tags.map(x => 
                    <ItemChip FoodTag={x} />
                )}
        </div>
    );

    return (
        <div className="dinner-list-item">
            {
                isLoading ? <>Loading</> : 
                <Card className="md:w25rem" title={name} subTitle={formattedTime} header={photo} footer={itemChips} />
            }
        </div> 
    );
}

export default DinnerListItem;