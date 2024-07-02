import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { useDisclosure } from '@mantine/hooks';
import { ActionIcon, Accordion, Divider, Drawer, Button, Group, Modal, Timeline, Text, Loader, Center, Menu, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDots, IconSettings, IconListDetails, IconTool, IconCheck } from '@tabler/icons-react';
import moment from 'moment';

import { getLandfills, getGasWells, gasWellsByLandfillsID, listServiceTypes } from './graphql/queries';
import { createGasWells, updateGasWells, createService } from './graphql/mutations';
import { onCreateGasWells, onUpdateGasWells, onDeleteGasWells } from './graphql/subscriptions';

import AddGasWell from './AddGasWell';
import InstallationModal from './InstallationModal';
import GoogleMapComponent from './GoogleMapComponent'; // Ensure correct import path
import ServiceRequestWindow from './ServiceRequestWindow'; // Ensure correct import path
import Filters from './Filters'; // Ensure correct import path

const LandfillMap = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [gasWells, setGasWells] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [installOpened, { open: openInstall, close: closeInstall }] = useDisclosure(false);
  const [openAccordion, setOpenAccordion] = useState(['incomplete']);
  const [drawerContent, setDrawerContent] = useState('');
  const [selectedGasWell, setSelectedGasWell] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [addWellOpened, { open: openAddWell, close: closeAddWell }] = useDisclosure(false);
  const [activeContent, setActiveContent] = useState('');
  const [activeContentTitle, setActiveContentTitle] = useState('');
  const [serviceTypes, setServiceTypes] = useState(null);
  const [selectedSubtypes, setSelectedSubtypes] = useState([
    'Above Surface','Subsurface','Riser','2" Well' ,'3" Well' 
  ]);
  const [selectedPriorities, setSelectedPriorities] = useState([]);

  const filteredGasWells = gasWells.filter(well => selectedSubtypes.includes(well.subtype));

  const handleButtonClick = (content) => {
    setDrawerContent(content);
    console.log(selectedGasWell)

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
console.log(allServiceTypes)
        
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
  
  
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [id]);

  const handleGasWellSelect = (gasWellId) => {
    setSelectedGasWell(gasWellId);
  };

  if (!landfill) {
    return <Center style={{padding: '1rem', }}><Loader color="blue" /></Center>;
  }

  const ServiceList = ({ selectedGasWell, isComplete }) => {
    if (!selectedGasWell || !selectedGasWell.Devices.Services) {
        return <p>No gas well selected or no services available.</p>;
      }
    
      const allServices = selectedGasWell?.Devices?.Services.items
      .filter(serv => serv.isComplete == isComplete)
      .sort((a, b) => moment(b.createdAt) - moment(a.createdAt));

      const status = isComplete ? 'completed' : 'incomplete';
      return (
        <div>
          
          {allServices.length > 0 ? (
 
            <Timeline bulletSize={32} lineWidth={3}>
              {allServices.map(service => (
                    <Timeline.Item 
                    key={service.id}
                    lineActive={true} 
                    active={true} 
                    color={`var(--apis-${service.priority == "High" ? 'red' : (service.priority == "Medium" ? 'orange' : 'yellow')}-200)` } 
                    bullet={<IconTool color={`var(--apis-${service.priority == "High" ? 'red' : (service.priority == "Medium" ? 'orange' : 'yellow')}-500)`} size={16} />} 
                    title={service.title}>
                      <Text color="dimmed" size="xs">Added by {moment(service.createdAt).format('l h:mm a')}</Text>
                    </Timeline.Item>
              ))}
            
          </Timeline>
          ) : (
            <p style={{color: 'var(--apis-gray-700)', fontSize: '0.85rem'}}>No {status} services found.</p>
          )}
        </div>
      );
};

const handleService = async (newService) => {
  console.log(newService)
  try {
    const result = await client.graphql({
      query: createService,
      variables: { input: {
        "title": newService.title,
        "completedNotes": "",
        "isComplete": false,
        "priority": newService.priority,
        "devicesID": newService.devicesID,
        "servicetypesID": newService.servicetypesID
      } }
    });
    
console.log("RESULT",result)

notifications.show({
  id: 'success-adding-service',
  withCloseButton: true,
  autoClose: 5000,
  title: 'New Service Request Added!',
  message: `'${newService.title}' has been added.`,
  icon: <IconCheck />,
  color: 'green'
});
    closeModal();
  } catch (error) {
    console.error('Error adding service:', error);
  }
}

const handleAddGasWell = async (newGasWell) => {

  console.log(newGasWell)
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

  console.log(newGasWell)
  try {
    const result = await client.graphql({
      query: updateGasWells,
      variables: { input: newGasWell }
    });

console.log("RESULT",result)

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
        <ServiceRequestWindow onSubmit={handleService} devicesID={selectedDevice.id} serviceTypes={serviceTypes}/>
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

    console.log(modalName,modalTitle)

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
      <Drawer zIndex={9} size={isMobile ? "80%" : "30%"} position="right" opened={opened} onClose={close} >
      {selectedGasWell && selectedGasWell.Devices && (
          <div>
            <div key={selectedGasWell.Devices.id}>
                <div style={{
                  fontSize: '24px',
                  marginBottom: '1rem'
                }}>
                    Service Request for
                </div>
                <div style={{
                  fontSize: '18px'
                }}>
                    <b>{selectedGasWell.gasWellName}</b>
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'gray'
                }}>
                    {selectedGasWell.Devices.serialNum}
                </div>
            </div>
            <Divider style={{ margin: '1rem 0'}}/>
            <Group justify="flex-end">
              <Button onClick={() => {setSelectedDevice(selectedGasWell.Devices); handleOpeningModal({modalName: 'serviceRequest', modalTitle: 'Add Service Request'});}}>Add Service Request</Button>
              <Menu shadow="md">
                <Menu.Target>
                  <Button style={{padding: '0 0.25rem'}} variant="light">
                    <IconDots />
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Application</Menu.Label>
                  <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                    Settings
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
             <div style={{ margin: '1rem 0'}}>
              <Accordion multiple  onChange={setOpenAccordion}>
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
          setModalWindow={handleOpeningModal}
          />
        </div>
        
    </div>
    </>
      
    
  );

};

export default LandfillMap;
