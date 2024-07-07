/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createServiceTypes = /* GraphQL */ `
  mutation CreateServiceTypes(
    $input: CreateServiceTypesInput!
    $condition: ModelServiceTypesConditionInput
  ) {
    createServiceTypes(input: $input, condition: $condition) {
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
export const updateServiceTypes = /* GraphQL */ `
  mutation UpdateServiceTypes(
    $input: UpdateServiceTypesInput!
    $condition: ModelServiceTypesConditionInput
  ) {
    updateServiceTypes(input: $input, condition: $condition) {
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
export const deleteServiceTypes = /* GraphQL */ `
  mutation DeleteServiceTypes(
    $input: DeleteServiceTypesInput!
    $condition: ModelServiceTypesConditionInput
  ) {
    deleteServiceTypes(input: $input, condition: $condition) {
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
export const createService = /* GraphQL */ `
  mutation CreateService(
    $input: CreateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    createService(input: $input, condition: $condition) {
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
export const updateService = /* GraphQL */ `
  mutation UpdateService(
    $input: UpdateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    updateService(input: $input, condition: $condition) {
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
export const deleteService = /* GraphQL */ `
  mutation DeleteService(
    $input: DeleteServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    deleteService(input: $input, condition: $condition) {
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
