import './App.css';
import { DinnerItem } from './models/DinnerItem';
import { FoodTag } from './models/FoodTag';
import DinnerListItem from './components/DinnerListItem/DinnerListItem';

const App = () => {


    // mock items
    const mockItems: DinnerItem[] = [...Array(10).keys()].map(x => {
        return {
            id: x,
            cookTime: 20,
            prepTime: 20,
            description: "test description here",
            name: `Item ${x}`,
            steps: [],
            tags: [ FoodTag.Cheap, FoodTag.Quick ]
        }
    });

    return (
        <div className="body">
            {mockItems.map(item => <DinnerListItem key={item.id} isLoading={false} name={item.name} tags={item.tags} totalTime={item.cookTime + item.prepTime} />)}
            
            
        </div>
    )
};

export default App;
