import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import {
  Accordion, Divider, Skeleton, Button, Modal, Flex, ActionIcon, Menu, Center, Loader, rem,
} from '@mantine/core';
import {
  IconMap, IconPhone, IconCalendarEvent, IconDots, IconMenu2, IconAdjustments, IconInfoCircleFilled, IconCpu, IconX, IconCheck
} from '@tabler/icons-react';

import AddDevices from './AddDevices';

import { getLandfills, devicesByLandfillsID } from './graphql/queries';
import { onCreateDevices, onUpdateDevices, onDeleteDevices } from './graphql/subscriptions';
import { updateDevices } from './graphql/mutations';

import moment from 'moment';
import { AgGridReact } from 'ag-grid-react'; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid

const LandfillProfiles = () => {
  const { id } = useParams();
  const [landfill, setLandfill] = useState(null);
  const [allDevices, setAllDevices] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [openAccordion, setOpenAccordion] = useState([]);
  const [drawerContent, setDrawerContent] = useState('');
  const [selectedGasWell, setSelectedGasWell] = useState(null);
  const [addWellOpened, { open: openAddWell, close: closeAddWell }] = useDisclosure(false);
  const [activeContent, setActiveContent] = useState('general');
  const [rowData, setRowData] = useState([]);
  
  // Column Definitions: Defines the columns to be displayed.
  const columnDefs = [
    { headerName: "Device Name", field: "deviceName", editable: true, enableCellChangeFlash: true },
    { 
      headerName: "Device Type", 
      field: "deviceType", 
      editable: true, 
      cellEditor: 'agRichSelectCellEditor',
      cellEditorParams: {
        values: ['Header Monitor', 'Smart Well']
      },
      cellRenderer: (params) => params.value
    },
    { headerName: "Serial Number", field: "serialNum", editable: true, enableCellChangeFlash: true },
    { headerName: "Mac Address", field: "macAddress", editable: true, enableCellChangeFlash: true },
    { headerName: "ICCID", field: "iccid", editable: true, enableCellChangeFlash: true },
  ];

  const defaultColDef = {
    flex: 1,
    minWidth: 175,
    editable: true,
    resizable: true,
  };

  const isMobile = window.innerWidth <= 768;
  const client = generateClient();

  const columnLabels = ["Device Name", "Device Type", "Serial Number", "Mac Address", "ICCID"];
  const [, setData] = useState([]);

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



        setAllDevices(deviceData.data.devicesByLandfillsID.items);

        const initialData = deviceData.data.devicesByLandfillsID.items
        .sort((a, b) => a.deviceName.localeCompare(b.deviceName))
        .map(device => ([
          { value: device.deviceName || '' },
          { value: device.deviceType || '' },
          { value: device.serialNum || '' },
          { value: device.macAddress || '' },
          { value: device.iccid || '' },
        ]));
        setData(initialData);
      } catch (error) {
        console.error('Error fetching dec:', error);
      }
    };
    fetchLandfill();

    const createSub = client.graphql({
      query: onCreateDevices,
      }).subscribe({
      next: (eventData) => {
          console.log("Created New Devices",eventData)
        const newEntry = eventData.data.onCreateDevices;
        console.log(newEntry)
        if (newEntry.landfillsID === id) {
          setAllDevices((prevDevices) => {
            const updatedDevices = [...prevDevices, newEntry].sort((a, b) => a.deviceName.localeCompare(b.deviceName));
            setData(updatedDevices.map(device => ([
              { value: device.deviceName || '' },
              { value: device.deviceType || '' },
              { value: device.serialNum || '' },
              { value: device.macAddress || '' },
              { value: device.iccid || '' },
            ])));
            return updatedDevices;
          });
        }
      }
    });
    
    const updateSub = client.graphql({
      query: onUpdateDevices
    }).subscribe({
      next: (eventData) => {
          console.log("Updated New Devices",eventData)
  
        const updatedDevice = eventData.data.onUpdateDevices;
        if (updatedDevice.landfillsID === id) {
          setAllDevices((prevDevices) => {
            const updatedDevices = prevDevices.map((device) =>
              device.id === updatedDevice.id ? updatedDevice : device
            ).sort((a, b) => a.deviceName.localeCompare(b.deviceName));
            setData(updatedDevices.map(device => ([
              { value: device.deviceName || '' },
              { value: device.deviceType || '' },
              { value: device.serialNum || '' },
              { value: device.macAddress || '' },
              { value: device.iccid || '' },
            ])));
            return updatedDevices;
          });
        }
      }
    });
    
    const deleteSub = client.graphql({
      query: onDeleteDevices
    }).subscribe({
      next: (eventData) => {
          console.log("Deleted New Devices",eventData)
  
        const deletedEntry = eventData.data.onDeleteDevices;
        setAllDevices((prevDevices) => {
          const updatedDevices = prevDevices.filter(device => device.id !== deletedEntry.id);
          setData(updatedDevices.map(device => ([
            { value: device.deviceName || '' },
            { value: device.deviceType || '' },
            { value: device.serialNum || '' },
            { value: device.macAddress || '' },
            { value: device.iccid || '' },
          ])));
          return updatedDevices;
        });
      }
    });
  
  
    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
    };
  }, [id]);

  const handleCellValueChange = async (event) => {
    const updatedDevice = { ...event.data };

    console.log(updatedDevice)
    try {
    await client.graphql({
      query: updateDevices,
        variables: {
            input: {
              "id": updatedDevice.id,
              "macAddress": updatedDevice.macAddress,
              "deviceName": updatedDevice.deviceName,
              "iccid": updatedDevice.iccid,
              "serialNum": updatedDevice.serialNum,
              "deviceType": updatedDevice.deviceType,
            }
        }
    })
    notifications.show({ message: 'Device updated successfully', color: 'green' })
  } catch (error) {
    console.log(error)
    notifications.show({ message: `Error updating device: ${error}`, color: 'red' })
  }
  };

  if (!allDevices) {
    return <Center style={{padding: '1rem', }}><Loader color="blue" /></Center>;
  }

  const googleMapsLink = `${landfill?.address} ${landfill?.city} ${landfill?.state} ${landfill?.zip}`.replaceAll(' ', '%20');
  const iconStyle = { width: rem(20), height: rem(20) };
  const menuItems = [
    { value: 'general', label: 'General', icon: <IconInfoCircleFilled style={iconStyle} stroke={1.1} /> },
    { value: 'devices', label: 'Devices', icon: <IconCpu style={iconStyle} stroke={1.1} /> },
  ];

  const renderContent = () => {
    
    switch (activeContent) {
      case 'general':
        return (
          <div style={{ padding: '0.75rem', overflowY: 'auto' }}>
            <Accordion
              multiple
              defaultValue="notes"
              onChange={setOpenAccordion}
              styles={{
                item: { borderBottom: '0' },
                label: {
                  color: 'gray',
                  fontWeight: '550',
                  fontSize: '0.75rem',
                  // borderBottom: '1px solid rgba(34,36,38,.1)'
                },
              }}
            >
              <Accordion.Item value="notes">
                <Accordion.Control>NOTES</Accordion.Control>
                <Accordion.Panel>No notes yet.</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="contacts">
                <Accordion.Control>CONTACTS</Accordion.Control>
                <Accordion.Panel>No contacts yet.</Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="jobs">
                <Accordion.Control>JOBS</Accordion.Control>
                <Accordion.Panel>No jobs yet.</Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </div>
        );
      case 'devices':
        return (
          <div style={{ padding: '0.75rem', width: '100%', overflowY: 'auto' }}>
            <h5>Devices</h5>
            {allDevices ? 
            (
              <div style={{ overflowX: 'auto', padding: '1rem 0' }}>
                <div
                  className="ag-theme-quartz" // applying the grid theme
                  style={{height: '65vh'}}
                >
                  <AgGridReact
                      rowData={allDevices}
                      columnDefs={columnDefs}
                      enableCellChangeFlash={true}
                      onCellValueChanged={handleCellValueChange}
                defaultColDef={defaultColDef}

                  />
                </div>
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
    <Modal zIndex={1050} opened={openedModal} onClose={closeModal} title="Add Devices">
    <AddDevices landfillsID={id} landfillName={landfill?.name} closeModal={closeModal} allDevices={allDevices}/>
  </Modal>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {landfill ? 
                (
                  <h3 style={{ padding: '0', margin: '0' }}>{landfill?.name}</h3>
                ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Skeleton height={8} width={150} radius="xl" />
                <Skeleton height={8} width={100} radius="xl" />
                </div>
                    
                  )  
               }
                
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
                <Menu.Item onClick={openModal} leftSection={<IconCpu style={{ width: rem(14), height: rem(14) }} />}>
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
              
            {landfill ? 
                (
                  <h3 style={{
                    padding: '0', margin: '0', fontSize: '0.95rem', fontWeight: '500',
                  }}
                  >
                    {landfill?.address}, {landfill?.city} {landfill?.state} {landfill?.zip}
                  </h3>
                ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Skeleton height={8} width={350} radius="xl" />
                <Skeleton height={8} width={250} radius="xl" />
                </div>
                )}
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