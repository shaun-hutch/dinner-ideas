import './App.css';
import DinnerList from './components/DinnerList/DInnerList';
import { componentKey } from './helpers/componentHelpers';

const App = () => {
    return (
        <DinnerList key={componentKey('App')} />
    );
};

export default App;
