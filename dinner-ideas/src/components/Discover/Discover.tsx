import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { Tag } from "primereact/tag";
import { searchMeals, importMeal } from "../../api/Api";
import { DinnerItem } from "../../models/DinnerItem";
import { FoodTagLabel } from "../../models/Constants";
import { useNavigate } from "react-router-dom";
import "./Discover.css";

const Discover: React.FC = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<DinnerItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [importing, setImporting] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const meals = await searchMeals(query.trim());
            setResults(meals);
        } catch (err) {
            console.error("Search failed:", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async (meal: DinnerItem) => {
        // Extract the original TheMealDB ID from the deterministic GUID
        const mealId = meal.id.split("-").pop()?.replace(/^0+/, "") || "";
        setImporting(meal.id);
        try {
            await importMeal(mealId);
            navigate("/");
        } catch (err) {
            console.error("Import failed:", err);
        } finally {
            setImporting(null);
        }
    };

    const itemTemplate = (item: DinnerItem) => (
        <div className="discover-result-item p-3 surface-card border-round mb-2">
            <div className="flex align-items-center justify-content-between">
                <div className="flex-1">
                    <h3 className="mt-0 mb-2">{item.name}</h3>
                    <p className="text-color-secondary mb-2">{item.description}</p>
                    <div className="flex gap-2 flex-wrap mb-2">
                        {item.tags?.map((tag: number) => (
                            <Tag key={tag} value={FoodTagLabel[tag] || String(tag)} severity="info" />
                        ))}
                    </div>
                    <span className="text-sm text-color-secondary">
                        ⏱ {item.prepTime + item.cookTime} mins · {item.ingredients?.length || 0} ingredients
                    </span>
                </div>
                <Button
                    label={importing === item.id ? "Importing..." : "Import"}
                    icon={`pi ${importing === item.id ? "pi-spin pi-spinner" : "pi-download"}`}
                    onClick={() => handleImport(item)}
                    disabled={importing === item.id}
                    raised
                    severity="success"
                />
            </div>
        </div>
    );

    return (
        <div className="discover-container">
            <Card title="Discover New Recipes">
                <div className="discover-content">
                    <p className="discover-description">
                        Search thousands of recipes from around the world and import your favourites
                        into your collection. Powered by TheMealDB.
                    </p>

                    <div className="discover-search flex gap-2 mb-4">
                        <InputText
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name (e.g., chicken, pasta, curry)..."
                            className="flex-1"
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button
                            label={loading ? "Searching..." : "Search"}
                            icon={`pi ${loading ? "pi-spin pi-spinner" : "pi-search"}`}
                            onClick={handleSearch}
                            disabled={loading || !query.trim()}
                            raised
                        />
                    </div>

                    {searched && !loading && results.length === 0 && (
                        <div className="discover-empty p-4 text-center">
                            <i className="pi pi-search text-4xl text-color-secondary mb-3" />
                            <p>No recipes found for "{query}". Try a different search term.</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="discover-results">
                            <h3>{results.length} recipe{results.length !== 1 ? "s" : ""} found</h3>
                            <DataView
                                value={results}
                                layout="list"
                                itemTemplate={itemTemplate}
                            />
                        </div>
                    )}

                    {!searched && (
                        <div className="discover-suggestions p-4 text-center">
                            <p className="text-color-secondary mb-3">
                                Try searching for ingredients or dish names like:
                            </p>
                            <div className="flex flex-wrap gap-2 justify-content-center">
                                {["chicken", "pasta", "curry", "salad", "soup", "seafood", "beef", "vegetarian"].map((s) => (
                                    <Button
                                        key={s}
                                        label={s}
                                        className="p-button-outlined p-button-sm"
                                        onClick={() => { setQuery(s); }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Discover;
