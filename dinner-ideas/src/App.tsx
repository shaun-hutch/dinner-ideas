import './App.css';
import { DinnerItem } from './models/DinnerItem';
import { FoodTag } from './models/FoodTag';
import { ApiEndpoint } from './models/Constants';
import DinnerListItem from './components/DinnerListItem/DinnerListItem';
import DinnerList from './components/DinnerList/DInnerList';
import { componentKey } from './helpers/componentHelpers';

const App = () => {
    return (
        <DinnerList key={componentKey('App')} />
    );
};

export default App;
