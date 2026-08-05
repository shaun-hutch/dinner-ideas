// @vitest-environment jsdom
import { test, expect } from 'vitest';
import { totalTime, foodTagListItems, componentKey, measurementLabel, formatIngredient, measurementListItems } from '../helpers/componentHelpers';
import { FoodTag } from '../models/FoodTag';
import { FoodTagLabel } from '../models/Constants';
import { Measurement } from '../models/Measurement';
import { Ingredient } from '../models/Ingredient';

test('totalTime returns "0 mins" for no arguments', () => {
    expect(totalTime()).toBe('0 mins');
});

test('totalTime returns minutes for under 60', () => {
    expect(totalTime(20, 15)).toBe('35 mins');
});

test('totalTime returns exactly "60 mins"', () => {
    expect(totalTime(30, 30)).toBe('60 mins');
});

test('totalTime formats hours correctly', () => {
    expect(totalTime(60, 30)).toBe('1 hour, 30 mins');
});

test('totalTime formats hours without remaining minutes', () => {
    expect(totalTime(60, 60)).toBe('2 hours, 0 mins');
});

test('foodTagListItems returns all tags', () => {
    const items = foodTagListItems();
    const tagCount = Object.keys(FoodTag).filter(k => isNaN(Number(k))).length;
    expect(items.length).toBe(tagCount);
});

test('foodTagListItems has correct labels', () => {
    const items = foodTagListItems();
    expect(items[FoodTag.Quick].label).toBe(FoodTagLabel[FoodTag.Quick]);
    expect(items[FoodTag.Vegetarian].label).toBe(FoodTagLabel[FoodTag.Vegetarian]);
    expect(items[FoodTag.Cheap].label).toBe(FoodTagLabel[FoodTag.Cheap]);
    expect(items[FoodTag.FamilyFriendly].label).toBe(FoodTagLabel[FoodTag.FamilyFriendly]);
});

test('componentKey generates unique keys', () => {
    const key1 = componentKey('test');
    const key2 = componentKey('test');
    expect(key1).not.toBe(key2);
});

test('componentKey includes component name', () => {
    const key = componentKey('DinnerList');
    expect(key).toContain('DinnerList');
});

// ── Measurement Label ────────────────────────────────────────────────

test('measurementLabel returns correct abbreviation for all measurements', () => {
    expect(measurementLabel(Measurement.Millilitres)).toBe('ml');
    expect(measurementLabel(Measurement.Teaspoon)).toBe('tsp');
    expect(measurementLabel(Measurement.Tablespoon)).toBe('tbsp');
    expect(measurementLabel(Measurement.Grams)).toBe('g');
    expect(measurementLabel(Measurement.Cups)).toBe('cup');
    expect(measurementLabel(Measurement.Ounces)).toBe('oz');
    expect(measurementLabel(Measurement.Pounds)).toBe('lb');
    expect(measurementLabel(Measurement.Pinch)).toBe('pinch');
    expect(measurementLabel(Measurement.ToTaste)).toBe('to taste');
    expect(measurementLabel(Measurement.Litres)).toBe('L');
    expect(measurementLabel(Measurement.Kilograms)).toBe('kg');
    expect(measurementLabel(Measurement.Slices)).toBe('slice');
    expect(measurementLabel(Measurement.Cloves)).toBe('clove');
    expect(measurementLabel(Measurement.Bunches)).toBe('bunch');
    expect(measurementLabel(Measurement.Cans)).toBe('can');
    expect(measurementLabel(Measurement.Amount)).toBe('');
});

// ── Format Ingredient ────────────────────────────────────────────────

const makeIng = (overrides: Partial<Ingredient> = {}): Ingredient => ({
    id: 'test-id',
    name: 'olive oil',
    description: '',
    measurement: Measurement.Tablespoon,
    amount: 2,
    ...overrides,
});

test('formatIngredient uses amount + measurement label', () => {
    const result = formatIngredient(makeIng({ name: 'olive oil', amount: 2, measurement: Measurement.Tablespoon }));
    expect(result).toBe('2 tbsp olive oil');
});

test('formatIngredient uses quantity when present', () => {
    const result = formatIngredient(makeIng({
        name: 'salt',
        amount: 0,
        measurement: Measurement.ToTaste,
        quantity: 'to taste'
    }));
    expect(result).toBe('to taste salt');
});

test('formatIngredient formats decimal amounts', () => {
    const result = formatIngredient(makeIng({ name: 'flour', amount: 1.5, measurement: Measurement.Cups }));
    expect(result).toBe('1.5 cup flour');
});

test('formatIngredient handles Amount measurement (no label)', () => {
    const result = formatIngredient(makeIng({ name: 'egg', amount: 2, measurement: Measurement.Amount }));
    expect(result).toBe('2 egg');
});

test('formatIngredient handles grams', () => {
    const result = formatIngredient(makeIng({ name: 'chicken', amount: 500, measurement: Measurement.Grams }));
    expect(result).toBe('500 g chicken');
});

// ── Measurement List Items ───────────────────────────────────────────

test('measurementListItems returns all measurements', () => {
    const items = measurementListItems();
    const enumCount = Object.keys(Measurement).filter(k => isNaN(Number(k))).length;
    expect(items.length).toBe(enumCount);
});

test('measurementListItems has label and value', () => {
    const items = measurementListItems();
    expect(items.length).toBeGreaterThan(0);
    items.forEach(item => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('value');
    });
});
