/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createDevices = /* GraphQL */ `
  mutation CreateDevices(
    $input: CreateDevicesInput!
    $condition: ModelDevicesConditionInput
  ) {
    createDevices(input: $input, condition: $condition) {
      id
      macAddress
      deviceName
      iccid
      serialNum
      deviceType
      landfillsID
      flowMeter
      restrictionSize
      pipeSize
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDevices = /* GraphQL */ `
  mutation UpdateDevices(
    $input: UpdateDevicesInput!
    $condition: ModelDevicesConditionInput
  ) {
    updateDevices(input: $input, condition: $condition) {
      id
      macAddress
      deviceName
      iccid
      serialNum
      deviceType
      landfillsID
      flowMeter
      restrictionSize
      pipeSize
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDevices = /* GraphQL */ `
  mutation DeleteDevices(
    $input: DeleteDevicesInput!
    $condition: ModelDevicesConditionInput
  ) {
    deleteDevices(input: $input, condition: $condition) {
      id
      macAddress
      deviceName
      iccid
      serialNum
      deviceType
      landfillsID
      flowMeter
      restrictionSize
      pipeSize
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createGasWells = /* GraphQL */ `
  mutation CreateGasWells(
    $input: CreateGasWellsInput!
    $condition: ModelGasWellsConditionInput
  ) {
    createGasWells(input: $input, condition: $condition) {
      id
      gasWellName
      lat
      lng
      type
      subtype
      landfillsID
      Devices {
        id
        macAddress
        deviceName
        iccid
        serialNum
        deviceType
        landfillsID
        flowMeter
        restrictionSize
        pipeSize
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      gasWellsDevicesId
      __typename
    }
  }
`;
export const updateGasWells = /* GraphQL */ `
  mutation UpdateGasWells(
    $input: UpdateGasWellsInput!
    $condition: ModelGasWellsConditionInput
  ) {
    updateGasWells(input: $input, condition: $condition) {
      id
      gasWellName
      lat
      lng
      type
      subtype
      landfillsID
      Devices {
        id
        macAddress
        deviceName
        iccid
        serialNum
        deviceType
        landfillsID
        flowMeter
        restrictionSize
        pipeSize
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      gasWellsDevicesId
      __typename
    }
  }
`;
export const deleteGasWells = /* GraphQL */ `
  mutation DeleteGasWells(
    $input: DeleteGasWellsInput!
    $condition: ModelGasWellsConditionInput
  ) {
    deleteGasWells(input: $input, condition: $condition) {
      id
      gasWellName
      lat
      lng
      type
      subtype
      landfillsID
      Devices {
        id
        macAddress
        deviceName
        iccid
        serialNum
        deviceType
        landfillsID
        flowMeter
        restrictionSize
        pipeSize
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      gasWellsDevicesId
      __typename
    }
  }
`;
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
      GasWells {
        nextToken
        __typename
      }
      Devices {
        nextToken
        __typename
      }
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
      GasWells {
        nextToken
        __typename
      }
      Devices {
        nextToken
        __typename
      }
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
      GasWells {
        nextToken
        __typename
      }
      Devices {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
