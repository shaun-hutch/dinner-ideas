/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getFoodItem = /* GraphQL */ `
  query GetFoodItem($id: ID!) {
    getFoodItem(id: $id) {
      id
      name
      description
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listFoodItems = /* GraphQL */ `
  query ListFoodItems(
    $filter: ModelFoodItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFoodItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
