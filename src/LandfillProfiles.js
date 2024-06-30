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
import moment from 'moment';
import { getLandfills, devicesByLandfillsID } from './graphql/queries';
import AddDevices from './AddDevices';
import ServiceRequestWindow from './ServiceRequestWindow'; // Ensure correct import path
import { onCreateDevices, onUpdateDevices, onDeleteDevices } from './graphql/subscriptions';

import Spreadsheet from "react-spreadsheet";

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

  const isMobile = window.innerWidth <= 768;
  const client = generateClient();

  const columnLabels = ["Device Name", "Device Type", "Serial Number", "Mac Address", "ICCID"];
  const [data, setData] = useState([]);

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


  const handleSpreadsheetChange = (changes) => {

console.log("Changes",changes)

    // const newData = data.map((row, rowIndex) => {

    //   console.log("Changes Row",row, rowIndex)


    //   return row.map((cell, colIndex) => {
    //     const change = changes.find(change => change.row === rowIndex && change.col === colIndex);
    //     console.log(change)
    //   //   if (change) {
    //   //     console.log("The Change",change)
    //   //     return { value: change.value };
    //   //   } else {
    //   //     return cell;
    //   //   }

    //   return;
    //   });
    // });
    setData(changes);


    // updateDatabase(newData); // Implement this function to update your database
  };

const handleCellsChange = (changes) => {

  console.log("changes",changes)
  console.log("data",data)
if(data){
  changes.forEach((eachRow, rowIndex) => {

    const dataRow = data?.[rowIndex];
  
    eachRow.forEach((eachCell, cellIndex) => {
      const dataCell = dataRow?.[cellIndex];
      const dataCellValue = dataCell?.value ?? '';
      const eachCellValue = eachCell.value ?? '';
  
  
      if(dataCellValue != eachCellValue){
        console.log("Found change!")
        console.log(`Row ${rowIndex}, Cell ${cellIndex}`)
        console.log(eachCellValue)
        console.log(dataCellValue)
      }
      
    
    });
  });
}

// setData(changes);

  // setData(prevData => {
  //   const newData = [...prevData];
  //   console.log('newData',newData);
  //   console.log('changes',changes);
  //   changes.forEach(({ cell, row, value }) => {

  //     if (!newData[row]) {
  //       newData[row] = [];
  //     }
  //     if (!newData[row][cell]) {
  //       newData[row][cell] = { value: '' };
  //     }
  //     newData[row][cell].value = value;

  //     // Update the corresponding device in the database
  //     const updatedDevice = allDevices[row];
  //     switch (cell) {
  //       case 0:
  //         updatedDevice.deviceName = value;
  //         break;
  //       case 1:
  //         updatedDevice.deviceType = value;
  //         break;
  //       case 2:
  //         updatedDevice.serialNum = value;
  //         break;
  //       case 3:
  //         updatedDevice.macAddress = value;
  //         break;
  //       case 4:
  //         updatedDevice.iccid = value;
  //         break;
  //       default:
  //         break;
  //     }
  //     console.log('updatedDevice',updatedDevice)

  //     // Update the device in the database
  //     // const updateDeviceInDB = async () => {
  //     //   try {
  //     //     await API.graphql(graphqlOperation(updateDevice, { input: updatedDevice }));
  //     //   } catch (error) {
  //     //     console.error('Error updating device:', error);
  //     //   }
  //     // };

  //     // updateDeviceInDB();
  //   });

  //   return newData;
  // });
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
          <div style={{ padding: '0.75rem' }}>
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
          <div style={{ padding: '0.75rem', width: '100%' }}>
            <h5>Devices</h5>
            {allDevices ? 
            (
              <div style={{ overflowX: 'auto', padding: '1rem 0' }}>
                <Spreadsheet
                  data={data}
                  columnLabels={columnLabels}
                  hideRowIndicators={true}
                  onEvaluatedDataChange={handleCellsChange}
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
