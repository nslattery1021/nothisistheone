/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateDevices = /* GraphQL */ `
  subscription OnCreateDevices($filter: ModelSubscriptionDevicesFilterInput) {
    onCreateDevices(filter: $filter) {
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
export const onUpdateDevices = /* GraphQL */ `
  subscription OnUpdateDevices($filter: ModelSubscriptionDevicesFilterInput) {
    onUpdateDevices(filter: $filter) {
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
export const onDeleteDevices = /* GraphQL */ `
  subscription OnDeleteDevices($filter: ModelSubscriptionDevicesFilterInput) {
    onDeleteDevices(filter: $filter) {
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
export const onCreateGasWells = /* GraphQL */ `
  subscription OnCreateGasWells($filter: ModelSubscriptionGasWellsFilterInput) {
    onCreateGasWells(filter: $filter) {
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
export const onUpdateGasWells = /* GraphQL */ `
  subscription OnUpdateGasWells($filter: ModelSubscriptionGasWellsFilterInput) {
    onUpdateGasWells(filter: $filter) {
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
export const onDeleteGasWells = /* GraphQL */ `
  subscription OnDeleteGasWells($filter: ModelSubscriptionGasWellsFilterInput) {
    onDeleteGasWells(filter: $filter) {
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
export const onCreateLandfills = /* GraphQL */ `
  subscription OnCreateLandfills(
    $filter: ModelSubscriptionLandfillsFilterInput
  ) {
    onCreateLandfills(filter: $filter) {
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
export const onUpdateLandfills = /* GraphQL */ `
  subscription OnUpdateLandfills(
    $filter: ModelSubscriptionLandfillsFilterInput
  ) {
    onUpdateLandfills(filter: $filter) {
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
export const onDeleteLandfills = /* GraphQL */ `
  subscription OnDeleteLandfills(
    $filter: ModelSubscriptionLandfillsFilterInput
  ) {
    onDeleteLandfills(filter: $filter) {
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
