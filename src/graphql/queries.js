/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getLandfills = /* GraphQL */ `
  query GetLandfills($id: ID!) {
    getLandfills(id: $id) {
      id
      name
      address
      city
      state
      zip
      country
      lat
      lng
      active
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLandfills = /* GraphQL */ `
  query ListLandfills(
    $filter: ModelLandfillsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLandfills(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        address
        city
        state
        zip
        country
        lat
        lng
        active
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
