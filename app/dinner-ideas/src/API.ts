/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateTodoInput = {
  id?: string | null;
  name: string;
  description?: string | null;
};

export type ModelTodoConditionInput = {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelTodoConditionInput | null> | null;
  or?: Array<ModelTodoConditionInput | null> | null;
  not?: ModelTodoConditionInput | null;
};

export type ModelStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
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
  ne?: number | null;
  eq?: number | null;
  le?: number | null;
  lt?: number | null;
  ge?: number | null;
  gt?: number | null;
  between?: Array<number | null> | null;
};

export type Todo = {
  __typename: "Todo";
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UpdateTodoInput = {
  id: string;
  name?: string | null;
  description?: string | null;
};

export type DeleteTodoInput = {
  id: string;
};

export type CreateFoodItemInput = {
  id?: string | null;
  name: string;
  description: string;
};

export type ModelFoodItemConditionInput = {
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelFoodItemConditionInput | null> | null;
  or?: Array<ModelFoodItemConditionInput | null> | null;
  not?: ModelFoodItemConditionInput | null;
};

export type FoodItem = {
  __typename: "FoodItem";
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateFoodItemInput = {
  id: string;
  name?: string | null;
  description?: string | null;
};

export type DeleteFoodItemInput = {
  id: string;
};

export type ModelTodoFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelTodoFilterInput | null> | null;
  or?: Array<ModelTodoFilterInput | null> | null;
  not?: ModelTodoFilterInput | null;
};

export type ModelIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  attributeExists?: boolean | null;
  attributeType?: ModelAttributeTypes | null;
  size?: ModelSizeInput | null;
};

export type ModelTodoConnection = {
  __typename: "ModelTodoConnection";
  items: Array<Todo | null>;
  nextToken?: string | null;
};

export type ModelFoodItemFilterInput = {
  id?: ModelIDInput | null;
  name?: ModelStringInput | null;
  description?: ModelStringInput | null;
  and?: Array<ModelFoodItemFilterInput | null> | null;
  or?: Array<ModelFoodItemFilterInput | null> | null;
  not?: ModelFoodItemFilterInput | null;
};

export type ModelFoodItemConnection = {
  __typename: "ModelFoodItemConnection";
  items: Array<FoodItem | null>;
  nextToken?: string | null;
};

export type ModelSubscriptionTodoFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionTodoFilterInput | null> | null;
  or?: Array<ModelSubscriptionTodoFilterInput | null> | null;
};

export type ModelSubscriptionIDInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionStringInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
  in?: Array<string | null> | null;
  notIn?: Array<string | null> | null;
};

export type ModelSubscriptionFoodItemFilterInput = {
  id?: ModelSubscriptionIDInput | null;
  name?: ModelSubscriptionStringInput | null;
  description?: ModelSubscriptionStringInput | null;
  and?: Array<ModelSubscriptionFoodItemFilterInput | null> | null;
  or?: Array<ModelSubscriptionFoodItemFilterInput | null> | null;
};

export type CreateTodoMutationVariables = {
  input: CreateTodoInput;
  condition?: ModelTodoConditionInput | null;
};

export type CreateTodoMutation = {
  createTodo?: {
    __typename: "Todo";
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateTodoMutationVariables = {
  input: UpdateTodoInput;
  condition?: ModelTodoConditionInput | null;
};

export type UpdateTodoMutation = {
  updateTodo?: {
    __typename: "Todo";
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteTodoMutationVariables = {
  input: DeleteTodoInput;
  condition?: ModelTodoConditionInput | null;
};

export type DeleteTodoMutation = {
  deleteTodo?: {
    __typename: "Todo";
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type CreateFoodItemMutationVariables = {
  input: CreateFoodItemInput;
  condition?: ModelFoodItemConditionInput | null;
};

export type CreateFoodItemMutation = {
  createFoodItem?: {
    __typename: "FoodItem";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type UpdateFoodItemMutationVariables = {
  input: UpdateFoodItemInput;
  condition?: ModelFoodItemConditionInput | null;
};

export type UpdateFoodItemMutation = {
  updateFoodItem?: {
    __typename: "FoodItem";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type DeleteFoodItemMutationVariables = {
  input: DeleteFoodItemInput;
  condition?: ModelFoodItemConditionInput | null;
};

export type DeleteFoodItemMutation = {
  deleteFoodItem?: {
    __typename: "FoodItem";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type GetTodoQueryVariables = {
  id: string;
};

export type GetTodoQuery = {
  getTodo?: {
    __typename: "Todo";
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListTodosQueryVariables = {
  filter?: ModelTodoFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListTodosQuery = {
  listTodos?: {
    __typename: "ModelTodoConnection";
    items: Array<{
      __typename: "Todo";
      id: string;
      name: string;
      description?: string | null;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type GetFoodItemQueryVariables = {
  id: string;
};

export type GetFoodItemQuery = {
  getFoodItem?: {
    __typename: "FoodItem";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type ListFoodItemsQueryVariables = {
  filter?: ModelFoodItemFilterInput | null;
  limit?: number | null;
  nextToken?: string | null;
};

export type ListFoodItemsQuery = {
  listFoodItems?: {
    __typename: "ModelFoodItemConnection";
    items: Array<{
      __typename: "FoodItem";
      id: string;
      name: string;
      description: string;
      createdAt: string;
      updatedAt: string;
    } | null>;
    nextToken?: string | null;
  } | null;
};

export type OnCreateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null;
};

export type OnCreateTodoSubscription = {
  onCreateTodo?: {
    __typename: "Todo";
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null;
};

export type OnUpdateTodoSubscription = {
  onUpdateTodo?: {
    __typename: "Todo";
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteTodoSubscriptionVariables = {
  filter?: ModelSubscriptionTodoFilterInput | null;
};

export type OnDeleteTodoSubscription = {
  onDeleteTodo?: {
    __typename: "Todo";
    id: string;
    name: string;
    description?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnCreateFoodItemSubscriptionVariables = {
  filter?: ModelSubscriptionFoodItemFilterInput | null;
};

export type OnCreateFoodItemSubscription = {
  onCreateFoodItem?: {
    __typename: "FoodItem";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnUpdateFoodItemSubscriptionVariables = {
  filter?: ModelSubscriptionFoodItemFilterInput | null;
};

export type OnUpdateFoodItemSubscription = {
  onUpdateFoodItem?: {
    __typename: "FoodItem";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};

export type OnDeleteFoodItemSubscriptionVariables = {
  filter?: ModelSubscriptionFoodItemFilterInput | null;
};

export type OnDeleteFoodItemSubscription = {
  onDeleteFoodItem?: {
    __typename: "FoodItem";
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  } | null;
};
