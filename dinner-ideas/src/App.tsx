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
            tags: generateMockTags()
        }
    });

    return (
        <div className="body">
            <div className="dinner-list">
                {mockItems.map(item => <DinnerListItem key={item.id} isLoading={false} name={item.name} tags={item.tags} totalTime={item.cookTime + item.prepTime} />)}
            </div>
        </div>
    )
};

const generateMockTags = (): FoodTag[] => {
    const items: FoodTag[] = Object.values(FoodTag);

    let tags: FoodTag[] = [];
    let i = 0;
    while (i < 3) {
        let item = items[Math.floor(Math.random()*items.length)];
        if (!tags.find(x => x === item)) {
            tags.push(item);
        }
        i++;
    }

    return tags;
}

export default App;
