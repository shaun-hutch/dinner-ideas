// @vitest-environment jsdom
import { test, expect } from 'vitest';
import { totalTime, foodTagListItems, componentKey } from '../helpers/componentHelpers';
import { FoodTag } from '../models/FoodTag';
import { FoodTagLabel } from '../models/Constants';

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
