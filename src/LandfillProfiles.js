import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { useDisclosure } from '@mantine/hooks';
import {
  Accordion, Divider, Group, Button, Table, Flex, ActionIcon, Menu, Center, Loader, rem,
} from '@mantine/core';
import {
  IconMap, IconPhone, IconCalendarEvent, IconDots, IconMenu2, IconAdjustments, IconInfoCircleFilled, IconCpu,
} from '@tabler/icons-react';
import moment from 'moment';
import { getLandfills, devicesByLandfillsID } from './graphql/queries';
import AddGasWell from './AddGasWell';
import ServiceRequestWindow from './ServiceRequestWindow'; // Ensure correct import path

import Spreadsheet from "react-spreadsheet";

const LandfillProfiles = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [allDevices, setAllDevices] = useState(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [openAccordion, setOpenAccordion] = useState([]);
  const [drawerContent, setDrawerContent] = useState('');
  const [selectedGasWell, setSelectedGasWell] = useState(null);
  const [addWellOpened, { open: openAddWell, close: closeAddWell }] = useDisclosure(false);
  const [activeContent, setActiveContent] = useState('general');

  const isMobile = window.innerWidth <= 768;
  const client = generateClient();

  const columnLabels = ["Device Name", "Device Type", "Serial Number", "Mac Address", "ICCID"];
  const rowLabels = [];
  const data = allDevices?.items.map(device => ([
    { value: device.deviceName },
    { value: device.deviceType },
    { value: device.serialNum },
    { value: device.macAddress },
    { value: device.iccid },
  ]));

  useEffect(() => {
    const fetchLandfill = async () => {
      try {
        const landfillData = await client.graphql({
          query: getLandfills,
          variables: { id },
        });
        setLandfill(landfillData.data.getLandfills);

        const deviceData = await client.graphql({
          query: devicesByLandfillsID,
          variables: { landfillsID: id },
        });



        setAllDevices(deviceData.data.devicesByLandfillsID);
      } catch (error) {
        console.error('Error fetching dec:', error);
      }
    };
    fetchLandfill();
  }, [id]);
const spreadsheetStyles = {
    rowLabels: {
      display: 'none', // Hide row labels
    },
  };
  if (!allDevices) {
    return <div>Loading devices...</div>;
  }

  const googleMapsLink = `${landfill.address} ${landfill.city} ${landfill.state} ${landfill.zip}`.replaceAll(' ', '%20');
  const iconStyle = { width: rem(20), height: rem(20) };
  const menuItems = [
    { value: 'general', label: 'General', icon: <IconInfoCircleFilled style={iconStyle} stroke={1.1} /> },
    { value: 'devices', label: 'Devices', icon: <IconCpu style={iconStyle} stroke={1.1} /> },
  ];

  const renderContent = () => {
    
    switch (activeContent) {
      case 'general':
        return (
          <div style={{ padding: '0.75rem' }}>
            <Accordion
              multiple
              defaultValue="notes"
              onChange={setOpenAccordion}
              styles={{
                item: { borderBottom: '0' },
                label: {
                  color: '#333',
                  fontWeight: '550',
                  fontSize: '1rem',
                },
              }}
            >
              <Accordion.Item value="notes">
                <Accordion.Control>Notes</Accordion.Control>
                <Accordion.Panel>No notes yet.</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="contacts">
                <Accordion.Control>Contacts</Accordion.Control>
                <Accordion.Panel>No contacts yet.</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="jobs">
                <Accordion.Control>Jobs</Accordion.Control>
                <Accordion.Panel>No jobs yet.</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
        );
      case 'devices':
        return (
          <div style={{ padding: '0.75rem', width: '100%' }}>
            <h5>Devices</h5>

            {allDevices ? 
            (
              <div style={{ overflowX: 'auto', padding: '1rem 0' }}>
                <Spreadsheet
                  data={data}
                  columnLabels={columnLabels}
                  hideRowIndicators={true}
                />
            </div>
              
            ) : (
              <div>No devices found.</div>
            )

            }

          </div>
        );
      default:
        return <div style={{ padding: '0.75rem' }}>Select an option from the menu.</div>;
    }
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ backgroundColor: '#fcfcfc', padding: '1rem 0.75rem'}}>
          <Flex
            style={{ fontSize: '1rem' }}
            gap="xs"
            justify="space-between"
            align="center"
            direction="row"
            wrap="nowrap"
          >
            <div>
              <h3 style={{
                padding: '0', fontSize: '0.75rem', margin: '0', color: 'gray',
              }}
              >
                LANDFILL
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <h3 style={{ padding: '0', margin: '0' }}>{landfill.name}</h3>
                <Link to={`/landfill/${id}`}>
                  <ActionIcon variant="transparent" aria-label="Settings">
                    <IconMap style={{ width: '1.2rem', height: '1.2rem' }} stroke={1.5} />
                  </ActionIcon>
                </Link>
              </div>
            </div>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon>
                  <IconDots style={{ width: '1.2rem', height: '1.2rem' }} stroke={1.5} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Landfill Options</Menu.Label>
                <Menu.Item leftSection={<IconPhone style={{ width: rem(14), height: rem(14) }} />}>
                  Add Contact
                </Menu.Item>
                <Menu.Item leftSection={<IconCalendarEvent style={{ width: rem(14), height: rem(14) }} />}>
                  Add Job
                </Menu.Item>
                <Menu.Item leftSection={<IconCpu style={{ width: rem(14), height: rem(14) }} />}>
                  Add Devices
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Flex>
          <div style={{ paddingTop: '1rem', fontSize: '1rem' }}>
            <h3 style={{
              padding: '0', fontSize: '0.75rem', margin: '0', color: 'gray',
            }}
            >
              ADDRESS
            </h3>
            <a target="_blank" href={`http://maps.google.com/?q=${googleMapsLink}`}>
              <h3 style={{
                padding: '0', margin: '0', fontSize: '0.95rem', fontWeight: '500',
              }}
              >
                {landfill.address}, {landfill.city} {landfill.state} {landfill.zip}
              </h3>
            </a>
          </div>
        </div>
        <Divider />
        <div style={{ display: 'flex', flexGrow: 1 }}>
          <Flex
            direction="column"
            spacing="xs"
            style={{
              backgroundColor: '#f0f0f0',
              height: '100%',
              width: isMobile ? '50px' : '130px', // Adjust width as needed
            //   padding: '1rem',
            }}
          >
            {menuItems.map((item) => (
              <Button
                key={item.value}
                variant="subtle"
                onClick={() => setActiveContent(item.value)}
                fullWidth
                style={{
                  justifyContent: 'flex-start',
                  color: activeContent === item.value ? '#fff' : '#555',
                  fontWeight: activeContent === item.value ? 'bold' : 'normal',
                  backgroundColor: activeContent === item.value ? 'rgba(156, 156, 156, 1)' : 'transparent',
                  marginBottom: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {item.icon}
                  {!isMobile && 
                  <span style={{ marginLeft: '1rem' }}>{item.label}</span>
                  }
                </div>
              </Button>
            ))}
          </Flex>
          <div style={{ flexGrow: 1, overflow: 'hidden'}}>
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default LandfillProfiles;
