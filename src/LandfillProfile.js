import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { useDisclosure } from '@mantine/hooks';
import { Accordion, Divider, Drawer, Button, Group, Modal, Timeline, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconDots, IconTool } from '@tabler/icons-react';
import moment from 'moment';

import { getLandfills, getGasWells, gasWellsByLandfillsID } from './graphql/queries';
import { createGasWells } from './graphql/mutations';
import { onCreateGasWells, onUpdateGasWells, onDeleteGasWells } from './graphql/subscriptions';

import AddGasWell from './AddGasWell';
import GoogleMapComponent from './GoogleMapComponent'; // Ensure correct import path
import ServiceRequestWindow from './ServiceRequestWindow'; // Ensure correct import path

const LandfillProfile = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [gasWells, setGasWells] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [openAccordion, setOpenAccordion] = useState([]);
  const [drawerContent, setDrawerContent] = useState('');
  const [selectedGasWell, setSelectedGasWell] = useState(null);
  const [addWellOpened, { open: openAddWell, close: closeAddWell }] = useDisclosure(false);


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
    
    /* update a todo */
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
    
    /* delete a todo */
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
    return <div>Loading...</div>;
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
            <Timeline active={allServices.length} color="orange" bulletSize={24}>
                {allServices.map(service => (
                <Timeline.Item key={service.id} title={service.title} bullet={<IconTool color='white' size="0.8rem" />}>
                    <Text c="dimmed" size="sm">{moment(service.createdAt).format('l h:mm a')}</Text>
                </Timeline.Item>
                ))}
            </Timeline>
           
          ) : (
            <p>No {status} services found.</p>
          )}
        </div>
      );
};
const handleAddGasWell = async (newGasWell) => {

  console.log(newGasWell)
  try {
    const result = await client.graphql({
      query: createGasWells,
      variables: { input: newGasWell }
    });

console.log("RESULT",result)
showNotification({
  title: 'New Gas Well Added',
  message: `A new gas well named ${newGasWell.gasWellName} has been added.`,
  color: 'green',
});
    // setGasWells((prevGasWells) => [...prevGasWells, result.data.createGasWells]);
    closeAddWell();
  } catch (error) {
    console.error('Error adding gas well:', error);
  }
};

  return (
    <>
  <Modal zIndex={1050} opened={openedModal} onClose={closeModal} title="Add Service Request">
    <ServiceRequestWindow/>
  </Modal>
  <Modal opened={addWellOpened} onClose={closeAddWell} title="Add Gas Well">
    <AddGasWell onSubmit={handleAddGasWell} landfillsID={id}/>
  </Modal>
  <div>
      <Drawer size={isMobile ? "80%" : "30%"} position="right" opened={opened} onClose={close} >
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
              <Button onClick={openModal}>Add Service Request</Button>
              <Button style={{padding: '0 0.25rem'}} variant="light">
                <IconDots />
              </Button>
            </Group>
             <div style={{ margin: '1rem 0'}}>
              <Accordion multiple defaultValue="incomplete"  onChange={setOpenAccordion}>
                <Accordion.Item value={"incomplete"}>
                  <Accordion.Control>To Do</Accordion.Control>
                  <Accordion.Panel>
                    <ServiceList selectedGasWell={selectedGasWell} isComplete={false}/>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={"completed"}>
                  <Accordion.Control style={{fontWeight: '800'}}>History</Accordion.Control>
                  <Accordion.Panel>
                    <ServiceList selectedGasWell={selectedGasWell} isComplete={true}/>

                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
             
             </div>
                
          </div>
        )}
      </Drawer>

        <h3 style={{padding: "0.75rem"}}>{landfill.name}</h3>
        <div style={{position: 'absolute', top: '120px', height: '90%', width: '100%'}}>
          <GoogleMapComponent           
          openDrawer={handleButtonClick}
          handleGasWellSelect={handleGasWellSelect}
          lat={landfill.lat} 
          lng={landfill.lng} 
          landfillId={id}
          gasWells={gasWells}
          openAddWell={openAddWell}/>
        </div>
        
    </div>
    </>
      
    
  );

};

export default LandfillProfile;
