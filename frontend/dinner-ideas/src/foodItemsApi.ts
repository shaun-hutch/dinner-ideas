import { resolve } from 'path';
import React, { useEffect, useState } from 'react';
import { useReducer } from 'react';
import { FoodItem } from './models/Models';

const api = 'https://vf47fh2d73xkr2567uypgbcpc40pvhso.lambda-url.us-west-1.on.aws/';

export async function getFoodItems(weekItemId: string): Promise<FoodItem[]> {
    const response = await window.fetch(api, {
        method: 'POST',
        body: JSON.stringify({ type: 0 })
    });
    const data = await response.json();

    return data.FoodItems;
}
