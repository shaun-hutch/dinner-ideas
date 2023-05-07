/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateFoodItemInput = {
  id?: string | null,
  name: string,
  description: string,
  image: string,
};

export type ModelFoodItemConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelFoodItemConditionInput | null > | null,
  or?: Array< ModelFoodItemConditionInput | null > | null,
  not?: ModelFoodItemConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type FoodItem = {
  __typename: "FoodItem",
  id: string,
  name: string,
  description: string,
  image: string,
  createdAt: string,
  updatedAt: string,
  owner?: string | null,
};

export type UpdateFoodItemInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  image?: string | null,
};

export type DeleteFoodItemInput = {
  id: string,
};

export type ModelFoodItemFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelFoodItemFilterInput | null > | null,
  or?: Array< ModelFoodItemFilterInput | null > | null,
  not?: ModelFoodItemFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelFoodItemConnection = {
  __typename: "ModelFoodItemConnection",
  items:  Array<FoodItem | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionFoodItemFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  name?: ModelSubscriptionStringInput | null,
  description?: ModelSubscriptionStringInput | null,
  image?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionFoodItemFilterInput | null > | null,
  or?: Array< ModelSubscriptionFoodItemFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type CreateFoodItemMutationVariables = {
  input: CreateFoodItemInput,
  condition?: ModelFoodItemConditionInput | null,
};

export type CreateFoodItemMutation = {
  createFoodItem?:  {
    __typename: "FoodItem",
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type UpdateFoodItemMutationVariables = {
  input: UpdateFoodItemInput,
  condition?: ModelFoodItemConditionInput | null,
};

export type UpdateFoodItemMutation = {
  updateFoodItem?:  {
    __typename: "FoodItem",
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type DeleteFoodItemMutationVariables = {
  input: DeleteFoodItemInput,
  condition?: ModelFoodItemConditionInput | null,
};

export type DeleteFoodItemMutation = {
  deleteFoodItem?:  {
    __typename: "FoodItem",
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type GetFoodItemQueryVariables = {
  id: string,
};

export type GetFoodItemQuery = {
  getFoodItem?:  {
    __typename: "FoodItem",
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type ListFoodItemsQueryVariables = {
  filter?: ModelFoodItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListFoodItemsQuery = {
  listFoodItems?:  {
    __typename: "ModelFoodItemConnection",
    items:  Array< {
      __typename: "FoodItem",
      id: string,
      name: string,
      description: string,
      image: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateFoodItemSubscriptionVariables = {
  filter?: ModelSubscriptionFoodItemFilterInput | null,
  owner?: string | null,
};

export type OnCreateFoodItemSubscription = {
  onCreateFoodItem?:  {
    __typename: "FoodItem",
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnUpdateFoodItemSubscriptionVariables = {
  filter?: ModelSubscriptionFoodItemFilterInput | null,
  owner?: string | null,
};

export type OnUpdateFoodItemSubscription = {
  onUpdateFoodItem?:  {
    __typename: "FoodItem",
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};

export type OnDeleteFoodItemSubscriptionVariables = {
  filter?: ModelSubscriptionFoodItemFilterInput | null,
  owner?: string | null,
};

export type OnDeleteFoodItemSubscription = {
  onDeleteFoodItem?:  {
    __typename: "FoodItem",
    id: string,
    name: string,
    description: string,
    image: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
  } | null,
};
