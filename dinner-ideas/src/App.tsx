import './App.css';
import DinnerList from 'components/DinnerList/DinnerList';
import { componentKey } from 'helpers/componentHelpers';

const App = () => {
    return (
        <div className="body">
            <DinnerList key={componentKey('App')} />
        </div>
    );
};

export default App;
