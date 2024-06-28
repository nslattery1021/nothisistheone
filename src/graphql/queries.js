/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getServiceTypes = /* GraphQL */ `
  query GetServiceTypes($id: ID!) {
    getServiceTypes(id: $id) {
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
export const listServiceTypes = /* GraphQL */ `
  query ListServiceTypes(
    $filter: ModelServiceTypesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServiceTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        isActive
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getService = /* GraphQL */ `
  query GetService($id: ID!) {
    getService(id: $id) {
      id
      title
      completedNotes
      isComplete
      priority
      devicesID
      servicetypesID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listServices = /* GraphQL */ `
  query ListServices(
    $filter: ModelServiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        completedNotes
        isComplete
        priority
        devicesID
        servicetypesID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const servicesByDevicesID = /* GraphQL */ `
  query ServicesByDevicesID(
    $devicesID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelServiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    servicesByDevicesID(
      devicesID: $devicesID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        completedNotes
        isComplete
        priority
        devicesID
        servicetypesID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const servicesByServicetypesID = /* GraphQL */ `
  query ServicesByServicetypesID(
    $servicetypesID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelServiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    servicesByServicetypesID(
      servicetypesID: $servicetypesID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        completedNotes
        isComplete
        priority
        devicesID
        servicetypesID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDevices = /* GraphQL */ `
  query GetDevices($id: ID!) {
    getDevices(id: $id) {
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listDevices = /* GraphQL */ `
  query ListDevices(
    $filter: ModelDevicesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDevices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const devicesByLandfillsID = /* GraphQL */ `
  query DevicesByLandfillsID(
    $landfillsID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelDevicesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    devicesByLandfillsID(
      landfillsID: $landfillsID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getGasWells = /* GraphQL */ `
  query GetGasWells($id: ID!) {
    getGasWells(id: $id) {
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
export const listGasWells = /* GraphQL */ `
  query ListGasWells(
    $filter: ModelGasWellsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGasWells(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        gasWellName
        lat
        lng
        type
        subtype
        landfillsID
        createdAt
        updatedAt
        gasWellsDevicesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const gasWellsByLandfillsID = /* GraphQL */ `
  query GasWellsByLandfillsID(
    $landfillsID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelGasWellsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    gasWellsByLandfillsID(
      landfillsID: $landfillsID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        gasWellName
        lat
        lng
        type
        subtype
        landfillsID
        Devices {
          deviceName
          serialNum
          macAddress
          deviceType
          flowMeter
          id
          iccid
          landfillsID
          updatedAt
          restrictionSize
          pipeSize
          createdAt
          Services {
            items {
              title
              completedNotes
              createdAt
              devicesID
              id
              isComplete
              priority
              updatedAt
              servicetypesID
            }
          }
        }
        createdAt
        updatedAt
        gasWellsDevicesId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
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
