import { Card } from "primereact/card";
import { FoodTag } from "../../models/FoodTag";
import './DinnerListItem.css';
import ItemChipContainer from "../ItemChip/ItemChipContainer";
import meta_salad from '../../../src/images/meta_salad.png'

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
            <img src={meta_salad} width="300" alt="placeholder"/>
        </div>
    );

    return (
        <div className="dinner-list-item">
            {
                isLoading ? <>Loading</> : 
                <Card 
                    className="md:w25rem" 
                    title={name} 
                    subTitle={formattedTime} 
                    header={photo} 
                    footer={
                        <ItemChipContainer tags={tags}/>
                    }
                />
            }
        </div> 
    );
}

export default DinnerListItem;