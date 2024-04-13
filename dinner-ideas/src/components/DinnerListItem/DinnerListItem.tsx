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
        // name,
        // totalTime,
        // image,
        // tags
    } = props;
    // name

    // prep time and cook time
    // image
    // tags

    const formattedTime = `${props.totalTime} mins`
    
    const photo = (
        <div className="image">
            <img src="https://picsum.photos/200" width="200" alt="placeholder"/>
        </div>
    );


    return (
        <div className="dinner-list-item">
            {
                isLoading ? <>Loading</> : 
                <Card className="md:w25rem" title={props.name} subTitle={formattedTime} header={photo} />
            }
        </div> 
    );
}

export default DinnerListItem;