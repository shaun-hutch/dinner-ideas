import { Card } from "primereact/card";
import { FoodTag } from "../../models/FoodTag";
import './DinnerListItem.css';

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
        totalTime,
        image,
        tags
    } = props;
    // name

    // prep time and cook time
    // image
    // tags


    


    return (
        <div className="dinner-list-item">
            {
                isLoading ? <>Loading</> : 
                <Card title={props.name} footer={<>{props.totalTime} mins</>}/>
            }
        </div> 
    );
}

export default DinnerListItem;