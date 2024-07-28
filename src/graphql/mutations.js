/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createJobTech = /* GraphQL */ `
  mutation CreateJobTech(
    $input: CreateJobTechInput!
    $condition: ModelJobTechConditionInput
  ) {
    createJobTech(input: $input, condition: $condition) {
      id
      technicianId
      appointmentID
      dispatchTime
      arrivalTime
      endTime
      Appointment {
        id
        startTime
        endTime
        status
        jobID
        userId
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateJobTech = /* GraphQL */ `
  mutation UpdateJobTech(
    $input: UpdateJobTechInput!
    $condition: ModelJobTechConditionInput
  ) {
    updateJobTech(input: $input, condition: $condition) {
      id
      technicianId
      appointmentID
      dispatchTime
      arrivalTime
      endTime
      Appointment {
        id
        startTime
        endTime
        status
        jobID
        userId
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteJobTech = /* GraphQL */ `
  mutation DeleteJobTech(
    $input: DeleteJobTechInput!
    $condition: ModelJobTechConditionInput
  ) {
    deleteJobTech(input: $input, condition: $condition) {
      id
      technicianId
      appointmentID
      dispatchTime
      arrivalTime
      endTime
      Appointment {
        id
        startTime
        endTime
        status
        jobID
        userId
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createAppointment = /* GraphQL */ `
  mutation CreateAppointment(
    $input: CreateAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    createAppointment(input: $input, condition: $condition) {
      id
      startTime
      endTime
      status
      jobID
      JobTeches {
        nextToken
        __typename
      }
      userId
      Job {
        id
        jobName
        description
        status
        userId
        landfillsID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateAppointment = /* GraphQL */ `
  mutation UpdateAppointment(
    $input: UpdateAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    updateAppointment(input: $input, condition: $condition) {
      id
      startTime
      endTime
      status
      jobID
      JobTeches {
        nextToken
        __typename
      }
      userId
      Job {
        id
        jobName
        description
        status
        userId
        landfillsID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteAppointment = /* GraphQL */ `
  mutation DeleteAppointment(
    $input: DeleteAppointmentInput!
    $condition: ModelAppointmentConditionInput
  ) {
    deleteAppointment(input: $input, condition: $condition) {
      id
      startTime
      endTime
      status
      jobID
      JobTeches {
        nextToken
        __typename
      }
      userId
      Job {
        id
        jobName
        description
        status
        userId
        landfillsID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createJob = /* GraphQL */ `
  mutation CreateJob(
    $input: CreateJobInput!
    $condition: ModelJobConditionInput
  ) {
    createJob(input: $input, condition: $condition) {
      id
      jobName
      description
      status
      Appointments {
        nextToken
        __typename
      }
      userId
      landfillsID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateJob = /* GraphQL */ `
  mutation UpdateJob(
    $input: UpdateJobInput!
    $condition: ModelJobConditionInput
  ) {
    updateJob(input: $input, condition: $condition) {
      id
      jobName
      description
      status
      Appointments {
        nextToken
        __typename
      }
      userId
      landfillsID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteJob = /* GraphQL */ `
  mutation DeleteJob(
    $input: DeleteJobInput!
    $condition: ModelJobConditionInput
  ) {
    deleteJob(input: $input, condition: $condition) {
      id
      jobName
      description
      status
      Appointments {
        nextToken
        __typename
      }
      userId
      landfillsID
      createdAt
      updatedAt
      __typename
    }
  }
`;
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
      Jobs {
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
      Jobs {
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
      Jobs {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
