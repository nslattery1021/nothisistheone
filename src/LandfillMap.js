import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Accordion, Flex, Badge, Divider, Drawer, Button, Group, Modal, Timeline, Text, Loader, Center, Menu, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDots, IconGaugeFilled, IconListDetails, IconTool, IconCheck } from '@tabler/icons-react';
import moment from 'moment';

import { getLandfills, gasWellsByLandfillsID, listServiceTypes, devicesByLandfillsID, servicesByDevicesID } from './graphql/queries';
import { createGasWells, updateGasWells, createService, updateService, deleteService } from './graphql/mutations';
import { onCreateGasWells, onUpdateGasWells, onDeleteGasWells, onCreateService, onUpdateService, onDeleteService } from './graphql/subscriptions';
import { getCurrentUser, fetchUserAttributes } from 'aws-amplify/auth';

import AddGasWell from './AddGasWell';
import InstallationModal from './InstallationModal';
import GoogleMapComponent from './GoogleMapComponent'; // Ensure correct import path
import ServiceRequestWindow from './ServiceRequestWindow'; // Ensure correct import path
import Filters from './Filters'; // Ensure correct import path

import { Icon } from 'semantic-ui-react';

async function currentAuthenticatedUser() {
  try {
    const { username, userId, signInDetails } = await getCurrentUser();
   
    return userId;
    
  } catch (err) {
    console.log(err);
    return null;
  }
}

const LandfillMap = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [gasWells, setGasWells] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [openAccordion, setOpenAccordion] = useState(['incomplete']);
  const [drawerContent, setDrawerContent] = useState('');
  const [selectedGasWell, setSelectedGasWell] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeContent, setActiveContent] = useState('');
  const [activeContentTitle, setActiveContentTitle] = useState('');
  const [serviceTypes, setServiceTypes] = useState(null);
  const [selectedSubtypes, setSelectedSubtypes] = useState([
    'Above Surface','Subsurface','Riser','2" Well' ,'3" Well' 
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState({});

  const filteredGasWells = gasWells
  .filter(well => selectedSubtypes.includes(well.subtype))
  .filter(function(well) {
    if(selectedPriorities.length == 0){
      return well;
    } else {
      if(devices[well.gasWellsDevicesId]?.Services?.items.length > 0){
        if(devices[well.gasWellsDevicesId]?.Services?.items.some(serv => selectedPriorities.includes(serv.priority))){
          return well;
        }
        // console.log(devices[well.gasWellsDevicesId]?.Services?.items.some(serv => selectedPriorities.includes(serv.priority)))
        
      }
    }
    
  });

  const handleButtonClick = (content) => {
    console.log("Gas Well Test",selectedGasWell)
    setDrawerContent(content);
    open()
  };

  const isMobile = window.innerWidth <= 768;
  const client = generateClient();
  
  useEffect(() => {
    const fetchLandfill = async () => {
      try {
        const landfillData = await client.graphql({
            query: getLandfills,
            variables: { id: id }
        });
        // document.title = landfill.name;
        setLandfill(landfillData.data.getLandfills);

        const gasWellsData = await client.graphql({
            query: gasWellsByLandfillsID,
            variables: { landfillsID: id }
        });

        const gasWells = gasWellsData.data.gasWellsByLandfillsID.items;

        setGasWells(gasWells);
        fetchDevices();
      } catch (error) {
        console.error('Error fetching gaswells:', error);
      }
    };

    fetchLandfill();

    const fetchServiceTypes = async () => {
      try {
        const serviceTypeData = await client.graphql({ query: listServiceTypes });
        // document.title = landfill.name;
        const allServiceTypes = serviceTypeData.data.listServiceTypes.items.map(servType => ({ "value": servType.id, "label": servType.name, ...servType }))

        setServiceTypes(allServiceTypes);
        
      } catch (error) {
        console.error('Error fetching gaswells:', error);
      }
    };

    fetchServiceTypes();

    const createSub = client.graphql({
      query: onCreateGasWells,
      }).subscribe({
      next: (eventData) => {
          console.log("Created New GasWell",eventData)
        const newEntry = eventData.data.onCreateGasWells;
        console.log(newEntry)
        if (newEntry.landfillsID === id) {
          setGasWells((prevGasWells) => [...prevGasWells, newEntry]);
        }
      }
    });
    
    const updateSub = client.graphql({
      query: onUpdateGasWells
    }).subscribe({
      next: (eventData) => {
          console.log("Updated New GasWell",eventData)
  
        const updatedEntry = eventData.data.onUpdateGasWells;
        setGasWells((prevGasWells) =>
          prevGasWells.map((gasWell) =>
              gasWell.id === updatedEntry.id ? updatedEntry : gasWell
          )
        );
      }
    });
    
    const deleteSub = client.graphql({
      query: onDeleteGasWells
    }).subscribe({
      next: (eventData) => {
          console.log("Deleted New GasWell",eventData)
  
        const deletedEntry = eventData.data.onDeleteGasWells.id;
        setGasWells((prevGasWells) =>
          prevGasWells.filter((gasWell) => gasWell.id !== deletedEntry)
        );
      }
    });

    const createServiceSub = client.graphql({
      query: onCreateService,
  }).subscribe({
    next: (eventData) => {
      console.log('eventData',eventData)
      const newService = eventData.data.onCreateService;
      if(Object.keys(devices).includes(newService.devicesID)){
        updateServices(newService, 'create');
      }
    }
  });
 
  const updateServiceSub = client.graphql({
      query: onUpdateService,
  }).subscribe({
    next: (eventData) => {
      console.log('eventData',eventData)
      const updatedService = eventData.data.onUpdateService;

      if(Object.keys(devices).includes(updatedService.devicesID)){
        updateServices(updatedService, 'update');
      }
    }
  });

  const deleteServiceSub = client.graphql({
      query: onDeleteService,
  }).subscribe({
    next: (eventData) => {
      const deletedService = eventData.data.onDeleteService;
      if(Object.keys(devices).includes(deletedService.devicesID)){
        updateServices(deletedService, 'delete');
      }
    }
  });

  return () => {
    createSub.unsubscribe();
    updateSub.unsubscribe();
    deleteSub.unsubscribe();
    createServiceSub.unsubscribe();
    updateServiceSub.unsubscribe();
    deleteServiceSub.unsubscribe();
  };
}, [id]);

  const fetchDevices = async () => {
    try {
        const deviceData = await client.graphql({
            query: devicesByLandfillsID,
            variables: { landfillsID: id }
        });
        console.log("Devices",deviceData.data.devicesByLandfillsID.items)
        let newDeviceArray = deviceData.data.devicesByLandfillsID.items.reduce((acc, obj) => {
          acc[obj.id] = obj;
          return acc;
        }, {});
        console.log("New Devices",newDeviceArray)
        
        setDevices(newDeviceArray);
        console.log(Object.keys(newDeviceArray))
      } catch (err) {
        console.error('Error fetching devices:', err);
      }
   
  };

  const updateServices = (service, action) => {

    setDevices(prevServices => {
      const updatedServices = { ...prevServices };
      if(updatedServices[service.devicesID]){
        switch (action) {
          case 'create':
            if (!updatedServices[service.devicesID].Services.items) {
              updatedServices[service.devicesID].Services.items = [];
            }
            updatedServices[service.devicesID].Services.items.push(service);
            break;
          case 'update':
            updatedServices[service.devicesID].Services.items = updatedServices[service.devicesID].Services.items.map(s => s.id === service.id ? service : s);
            break;
          case 'delete':
            updatedServices[service.devicesID].Services.items = updatedServices[service.devicesID].Services.items.filter(s => s.id !== service.id);
            break;
          default:
            break;
        }
      } else {
        console.log('Service request from another landfill')
      }
      return updatedServices;
    });
  };
   
  

  const handleGasWellSelect = (gasWellId) => {
    console.log('selected properly',gasWellId.id)

    setSelectedGasWell(gasWells.find(gw => gw.id == gasWellId.id));
  };

  if (!landfill) {
    return <Center style={{padding: '1rem', }}><Loader color="blue" /></Center>;
  }

  const ServiceList = ({ selectedGasWell, isComplete }) => {
    console.log(selectedGasWell, isComplete)
    if (!selectedGasWell || !devices[selectedGasWell.gasWellsDevicesId].Services) {
        return <p>No gas well selected or no services available.</p>;
      }
    

      // console.log(devices[selectedGasWell.gasWellsDevicesId]?.Services.items)
      const allServices = devices[selectedGasWell.gasWellsDevicesId]?.Services.items
      .filter(serv => serv.isComplete == isComplete)
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt));

      const status = isComplete ? 'completed' : 'incomplete';
      return (
        <div>
          
          {allServices.length > 0 ? (
              <Flex 
              gap="sm"
              direction="column">
              {allServices.map(service => (
              
                  <Flex 
                  gap="md"
                  justify="flex-start"
                  align="flex-start"
                  direction="row"
                  key={service.id}
                  style={{cursor: 'pointer'}}
                  onClick={() => {
                      setSelectedDevice(devices[selectedGasWell.gasWellsDevicesId]); 
                      setSelectedService(service); 
                      handleOpeningModal({modalName: 'serviceRequest', modalTitle: 'Edit Service Request'});
                    }}>
                      <Badge
                      color={`var(--apis-${service.priority == "High" ? 'red' : (service.priority == "Medium" ? 'orange' : 'yellow')}-500)` }>{service.priority == "Medium" ? "Med" : service.priority}</Badge>
                      <div>
                      <Text style={{lineHeight: '1'}}>{service.title}</Text>
                      <Text color="dimmed" size="xs">{service.userId ? `Added by ${service.userId} ` : ``}at {moment(service.createdAt).format('l h:mm a')}</Text>
                      </div>
                    </Flex>
                 
                    // <Timeline.Item 
                    
                    // key={service.id}
                    // lineActive={true} 
                    // active={true}
                    // radius='sm' 
                    // color={`var(--apis-${service.priority == "High" ? 'red' : (service.priority == "Medium" ? 'orange' : 'yellow')}-500)` } 
                    // // bullet={<IconTool color={`var(--apis-${service.priority == "High" ? 'red' : (service.priority == "Medium" ? 'orange' : 'yellow')}-500)`} size={16} />} 
                    // bullet={<Text size="xs" style={{fontWeight: '700'}} >{service.priority == "Medium" ? "Med" : service.priority}</Text>} 
                    // title={service.title}>
                    //   <Text color="dimmed" size="xs">Added by {moment(service.createdAt).format('l h:mm a')}</Text>
                    // </Timeline.Item>
              ))}
             </Flex>
          ) : (
            <p style={{color: 'var(--apis-gray-700)', fontSize: '0.85rem'}}>No {status} services found.</p>
          )}
        </div>
      );
};


const deleteServiceRequest = async (service) => {

  if(window.confirm('Are you sure you want to delete this service request?')){

  try {
    const result = await client.graphql({
      query: deleteService,
      variables: { input: {
        "id": service.id
      } }
    });
    
notifications.show({
  id: 'success-delete-service',
  withCloseButton: true,
  autoClose: 5000,
  title: 'Service Request Deleted!',
  message: `'${service.title}' has been deleted.`,
  icon: <IconCheck />,
  color: 'red'
});
    closeModal();
  } catch (error) {
    console.error('Error deleting service:', error);
  }

}
}
const handleService = async (newService) => {
  const userId = await currentAuthenticatedUser();
console.log('userId',userId)
  const isEdit = !!newService.id;
  const query = isEdit ? updateService : createService;
  const variables = {
    input: {
      ...(isEdit && { id: newService.id }), // Only include id if it's an edit
      title: newService.title,
      completedNotes: newService.completedNotes ?? "", // Make sure to handle notes if present
      isComplete: newService.isComplete ?? false,
      priority: newService.priority,
      devicesID: newService.devicesID,
      servicetypesID: newService.servicetypesID,
      ...(!isEdit && { userId: userId }),
      
    }
  };
 

  try {
    const result = await client.graphql({ query: query, variables: variables });

    const message = isEdit
      ? `Service request '${newService.title}' has been updated.`
      : `New service request '${newService.title}' has been added.`;

    notifications.show({
      id: 'service-action-success',
      withCloseButton: true,
      autoClose: 5000,
      title: isEdit ? 'Service Request Updated!' : 'New Service Request Added!',
      message,
      icon: <IconCheck />,
      color: 'green'
    });
    closeModal();
  } catch (error) {
    console.error(`Error ${isEdit ? 'updating' : 'adding'} service:`, error);
  }
};


const handleAddGasWell = async (newGasWell) => {
  try {
    const result = await client.graphql({
      query: createGasWells,
      variables: { input: newGasWell }
    });

    notifications.show({
      id: 'success-adding-gas-wells',
      withCloseButton: true,
      autoClose: 5000,
      title: 'New Gas Well Added!',
      message: `${newGasWell.gasWellName} has been added.`,
      icon: <IconCheck />,
      color: 'green'
    });
    // setGasWells((prevGasWells) => [...prevGasWells, result.data.createGasWells]);
    closeModal();
  } catch (error) {
    console.error('Error adding gas well:', error);
  }
};


const handleEditGasWell = async (newGasWell) => {

  try {
    const result = await client.graphql({
      query: updateGasWells,
      variables: { input: newGasWell }
    });


notifications.show({
  id: 'success-updating-gas-wells',
  withCloseButton: true,
  autoClose: 5000,
  title: `Gas Well has been updated!`,
  message: `${newGasWell.gasWellName} has been updated.`,
  icon: <IconCheck />,
  color: 'green'
});
    // setGasWells((prevGasWells) => [...prevGasWells, result.data.createGasWells]);
    closeModal(); 
  } catch (error) {
    console.error('Error updating gas well:', error);
  }
};

const renderModals = () => {
  switch (activeContent) {
    case 'installation':
      return (
        <InstallationModal onSubmit={handleAddGasWell} landfillsID={id} gasWell={selectedGasWell}/>
      );
    case 'addGasWell':
      return (
        <AddGasWell onSubmit={handleAddGasWell} landfillsID={id}/>
      );
    case 'serviceRequest':
      return (
        <ServiceRequestWindow 
        onSubmit={handleService} 
        service={selectedService} 
        devicesID={selectedDevice.id} 
        serviceTypes={serviceTypes}
        deleteServiceRequest={deleteServiceRequest}/>
      );
    case 'editGasWell':
        return (
          <AddGasWell onSubmit={handleEditGasWell} landfillsID={id} gasWell={selectedGasWell}/>
        );
        case 'filters':
          return (
            <Filters 
            selectedSubtypes={selectedSubtypes} 
            setSelectedSubtypes={setSelectedSubtypes} 
            selectedPriorities={selectedPriorities} 
            setSelectedPriorities={setSelectedPriorities} 
            closeModal={closeModal}/>
          );
    default:
      return <div style={{ padding: '0.75rem' }}>Select an option from the menu.</div>;
  }
};

const handleOpeningModal = ({ modalName, modalTitle }) => {


  setActiveContent(modalName); 
  setActiveContentTitle(modalTitle); 
  openModal();
}

  return (
    <>
  <Modal title={activeContentTitle} zIndex={10} opened={openedModal} onClose={closeModal}>
    {renderModals()}
  </Modal>
 
  <div>
      <Drawer zIndex={9} size={isMobile ? "80%" : "30%"} position="right" title="Service Requests for" opened={opened} onClose={close} >
      {selectedGasWell && devices[selectedGasWell.gasWellsDevicesId] && (
          <div>
            <div key={selectedGasWell.gasWellsDevicesId}>
                
                <div style={{
                  fontSize: '18px'
                }}>
                    <b>{selectedGasWell.gasWellName}</b>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'gray'
                }}>
                    {devices[selectedGasWell.gasWellsDevicesId].serialNum}
                </div>
            </div>
            <Divider style={{ margin: '1rem 0'}}/>
            <Group justify="flex-end">
              <Button 
              onClick={() => {
                setSelectedDevice(devices[selectedGasWell.gasWellsDevicesId]); 
                setSelectedService(null); 
                handleOpeningModal({modalName: 'serviceRequest', modalTitle: 'Add Service Request'});
                }}>Add Service Request</Button>
              <Menu shadow="md">
                <Menu.Target>
                  <Button style={{padding: '0 0.25rem'}} variant="light">
                    <IconDots />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>More Options</Menu.Label>
                  <Menu.Item>
                  <div style={{
                      display: 'flex',
                      gap: '0.65rem',
                      justifyContent: 'flex-start',
                      alignItems: 'center'
                    }}>
                  <Icon name='tachometer alternate' />
                    CalGas
                    </div>
                  </Menu.Item>
                  <Menu.Item>
                    <div style={{
                      display: 'flex',
                      gap: '0.95rem',
                      justifyContent: 'flex-start',

                      alignItems: 'center'
                    }}>
                      <div style={{
                        backgroundColor: 'black', 
                        mask: `url(/valve-icon.svg) no-repeat center / contain`,
                        WebkitMask: `url(/valve-icon.svg) no-repeat center / contain`,
                        height: '18px',
                        width: '14px',
                      }}></div>
                      QED Valve
                    </div>
                  
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
             <div style={{ margin: '1rem 0'}}>
              <Accordion multiple onChange={setOpenAccordion}>
                <Accordion.Item style={{borderBottom: '0'}} value={"incomplete"}>
                  <Accordion.Control style={{borderBottom: '1px solid var(--apis-gray-200)'}}>To Do</Accordion.Control>
                  <Accordion.Panel style={{paddingTop: '0.5rem'}}>
                    <ServiceList selectedGasWell={selectedGasWell} isComplete={false}/>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item style={{borderBottom: '0'}} value={"completed"}>
                  <Accordion.Control style={{borderBottom: '1px solid var(--apis-gray-200)'}}>History</Accordion.Control>
                  <Accordion.Panel style={{paddingTop: '0.5rem'}}>
                    <ServiceList selectedGasWell={selectedGasWell} isComplete={true}/>

                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
             
             </div>
                
          </div>
        )}
      </Drawer>

      <div style={{padding: "1rem", display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
        <h3 style={{margin: '0'}}>{landfill.name}</h3>

        <Link to={`/profile/${id}`}>
                <ActionIcon variant="transparent" aria-label="Settings">
                    <IconListDetails style={{ width: '1.2rem', height: '1.2rem' }} stroke={1.5} />
                </ActionIcon>
                
                </Link>
        </div>
        <div style={{position: 'absolute', top: '110px', height: '80%', width: '100%'}}>
          <GoogleMapComponent           
          openDrawer={handleButtonClick}
          handleGasWellSelect={handleGasWellSelect}
          lat={landfill.lat} 
          lng={landfill.lng} 
          landfillId={id}
          gasWells={filteredGasWells}
          allDevices={devices}
          setModalWindow={handleOpeningModal}
          />
        </div>
        
    </div>
    </>
      
    
  );

};

export default LandfillMap;
