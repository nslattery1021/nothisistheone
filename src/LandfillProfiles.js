import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { useDisclosure } from '@mantine/hooks';
import { Link } from "react-router-dom";

import { Accordion, Divider, Button, ActionIcon, Modal, Timeline, Text } from '@mantine/core';
import { IconMap } from '@tabler/icons-react';
import moment from 'moment';

import { getLandfills } from './graphql/queries';

import AddGasWell from './AddGasWell';
import ServiceRequestWindow from './ServiceRequestWindow'; // Ensure correct import path

const LandfillProfiles = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [openAccordion, setOpenAccordion] = useState([]);
  const [drawerContent, setDrawerContent] = useState('');
  const [selectedGasWell, setSelectedGasWell] = useState(null);
  const [addWellOpened, { open: openAddWell, close: closeAddWell }] = useDisclosure(false);

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

      } catch (error) {
        console.error('Error fetching gaswells:', error);
      }
    };

    fetchLandfill();

  }, [id]);

  const handleGasWellSelect = (gasWellId) => {
    setSelectedGasWell(gasWellId);
  };

  if (!landfill) {
    return <div>Loading...</div>;
  }

  const googleMapsLink = (landfill.address+" "+landfill.city+" "+landfill.state+" "+landfill.zip).replaceAll(" ","%20");

  return (
    <>
  {/* <Modal zIndex={1050} opened={openedModal} onClose={closeModal} title="Add Service Request">
    <ServiceRequestWindow/>
  </Modal>
  <Modal opened={addWellOpened} onClose={closeAddWell} title="Add Gas Well">
    <AddGasWell onSubmit={handleAddGasWell} landfillsID={id}/>
  </Modal> */}
  <div>
    <div style={{backgroundColor: '#fcfcfc'}}>
    <div style={{padding: "0.75rem", fontSize: '1rem'}}>
        <h3 style={{padding: "0", fontSize: '0.75rem', margin: '0', color: 'gray'}}>LANDFILL</h3>
        <div style={{display: 'flex', gap: '0.5rem'}}>
        <h3 style={{padding: "0", margin: '0'}}>{landfill.name}</h3>

        <Link to={`/landfill/${id}`}>
                <ActionIcon variant="transparent" aria-label="Settings">
                    <IconMap style={{ width: '20px', height: '20px' }} stroke={1.5} />
                </ActionIcon>
                
                </Link>
        </div>
      </div>
      <div style={{padding: "0.75rem", fontSize: '1rem'}}>
        <h3 style={{padding: "0", fontSize: '0.75rem', margin: '0', color: 'gray'}}>ADDRESS</h3>
        
        <a target="_blank" href={`http://maps.google.com/?q=${googleMapsLink}`}><h3 style={{padding: "0", margin: '0', fontSize: '0.95rem', fontWeight: '500'}}>{landfill.address}, {landfill.city} {landfill.state} {landfill.zip}</h3></a>
      </div>

    </div>
      
      <Divider style={{margin: "0 0 1rem 0"}}/>
        <Accordion multiple defaultValue="contacts" onChange={setOpenAccordion} styles={{
                    item: {
borderBottom: '0'
                    },
                    label: {
                      color: '#333', // Text color
                      fontWeight: '550',
                      fontSize: '1rem'
                    }}}>
                <Accordion.Item value={"contacts"}>
                  <Accordion.Control>Contacts</Accordion.Control>
                  <Accordion.Panel>
                  </Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item value={"jobs"}>
                  <Accordion.Control>Jobs</Accordion.Control>
                  <Accordion.Panel>

                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
    </div>
    </>
      
    
  );

};

export default LandfillProfiles;
