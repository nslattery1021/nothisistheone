/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateServiceTypes = /* GraphQL */ `
  subscription OnCreateServiceTypes(
    $filter: ModelSubscriptionServiceTypesFilterInput
  ) {
    onCreateServiceTypes(filter: $filter) {
      id
      name
      isActive
      Services {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateServiceTypes = /* GraphQL */ `
  subscription OnUpdateServiceTypes(
    $filter: ModelSubscriptionServiceTypesFilterInput
  ) {
    onUpdateServiceTypes(filter: $filter) {
      id
      name
      isActive
      Services {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteServiceTypes = /* GraphQL */ `
  subscription OnDeleteServiceTypes(
    $filter: ModelSubscriptionServiceTypesFilterInput
  ) {
    onDeleteServiceTypes(filter: $filter) {
      id
      name
      isActive
      Services {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateService = /* GraphQL */ `
  subscription OnCreateService($filter: ModelSubscriptionServiceFilterInput) {
    onCreateService(filter: $filter) {
      id
      title
      completedNotes
      isComplete
      priority
      devicesID
      servicetypesID
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateService = /* GraphQL */ `
  subscription OnUpdateService($filter: ModelSubscriptionServiceFilterInput) {
    onUpdateService(filter: $filter) {
      id
      title
      completedNotes
      isComplete
      priority
      devicesID
      servicetypesID
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteService = /* GraphQL */ `
  subscription OnDeleteService($filter: ModelSubscriptionServiceFilterInput) {
    onDeleteService(filter: $filter) {
      id
      title
      completedNotes
      isComplete
      priority
      devicesID
      servicetypesID
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
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
      Services {
        nextToken
        __typename
      }
      userId
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
      Services {
        nextToken
        __typename
      }
      userId
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
      Services {
        nextToken
        __typename
      }
      userId
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
        userId
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
        userId
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
        userId
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
