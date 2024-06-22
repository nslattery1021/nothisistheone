/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLandfills = /* GraphQL */ `
  mutation CreateLandfills(
    $input: CreateLandfillsInput!
    $condition: ModelLandfillsConditionInput
  ) {
    createLandfills(input: $input, condition: $condition) {
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
export const updateLandfills = /* GraphQL */ `
  mutation UpdateLandfills(
    $input: UpdateLandfillsInput!
    $condition: ModelLandfillsConditionInput
  ) {
    updateLandfills(input: $input, condition: $condition) {
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
export const deleteLandfills = /* GraphQL */ `
  mutation DeleteLandfills(
    $input: DeleteLandfillsInput!
    $condition: ModelLandfillsConditionInput
  ) {
    deleteLandfills(input: $input, condition: $condition) {
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
