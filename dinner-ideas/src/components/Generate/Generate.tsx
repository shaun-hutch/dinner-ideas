import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { TabView, TabPanel } from "primereact/tabview";
import { Tag } from "primereact/tag";
import { generateItems, getRandomMeal, importMeal } from "../../api/Api";
import { DinnerItem } from "../../models/DinnerItem";
import DinnerListItem from "../DinnerListItem/DinnerListItem";
import { useNavigate } from "react-router-dom";
import "./Generate.css";

const Generate: React.FC = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(false);

    // Discover tab state
    const [discoverMeal, setDiscoverMeal] = useState<DinnerItem | null>(null);
    const [discoverLoading, setDiscoverLoading] = useState(false);
    const [importLoading, setImportLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const generatedItems = await generateItems(5);
            setItems(generatedItems);
            setGenerated(true);
        } catch (err) {
            console.error("Failed to generate items:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDiscover = async () => {
        setDiscoverLoading(true);
        try {
            const meal = await getRandomMeal();
            setDiscoverMeal(meal);
        } catch (err) {
            console.error("Failed to fetch random meal:", err);
        } finally {
            setDiscoverLoading(false);
        }
    };

    const handleImportMeal = async () => {
        if (!discoverMeal) return;
        const mealId = discoverMeal.id.split("-").pop()?.replace(/^0+/, "") || "";
        setImportLoading(true);
        try {
            await importMeal(mealId);
            navigate("/");
        } catch (err) {
            console.error("Import failed:", err);
        } finally {
            setImportLoading(false);
        }
    };

    const itemTemplate = (item: DinnerItem) => (
        <DinnerListItem
            key={item.id}
            isLoading={loading}
            name={item.name}
            tags={item.tags}
            totalTime={item.cookTime + item.prepTime}
            id={item.id}
            onClick={(id) => navigate(`/view/${id}`)}
            onEditButtonClick={(id) => navigate(`/edit/${id}`)}
        />
    );

    return (
        <div className="generate-container">
            <Card title="Meal Inspiration">
                <TabView>
                    <TabPanel header="From My Collection">
                        <div className="generate-content">
                            <p className="generate-description">
                                Get random meal suggestions from your recipe collection.
                                Click generate to see 5 randomly selected dinner ideas.
                            </p>

                            <div className="generate-action">
                                <Button
                                    label={loading ? "Generating..." : "Generate Ideas"}
                                    icon={`pi ${loading ? "pi-spin pi-spinner" : "pi-sync"}`}
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    raised
                                    size="large"
                                />
                            </div>

                            {generated && items.length > 0 && (
                                <div className="generate-results">
                                    <h3>Your Picks</h3>
                                    <DataView
                                        value={items}
                                        layout="grid"
                                        itemTemplate={itemTemplate}
                                    />
                                </div>
                            )}

                            {generated && items.length === 0 && (
                                <div className="generate-empty">
                                    <p>No recipes found. Try adding some recipes first!</p>
                                    <Button
                                        label="Create Recipe"
                                        icon="pi pi-plus"
                                        onClick={() => navigate("/create")}
                                        raised
                                    />
                                </div>
                            )}
                        </div>
                    </TabPanel>

                    <TabPanel header="Discover New">
                        <div className="generate-content">
                            <p className="generate-description">
                                Discover a random recipe from thousands of meals around the world,
                                powered by TheMealDB. Like what you see? Import it to your collection.
                            </p>

                            <div className="generate-action">
                                <Button
                                    label={discoverLoading ? "Finding..." : "Surprise Me!"}
                                    icon={`pi ${discoverLoading ? "pi-spin pi-spinner" : "pi-globe"}`}
                                    onClick={handleDiscover}
                                    disabled={discoverLoading}
                                    raised
                                    size="large"
                                    severity="help"
                                />
                            </div>

                            {discoverMeal && (
                                <div className="discover-result p-4 mt-4 surface-card border-round">
                                    <h3 className="mt-0">{discoverMeal.name}</h3>
                                    <p className="text-color-secondary">{discoverMeal.description}</p>

                                    <div className="flex gap-2 flex-wrap mb-3">
                                        {discoverMeal.tags?.map((tag) => (
                                            <Tag key={tag} value={String(tag)} severity="info" />
                                        ))}
                                    </div>

                                    <div className="mb-3 text-color-secondary">
                                        ⏱ {discoverMeal.prepTime + discoverMeal.cookTime} mins
                                        · {discoverMeal.ingredients?.length || 0} ingredients
                                        · {discoverMeal.steps?.length || 0} steps
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            label={importLoading ? "Importing..." : "Add to My Recipes"}
                                            icon={`pi ${importLoading ? "pi-spin pi-spinner" : "pi-plus-circle"}`}
                                            onClick={handleImportMeal}
                                            disabled={importLoading}
                                            raised
                                            severity="success"
                                        />
                                        <Button
                                            label="Skip & Try Again"
                                            icon="pi pi-refresh"
                                            className="p-button-outlined"
                                            onClick={handleDiscover}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabPanel>
                </TabView>
            </Card>
        </div>
    );
};

export default Generate;
