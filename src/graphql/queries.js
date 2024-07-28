/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getJobTech = /* GraphQL */ `
  query GetJobTech($id: ID!) {
    getJobTech(id: $id) {
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
export const listJobTeches = /* GraphQL */ `
  query ListJobTeches(
    $filter: ModelJobTechFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listJobTeches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        technicianId
        appointmentID
        dispatchTime
        arrivalTime
        endTime
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const jobTechesByAppointmentID = /* GraphQL */ `
  query JobTechesByAppointmentID(
    $appointmentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelJobTechFilterInput
    $limit: Int
    $nextToken: String
  ) {
    jobTechesByAppointmentID(
      appointmentID: $appointmentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        technicianId
        appointmentID
        dispatchTime
        arrivalTime
        endTime
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAppointment = /* GraphQL */ `
  query GetAppointment($id: ID!) {
    getAppointment(id: $id) {
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
export const listAppointments = /* GraphQL */ `
  query ListAppointments(
    $filter: ModelAppointmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAppointments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        startTime
        endTime
        status
        jobID
        userId
        createdAt
        updatedAt
        Job {
          landfillsID
        }
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const appointmentsByJobID = /* GraphQL */ `
  query AppointmentsByJobID(
    $jobID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAppointmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    appointmentsByJobID(
      jobID: $jobID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getJob = /* GraphQL */ `
  query GetJob($id: ID!) {
    getJob(id: $id) {
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
export const listJobs = /* GraphQL */ `
  query ListJobs(
    $filter: ModelJobFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listJobs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const jobsByLandfillsID = /* GraphQL */ `
  query JobsByLandfillsID(
    $landfillsID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelJobFilterInput
    $limit: Int
    $nextToken: String
  ) {
    jobsByLandfillsID(
      landfillsID: $landfillsID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
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
      userId
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
        userId
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
        userId
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
        userId
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
      userId
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
        userId
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
        userId
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
