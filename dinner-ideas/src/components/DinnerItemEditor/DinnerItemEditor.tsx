import { useParams } from 'react-router-dom';
import './DinnerItemEditor.css';
import { DinnerItemContext, useDiinnerItemListContext } from 'hooks/useDinnerItemListContext';
import { useContext, useEffect, useState } from 'react';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { DinnerItem } from 'models/DinnerItem';
import './DinnerItemEditor.css';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from "primereact/floatlabel";

interface DinnerItemEditorProps {
    readOnly?: boolean;
}


const DinnerItemEditor = (props: DinnerItemEditorProps) => {
    const {
        readOnly
    } = props;

    const [dinnerItem, setDinnerItem] = useState<DinnerItem>();
    const [loaded, setLoaded] = useState<boolean>(false);

    const { dinnerItemId } = useParams();
    const { getDinnerItem } = useContext(DinnerItemContext);

    useEffect(() => {
        if (dinnerItemId && getDinnerItem) {
            const item = getDinnerItem(dinnerItemId);
            if (item && setDinnerItem) {
                setDinnerItem(item);
            }
        }

    }, [dinnerItemId, getDinnerItem, setDinnerItem]);

    useEffect(() => {
        if (dinnerItem && !loaded) {
            setLoaded(true);
        }
    }, [dinnerItem, loaded, setLoaded]);

    return (
        <div className="dinner-item-form">
            {readOnly ? (
                <div className="dinner-item-form-viewer">
                    <h2>{dinnerItem?.name}</h2>
                    <p>{dinnerItem?.description}</p>
                </div>
            ) : (
                <div className="dinner-item-form-editor">
                    <FloatLabel>
                        <InputText id="name" className="dinner-item-text-input" value={dinnerItem?.name} />
                        <label htmlFor="name">Name</label>
                    </FloatLabel>
                    <InputTextarea className="dinner-item-text-input" value={dinnerItem?.description} />
                </div>
            )}


        </div>

    )
}

export default DinnerItemEditor;