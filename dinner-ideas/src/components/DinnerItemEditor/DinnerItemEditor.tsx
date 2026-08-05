import { useNavigate, useParams } from 'react-router-dom';
import './DinnerItemEditor.css';
import { DinnerItemContext } from 'hooks/useDinnerItemListContext';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from "primereact/floatlabel";
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { add, update } from 'api/Api';
import { DinnerItem, DinnerItemStep } from 'models/DinnerItem';
import { Ingredient } from 'models/Ingredient';
import { FoodTag } from 'models/FoodTag';
import { InputNumber } from 'primereact/inputnumber';
import { MultiSelect } from 'primereact/multiselect';
import { foodTagListItems, totalTime, measurementLabel, measurementListItems, formatIngredient } from 'helpers/componentHelpers';
import DinnerItemSteps from 'components/DinnerItemSteps/DinnerItemSteps';
import { Measurement } from 'models/Measurement';

interface DinnerItemEditorProps {
    readOnly?: boolean;
    create?: boolean; 
}

const newIngredient = (): Ingredient => ({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    measurement: Measurement.Amount,
    amount: 1,
});

const DinnerItemEditor = (props: DinnerItemEditorProps) => {
    const navigate = useNavigate();

    const {
        readOnly,
        create
    } = props;

    const [loaded, setLoaded] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [dinnerItem, setDinnerItem] = useState<DinnerItem>();
    
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [prepTime, setPrepTime] = useState<number>(0);
    const [cookTime, setCookTime] = useState<number>(0);
    const [steps, setSteps] = useState<DinnerItemStep[]>([]);
    const [tags, setTags] = useState<FoodTag[]>([]);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);

    const { dinnerItemId } = useParams();
    const { getDinnerItem, updateDinnerItem, addDinnerItem } = useContext(DinnerItemContext);
    const measurementOptions = useMemo(() => measurementListItems(), []);

    useEffect(() => {
        if (dinnerItemId && getDinnerItem) {
            const item = getDinnerItem(dinnerItemId);
            if (item && !loaded) {
                setLoaded(true);
                setDinnerItem(item);

                setName(item.name);
                setDescription(item.description);
                setPrepTime(item.prepTime);
                setCookTime(item.cookTime);
                setTags(item.tags);
                setSteps(item.steps);
                setIngredients(item.ingredients ?? []);
            }
        }
    }, [dinnerItemId, getDinnerItem, loaded]);

    // ── Ingredient CRUD ───────────────────────────────────────────────

    const handleAddIngredient = useCallback(() => {
        setIngredients(prev => [...prev, newIngredient()]);
    }, []);

    const handleRemoveIngredient = useCallback((id: string) => {
        setIngredients(prev => prev.filter(ing => ing.id !== id));
    }, []);

    const handleUpdateIngredient = useCallback((id: string, field: keyof Ingredient, value: string | number) => {
        setIngredients(prev => prev.map(ing =>
            ing.id === id ? { ...ing, [field]: value } : ing
        ));
    }, []);

    // ── Save ───────────────────────────────────────────────────────────

    const onSave = useCallback(() => {
        const payload: DinnerItem = {
            ...dinnerItem!,
            name,
            description,
            prepTime,
            cookTime,
            tags,
            steps,
            ingredients
        };
        setIsSaving(true);

        if (create) {
            add(payload).then((response: DinnerItem) => {
                setIsSaving(false);
                if (addDinnerItem) {
                    addDinnerItem(response);
                    navigate('/');
                }
            }, (error) => {
                setIsSaving(false);
                console.error(error);
            });
        } else {
            update(payload).then((response: DinnerItem) => {
                setIsSaving(false);
                if (updateDinnerItem) {
                    updateDinnerItem(response);
                    navigate('/');
                }
            }, (error) => {
                setIsSaving(false);
                console.error(error);
            });
        }

    }, [navigate, dinnerItem, setIsSaving, name, description, tags, steps, ingredients, create, updateDinnerItem, addDinnerItem]);

    const totalItemTime = useMemo(() => totalTime(cookTime, prepTime), [cookTime, prepTime]);

    const tagListItems = foodTagListItems();

    return (
        <div className="dinner-item-form">
                <div className="dinner-item-form-editor">
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputText id="name" className="dinner-item-text-input" value={name} onChange={e => setName(e.target.value)} readOnly={readOnly} />
                            <label htmlFor="name">Name</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-form-field">
                        <FloatLabel>
                            <InputTextarea id="description" className="dinner-item-text-input" value={description} onChange={e => setDescription(e.target.value)} readOnly={readOnly} />
                            <label htmlFor="description">Description</label>
                        </FloatLabel>
                    </div>
                    <div className="dinner-item-times dinner-item-form-field">
                        <FloatLabel>
                            <InputNumber id="prepTime" className="dinner-item-number-input" value={prepTime} suffix=" mins" onChange={e => setPrepTime(e.value!)} readOnly={readOnly}/>
                            <label htmlFor="prepTime">Preparation Time</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputNumber id="cookTime" className="dinner-item-number-input" value={cookTime} suffix=" mins" onChange={e => setCookTime(e.value!)} readOnly={readOnly}/>
                            <label htmlFor="cookTime">Cooking Time</label>
                        </FloatLabel>
                        <div className='dinner-item-total-times'>
                            {totalItemTime && (
                                <FloatLabel>
                                    <InputText id="totalTime" className="dinner-item-number-input total" value={totalItemTime} readOnly />
                                    <label htmlFor="totalTime">Total Time</label>
                                </FloatLabel>
                            )}
                        </div>
                    </div>
                    <div className="dinner-item-form-field multi-select">
                        <FloatLabel>
                            <MultiSelect 
                                className="dinner-item-input" 
                                id="tags" 
                                value={tags} 
                                options={tagListItems} 
                                display="chip" 
                                maxSelectedLabels={3} 
                                placeholder="Select up to 3 Tags" 
                                onChange={e => setTags(e.value)} 
                                disabled={readOnly}
                                selectionLimit={3}
                                showSelectAll={false} 
                                showClear={false}
                                panelHeaderTemplate={() => <div style={{display: 'none'}}/>} />
                            <label htmlFor="tags">Tags</label>
                        </FloatLabel>
                    </div>

                    {/* ── Ingredients Section ───────────────────────────── */}
                    <div className="dinner-item-form-field">
                        <h4>Ingredients</h4>
                        {ingredients.length === 0 && readOnly && (
                            <p className="text-color-secondary">No ingredients listed.</p>
                        )}
                        <div className="ingredients-list">
                            {ingredients.map((ing) => (
                                <div key={ing.id} className="ingredient-row">
                                    {readOnly ? (
                                        <span className="ingredient-display">{formatIngredient(ing)}</span>
                                    ) : (
                                        <div className="ingredient-edit-row">
                                            <InputText
                                                className="ingredient-name-input"
                                                value={ing.name}
                                                onChange={e => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                                                placeholder="Ingredient name"
                                            />
                                            <InputNumber
                                                className="ingredient-amount-input"
                                                value={ing.amount}
                                                onChange={e => handleUpdateIngredient(ing.id, 'amount', e.value ?? 1)}
                                                min={0}
                                                mode="decimal"
                                                locale="en-NZ"
                                            />
                                            <Dropdown
                                                className="ingredient-measurement-dropdown"
                                                value={ing.measurement}
                                                options={measurementOptions}
                                                onChange={e => handleUpdateIngredient(ing.id, 'measurement', e.value)}
                                                placeholder="Unit"
                                            />
                                            <InputText
                                                className="ingredient-quantity-input"
                                                value={ing.quantity ?? ''}
                                                onChange={e => handleUpdateIngredient(ing.id, 'quantity', e.target.value)}
                                                placeholder="or free-text (to taste, 1 can...)"
                                            />
                                            <Button
                                                icon="pi pi-trash"
                                                className="p-button-danger p-button-sm"
                                                rounded
                                                onClick={() => handleRemoveIngredient(ing.id)}
                                                tooltip="Remove ingredient"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!readOnly && (
                            <div className="dinner-item-add-action">
                                <Button
                                    icon="pi pi-plus"
                                    className="p-button-success"
                                    raised
                                    rounded
                                    onClick={handleAddIngredient}
                                    label="Add Ingredient"
                                />
                            </div>
                        )}
                    </div>

                    {/* ── Steps Section ──────────────────────────────────── */}
                    <div className="dinner-item-form-field">
                        <DinnerItemSteps
                            steps={steps}
                            ingredients={ingredients}
                            onStepsChange={setSteps}
                            onIngredientsChange={setIngredients}
                            loaded={loaded}
                            readOnly={readOnly}
                            create={create}
                        />
                    </div>

                    {!readOnly && (
                        <div className="dinner-item-form-buttons">
                            <Button icon={`pi ${isSaving ? "pi-spin pi-spinner" : "pi-save"}`} className="save-button" raised rounded onClick={onSave} label="Save" disabled={isSaving} />
                        </div>
                    )}
                </div>
        </div>

    )
}

export default DinnerItemEditor;