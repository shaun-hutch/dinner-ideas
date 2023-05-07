/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createFoodItem = /* GraphQL */ `
  mutation CreateFoodItem(
    $input: CreateFoodItemInput!
    $condition: ModelFoodItemConditionInput
  ) {
    createFoodItem(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const updateFoodItem = /* GraphQL */ `
  mutation UpdateFoodItem(
    $input: UpdateFoodItemInput!
    $condition: ModelFoodItemConditionInput
  ) {
    updateFoodItem(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
export const deleteFoodItem = /* GraphQL */ `
  mutation DeleteFoodItem(
    $input: DeleteFoodItemInput!
    $condition: ModelFoodItemConditionInput
  ) {
    deleteFoodItem(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
      owner
    }
  }
`;
