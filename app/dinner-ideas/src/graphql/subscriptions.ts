/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateFoodItem = /* GraphQL */ `
  subscription OnCreateFoodItem(
    $filter: ModelSubscriptionFoodItemFilterInput
    $owner: String
  ) {
    onCreateFoodItem(filter: $filter, owner: $owner) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onUpdateFoodItem = /* GraphQL */ `
  subscription OnUpdateFoodItem(
    $filter: ModelSubscriptionFoodItemFilterInput
    $owner: String
  ) {
    onUpdateFoodItem(filter: $filter, owner: $owner) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const onDeleteFoodItem = /* GraphQL */ `
  subscription OnDeleteFoodItem(
    $filter: ModelSubscriptionFoodItemFilterInput
    $owner: String
  ) {
    onDeleteFoodItem(filter: $filter, owner: $owner) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
