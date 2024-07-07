import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { Link, useParams } from 'react-router-dom';
import { Stack, List } from '@mantine/core';
import { devicesByLandfillsID, servicesByDevicesID } from './graphql/queries';
import { onCreateService, onUpdateService, onDeleteService } from './graphql/subscriptions';

const NewMap = () => {
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState({});
  const { id } = useParams();

  const client = generateClient();
  useEffect(() => {
    fetchDevices();

    const createSub = client.graphql({
        query: onCreateService,
    }).subscribe({
      next: (eventData) => {
        console.log('eventData',eventData)
        const newService = eventData.data.onCreateService;
        updateServices(newService, 'create');
      }
    });
   
    const updateSub = client.graphql({
        query: onUpdateService,
    }).subscribe({
      next: (eventData) => {
        console.log('eventData',eventData)

        const updatedService = eventData.data.onUpdateService;
        updateServices(updatedService, 'update');
      }
    });

    const deleteSub = client.graphql({
        query: onDeleteService,
    }).subscribe({
      next: (eventData) => {
        const deletedService = eventData.data.onDeleteService;
        updateServices(deletedService, 'delete');
      }
    });

    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [id]);

  const fetchDevices = async () => {
    try {
        const deviceData = await client.graphql({
            query: devicesByLandfillsID,
            variables: { landfillsID: id }
        });
        console.log("Devices",deviceData.data.devicesByLandfillsID.items)
        setDevices(deviceData.data.devicesByLandfillsID.items);
        fetchServices(devices);

      } catch (err) {
        console.error('Error fetching devices:', err);
      }
   
  };

  const fetchServices = async (devices) => {
    try {
      const servicesMap = {};
      for (const device of devices) {
        const serviceData = await client.graphql({
            query: servicesByDevicesID, 
            variables: { devicesID: device.id }});
        servicesMap[device.id] = serviceData.data.servicesByDevicesID.items;
      }
      setServices(servicesMap);
      console.log("Services",services)
    } catch (err) {
      console.log('Error fetching services:', err);
    }
  };

  const updateServices = (service, action) => {
    setServices(prevServices => {
      const updatedServices = { ...prevServices };
      switch (action) {
        case 'create':
          if (!updatedServices[service.devicesID]) {
            updatedServices[service.devicesID] = [];
          }
          updatedServices[service.devicesID].push(service);
          break;
        case 'update':
          updatedServices[service.devicesID] = updatedServices[service.devicesID].map(s => s.id === service.id ? service : s);
          break;
        case 'delete':
          updatedServices[service.devicesID] = updatedServices[service.devicesID].filter(s => s.id !== service.id);
          break;
        default:
          break;
      }
      return updatedServices;
    });
  };

  return (
    <div>
      <h1>Devices for Landfill {id}</h1>
      {devices.map(device => (
        <div key={device.id}>
          <h3>{device.deviceName}</h3>
          <ul>
            {services[device.id] && services[device.id].map(service => (
              <li key={service.id}>{service.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default NewMap;

// const NewMap = () => {
//     const [gasWells, setGasWells] = useState([]);
//     const [devices, setDevices] = useState([]);
//     const [serviceRequests, setServiceRequests] = useState({});

//     const { id } = useParams();

//   const client = generateClient();

//   useEffect(() => {
//     // Fetch existing gas wells on component mount
//     const fetchGasWells = async () => {
//       try {
//         const gasWellData = await client.graphql({
//             query: gasWellsByLandfillsID,
//             variables: { landfillsID: id }
//         });
//         console.log("Gas Wells",gasWellData.data.gasWellsByLandfillsID.items)
//         setGasWells(gasWellData.data.gasWellsByLandfillsID.items);
//       } catch (err) {
//         console.error('Error fetching gas wells:', err);
//       }
//     };
//     fetchGasWells();

//     const fetchDevices = async () => {
//         try {
//           const deviceData = await client.graphql({
//               query: devicesByLandfillsID,
//               variables: { landfillsID: id }
//           });
//           console.log("Devices",deviceData.data.devicesByLandfillsID.items)
//           setDevices(deviceData.data.devicesByLandfillsID.items);
//         } catch (err) {
//           console.error('Error fetching devices:', err);
//         }
//       };
//       fetchDevices();

//     // Set up subscriptions for gas wells, devices, and service requests
//     const gasWellSubscription = client.graphql({
//         query: onCreateGasWells,
//         }).subscribe({
//       next: (eventData) => {
//         const newEntry = eventData.data.onCreateGasWells;
//         if (newEntry.landfillsID === id) {
//             setGasWells((prevGasWells) => [...prevGasWells, newEntry]);
//           }
//       },
//     });

//     const updateGasWellSub = client.graphql({
//         query: onUpdateGasWells
//       }).subscribe({
//         next: (eventData) => {    
//           const updatedEntry = eventData.data.onUpdateGasWells;
//           setGasWells((prevGasWells) =>
//             prevGasWells.map((gasWell) =>
//                 gasWell.id === updatedEntry.id ? updatedEntry : gasWell
//             )
//           );
//         }
//       });

//     // Cleanup function to unsubscribe on component unmount
//     return () => {
//         gasWellSubscription.unsubscribe();
//         updateGasWellSub.unsubscribe();
//     };
//   }, []);

//   const fetchServiceRequests = async (deviceId) => {
//     try {
//       const serviceRequestData = await client.graphql({
//         query: servicesByDevicesID,
//         variables: { devicesID: deviceId }
//       });
//       setServiceRequests(prevRequests => ({
//         ...prevRequests,
//         [deviceId]: serviceRequestData.data.servicesByDevicesID.items
//       }));

//       console.log("Service",serviceRequestData.data.servicesByDevicesID.items)
//     } catch (err) {
//       console.error('Error fetching service requests:', err);
//     }
//   };

//   useEffect(() => {
//     devices.forEach(device => {
//       fetchServiceRequests(device.id);
//     });
//   }, [devices]);

// //   const handleAddGasWell = async (name, location) => {
// //     try {
// //       await client.graphql(graphqlOperation(createGasWell, { name, location }));
// //     } catch (err) {
// //       console.error('Error creating gas well:', err);
// //     }
// //   };

// //   const handleAddDevice = async (gasWellId, name, status) => {
// //     try {
// //       await client.graphql(createDevice, { gasWellId, name, status });
// //     } catch (err) {
// //       console.error('Error creating device:', err);
// //     }
// //   };

// //   const handleAddServiceRequest = async (deviceId, description, status) => {
// //     try {
// //       await client.graphql(createServiceRequest, { deviceId, description, status });
// //     } catch (err) {
// //       console.error('Error creating service request:', err);
// //     }
// //   };

// //   const handleUpdateServiceRequestStatus = async (id, status) => {
// //     try {
// //       await client.graphql(updateServiceRequestStatus, { id, status });
// //     } catch (err) {
// //       console.error('Error updating service request status:', err);
// //     }
// //   };

//   return (
//     <div>
//       <h3>Gas Wells</h3>
//       <Stack gap="md">
//       {gasWells.sort((a,b) => a.gasWellName.localeCompare(b.gasWellName)).map((well) => (
//         <div key={well.id}>
//           <div style={{fontSize: "1.25rem"}}>{well.gasWellName}</div>
//           {well.gasWellsDevicesId && (() => {
//               const foundDevice = devices.find(dev => dev.id === well.gasWellsDevicesId);
//             //   console.log(foundDevice);
//               if (foundDevice) {
//                 return (
//                   <div key={foundDevice.id}>
//                     <div>{foundDevice.deviceName}</div>
//                     {serviceRequests[foundDevice.id].length > 0 && 
//                     <div>
//                     <h5>Service Requests:</h5>
//                     <List>
//                         {serviceRequests[foundDevice.id].map((request) => (
//                         <List.Item key={request.id}>
//                             {request.priority} - {request.title}
//                             {/* <p>{request.title}</p>
//                             <p>Status: {request.isComplete ? 'Completed' : 'Incomplete'}</p>
//                             <p>Priority: {request.priority}</p> */}
//                             {/* <button onClick={() => handleUpdateServiceRequestStatus(request.id, 'Completed')}>Complete</button> */}
//                         </List.Item>
//                         ))}
//                     </List>
                        
//                         </div>

//                     }
//                   </div>
//                 );
//               }
//               return null;
//             })()}
//         </div>
//       ))}
//       </Stack>
//       {/* <button onClick={() => handleAddGasWell('New Gas Well', 'Location 1')}>Add Gas Well</button> */}
//     </div>
//   );
// };

// export default NewMap;
