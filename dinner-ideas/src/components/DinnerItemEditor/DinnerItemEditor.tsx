import { useParams } from 'react-router-dom';
import './DinnerItemEditor.css';

const DinnerItemEditor = () => {
    const { dinnerItemId } = useParams();


    return (
        dinnerItemId ? (

            <>
            {dinnerItemId}
            </>
        ) : <>create</>

    )
}

export default DinnerItemEditor;