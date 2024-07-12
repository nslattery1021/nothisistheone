import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import {
  FileButton, Accordion, Divider, Skeleton, Button, Modal, Flex, ActionIcon, Menu, Center, Select, TextInput, Loader, rem, Table, Checkbox
} from '@mantine/core';
import {
  IconMap, IconPhone, IconCoin, IconCalendarEvent, IconDots, IconMenu2, IconTableImport, IconInfoCircleFilled, IconCpu, IconX, IconCheck
} from '@tabler/icons-react';
import { OutTable, ExcelRenderer} from 'react-excel-renderer';

import AddDevices from './AddDevices';

import { getLandfills, devicesByLandfillsID, gasWellsByLandfillsID } from './graphql/queries';
import { onCreateDevices, onUpdateDevices, onDeleteDevices, onCreateGasWells, onUpdateGasWells, onDeleteGasWells } from './graphql/subscriptions';
import { updateDevices, createDevices, createGasWells } from './graphql/mutations';
import { useListState } from '@mantine/hooks';

import moment from 'moment';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

const key = 'Editable';

const LandfillProfiles = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [fileGasWell, setFileGasWell] = useState(null);

  const [usedData, setUsedData] = useState([]);
  const [landfill, setLandfill] = useState(null);
  const [allDevices, setAllDevices] = useState([]);
  const [allGasWells, setAllGasWells] = useState([]);
  const [data, setData] = useState([]);
  const [gasWellData, setGasWellData] = useState([]);
  
  const [opened, { open, close }] = useDisclosure(false);
  const [openedModal, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [openedModalImportDevice, { open: openModalImportDevice, close: closeModalImportDevice }] = useDisclosure(false);
  const [openedModalImportGasWell, { open: openModalImportGasWell, close: closeModalImportGasWell }] = useDisclosure(false);

  const [openAccordion, setOpenAccordion] = useState([]);
  const [drawerContent, setDrawerContent] = useState('');
  const [selectedGasWell, setSelectedGasWell] = useState(null);
  const [addWellOpened, { open: openAddWell, close: closeAddWell }] = useDisclosure(false);
  const [activeContent, setActiveContent] = useState('general');
  const [rowData, setRowData] = useState([]);
  const [prevValue, setPrevValue] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowsGasWell, setSelectedRowsGasWell] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

//Loading States
const [deviceImportLoading, setDeviceImportLoading] = useState(false);
const [gasWellImportLoading, setGasWellImportLoading] = useState(false);

const [fileType, setFileType] = useState('');
const [rows, setRows] = useState([]);
const [cols, setCols] = useState([]);
  const allChecked = selectedRows.length === rows.length;
  const indeterminate = selectedRows.length > 0 && !allChecked;
  const limit = 150;  // Limit parameter

  const setOriginalValue = (value, id, property) => {

    setPrevValue(value);

  }

  const handleFile = (event) => {
    
  if(!file){
    return;
  }

    let fileObj = file;

    ExcelRenderer(fileObj, async (err, resp) => {
      if (err) {
        console.log(err);            
      } else {
        console.log(resp)
        
        console.log('fileType',fileType)
        const existingIndexes = fileType == 'devices' ? [
          resp.rows[0].indexOf('deviceName') > -1, 
          resp.rows[0].indexOf('deviceType') > -1, 
          resp.rows[0].indexOf('macAddress') > -1,
          resp.rows[0].indexOf('serialNum') > -1,
          resp.rows[0].indexOf('lastICCID') > -1,
        ] : [
          resp.rows[0].indexOf('gasWellName') > -1, 
          resp.rows[0].indexOf('type') > -1, 
          resp.rows[0].indexOf('subtype') > -1,
          resp.rows[0].indexOf('lat') > -1,
          resp.rows[0].indexOf('lng') > -1,
        ]

        if(existingIndexes.every((value) => value == true)){

          const newTable = resp.rows.map(dev => { 
            return fileType == 'devices' ? {
              deviceName : dev[resp.rows[0].indexOf('deviceName')], 
              deviceType : dev[resp.rows[0].indexOf('deviceType')], 
              macAddress : dev[resp.rows[0].indexOf('macAddress')],
              serialNum : dev[resp.rows[0].indexOf('serialNum')],
              iccid : dev[resp.rows[0].indexOf('lastICCID')],
          } : {
              gasWellName : dev[resp.rows[0].indexOf('gasWellName')], 
              type : dev[resp.rows[0].indexOf('type')], 
              subtype : dev[resp.rows[0].indexOf('subtype')] == '2 In Well' ? '2" Well' : (dev[resp.rows[0].indexOf('subtype')] == '3 In Well' ? '3" Well' : dev[resp.rows[0].indexOf('subtype')]),
              lat : dev[resp.rows[0].indexOf('lat')],
              lng : dev[resp.rows[0].indexOf('lng')],
          }
            
          })
          
          console.log("New Table",newTable)
          let firstElement = newTable.shift();

          const thRow = fileType == 'devices' ? [
            { name: "Device Name", key: 0 },
            { name: "Device Type", key: 1 },
            { name: "Mac Address", key: 2 },
            { name: "Serial Number", key: 3 },
            { name: "ICCID", key: 4 }
          ] :  [
            { name: "Gas Well Name", key: 0 },
            { name: "Type", key: 1 },
            { name: "Subtype", key: 2 },
            { name: "Latitutde", key: 3 },
            { name: "Longitude", key: 4 }
          ]



          setCols(thRow);
          setRows(newTable.sort((a, b) => fileType == 'devices' ? a.deviceName.localeCompare(b.deviceName) : a.gasWellName.localeCompare(b.gasWellName)));

        } else {
          setCols([{name: "Can't find the proper columns!", key: 0}]);
          setRows([]);
        }
        
      }
    });
  };


  const handleDeviceImport = async () => {
    console.log(selectedRows)
    setDeviceImportLoading(true)
    const typeTitle = fileType == 'devices' ? "Devices" : "Gas Wells";

      try {
        for (const selectedRow of selectedRows){

          const inputData = fileType == 'devices' ? {
            "macAddress": selectedRow.macAddress,
            "deviceName": selectedRow.deviceName,
            "iccid": selectedRow.iccid,
            "serialNum": selectedRow.serialNum,
            "deviceType": selectedRow.deviceType,
            "landfillsID": id,
            "flowMeter": "",
            "restrictionSize": 0,
            "pipeSize": 0,
          } : {
            "gasWellName": selectedRow.gasWellName,
            "type": selectedRow.type,
            "subtype": selectedRow.subtype,
            "lat": selectedRow.lat,
            "lng": selectedRow.lng,
            "landfillsID": id,
          }
          

          await client.graphql({
              query: fileType == 'devices' ? createDevices : createGasWells,
              variables: {
                  input: inputData
              }
          });
        }
      

      notifications.show({
        id: 'success-adding-devices',
        withCloseButton: true,
        autoClose: 5000,
        title: `${typeTitle} Added!`,
        message: `New ${typeTitle} have been added.`,
        icon: <IconCheck />,
        color: 'green'
      });
        closeModalImportDevice();
        setDeviceImportLoading(false);
      
    } catch (error) {
      console.error('Error adding:', error);

      notifications.show({
        id: 'error-adding-devices',
        withCloseButton: true,
        autoClose: 5000,
        title: 'Error',
        message: `There's been an error adding your ${typeTitle}: ${error}`,
        icon: <IconX />,
        color: 'red'
      });
      closeModalImportDevice();
      setDeviceImportLoading(false);
    }
    

  }

  const handleUpdate = (value, id, property) => {

    setData((state) => {
      const nodeIndex = state.nodes.findIndex((node) => node.id === id);
      if (nodeIndex === -1 || state.nodes[nodeIndex][property] === value) {
        return state; // No changes needed
      }
    
      const updatedNodes = [...state.nodes];
      updatedNodes[nodeIndex] = {
        ...updatedNodes[nodeIndex],
        [property]: value,
      };
    
      return { ...state, nodes: updatedNodes };
    });
  };

  const handleUpdateToDatabase = async (value, id, property) => {
    
    const foundData = data.nodes.find(dev => dev.id == id);

    if(foundData[property] == prevValue){
      return;
    }

    try {
      await client.graphql({
        query: updateDevices,
          variables: {
              input: {
                "id": foundData.id,
                "macAddress": foundData.macAddress,
                "deviceName": foundData.deviceName,
                "iccid": foundData.iccid,
                "serialNum": foundData.serialNum,
                "deviceType": foundData.deviceType,
              }
          }
      })
      notifications.show({ message: 'Device updated successfully', color: 'green' })
    } catch (error) {
      console.log(error)
      notifications.show({ message: `Error updating device: ${error}`, color: 'red' })
    }
  };
    
      const deviceTypeOptions = [
        { value: 'Header Monitor', label: 'Header Monitor' },
        { value: 'Smart Well', label: 'Smart Well' },
      ];

      const subtypeOptions = {
        'Header Monitor': [
          { value: 'Above Surface', label: 'Above Surface' },
          { value: 'Subsurface', label: 'Subsurface' },
          { value: 'Riser', label: 'Riser' },
        ],
        'Smart Well': [
          { value: '2" Well', label: '2" Well' },
          { value: '3" Well', label: '3" Well' },
        ],
      };
    
      const COLUMNS = [
        {
          label: 'Device Name',
          width: '175px',
          renderCell: (item) => (
            <TextInput
              type="text"
              className="no-border"
              border={'none!important'}
              style={{ width: '100%', border: 'none!important', outline: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              value={item.deviceName}
              onChange={(event) => handleUpdate(event.target.value, item.id, 'deviceName')}
              onBlur={(event) => handleUpdateToDatabase(event, item.id, 'deviceName')}
              onFocus={(event) => setOriginalValue(event.target.value, item.id, 'deviceName')}

            />
          ),
        },
        {
          label: 'Type',
          width: '175px',
          renderCell: (item) => (
            <Select
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              className="no-border"
              value={item.deviceType}
              data={deviceTypeOptions}
              onChange={(event) => handleUpdate(event, item.id, 'deviceType')}
              onFocus={(event) => setOriginalValue(event.target.value, item.id, 'deviceType')}

            >
            </Select>
          ),
        },
        {
          label: 'Serial Number',
          width: '175px',
          renderCell: (item) => (
            <TextInput
              type="text"
              className="no-border"
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              value={item.serialNum}
              onChange={(event) => handleUpdate(event.target.value, item.id, 'serialNum')}
              onBlur={(event) => handleUpdateToDatabase(event.target.value, item.id, 'serialNum')}
              onFocus={(event) => setOriginalValue(event.target.value, item.id, 'serialNum')}
            />
          ),
        },
        {
          label: 'Mac Address',
          width: '200px',
          renderCell: (item) => (
            <TextInput
              type="text"
              className="no-border"
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              value={item.macAddress}
              onChange={(event) => handleUpdate(event.target.value, item.id, 'macAddress')}
              onBlur={(event) => handleUpdateToDatabase(event.target.value, item.id, 'macAddress')}
              onFocus={(event) => setOriginalValue(event.target.value, item.id, 'macAddress')}

            />
          ),
        },
        {
          label: 'ICCID',
          width: '200px',
          renderCell: (item) => (
            <TextInput
              type="text"
              className="no-border"
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              value={item.iccid}
              onChange={(event) => handleUpdate(event.target.value, item.id, 'iccid')}
              onBlur={(event) => handleUpdateToDatabase(event.target.value, item.id, 'iccid')}
              onFocus={(event) => setOriginalValue(event.target.value, item.id, 'iccid')}

            />
          ),
        },
      ];
      const columnsGasWell = [
        {
          label: 'Gas Well Name',
          width: '175px',
          renderCell: (item) => (
            <TextInput
              type="text"
              className="no-border"
              border={'none!important'}
              style={{ width: '100%', border: 'none!important', outline: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              value={item.gasWellName}
              // onChange={(event) => handleUpdate(event.target.value, item.id, 'deviceName')}
              // onBlur={(event) => handleUpdateToDatabase(event, item.id, 'deviceName')}
              // onFocus={(event) => setOriginalValue(event.target.value, item.id, 'deviceName')}

            />
          ),
        },
        {
          label: 'Type',
          width: '175px',
          renderCell: (item) => (
            <Select
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              className="no-border"
              value={item.type}
              data={deviceTypeOptions}
              // onChange={(event) => handleUpdate(event, item.id, 'deviceType')}
              // onFocus={(event) => setOriginalValue(event.target.value, item.id, 'deviceType')}

            >
            </Select>
          ),
        },
        {
          label: 'Subtype',
          width: '175px',
          renderCell: (item) => (
            <Select
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              className="no-border"
              value={item.subtype}
              data={subtypeOptions[item.type]}
              // onChange={(event) => handleUpdate(event, item.id, 'deviceType')}
              // onFocus={(event) => setOriginalValue(event.target.value, item.id, 'deviceType')}

            >
            </Select>
          ),
        },
        {
          label: 'Latitude',
          width: '175px',
          renderCell: (item) => (
            <TextInput
              type="text"
              className="no-border"
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              value={item.lat}
              // onChange={(event) => handleUpdate(event.target.value, item.id, 'serialNum')}
              // onBlur={(event) => handleUpdateToDatabase(event.target.value, item.id, 'serialNum')}
              // onFocus={(event) => setOriginalValue(event.target.value, item.id, 'serialNum')}
            />
          ),
        },
        {
          label: 'Longitude',
          width: '175px',
          renderCell: (item) => (
            <TextInput
              type="text"
              className="no-border"
              style={{ width: '100%', border: 'none', fontSize: '1rem', padding: 0, margin: 0 }}
              value={item.lng}
              // onChange={(event) => handleUpdate(event.target.value, item.id, 'serialNum')}
              // onBlur={(event) => handleUpdateToDatabase(event.target.value, item.id, 'serialNum')}
              // onFocus={(event) => setOriginalValue(event.target.value, item.id, 'serialNum')}
            />
          ),
        }
      ];
  const isMobile = window.innerWidth <= 768;
  const client = generateClient();  

  useEffect(() => {
    handleFile(fileType);
  },[file]);

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
          variables: { landfillsID: id, limit },
        });

        setAllDevices(deviceData.data.devicesByLandfillsID.items);

        const initialData = deviceData.data.devicesByLandfillsID.items
        .sort((a, b) => a.deviceName.localeCompare(b.deviceName))
        .map(device => {
          return {
            'id': device.id,
            'deviceName': device.deviceName || '',
            'deviceType': device.deviceType || '',
            'serialNum': device.serialNum || '',
            'macAddress': device.macAddress || '',
            'iccid': device.iccid || '',
          };
        });

        setData({nodes: initialData});

        const gasWellData = await client.graphql({
          query: gasWellsByLandfillsID,
          variables: { landfillsID: id, limit },
        });

        setAllGasWells(gasWellData.data.gasWellsByLandfillsID.items);

        const initialGasWellData = gasWellData.data.gasWellsByLandfillsID.items
        .sort((a, b) => a.gasWellName.localeCompare(b.gasWellName))
        .map(gasWell => {
          return {
            'id': gasWell.id,
            'gasWellName': gasWell.gasWellName || '',
            'type': gasWell.type || '',
            'subtype': gasWell.subtype || '',
            'lat': gasWell.lat || '',
            'lng': gasWell.lng || '',
          };
        });

        setGasWellData({nodes: initialGasWellData});

        console.log(initialGasWellData)
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
            setData({ nodes: updatedDevices.map(device => ({
              'id': device.id,
              'deviceName': device.deviceName || '',
              'deviceType': device.deviceType || '',
              'serialNum': device.serialNum || '',
              'macAddress': device.macAddress || '',
              'iccid': device.iccid || '',
            }))});
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
            setData({ nodes: updatedDevices.map(device => ({
              'id': device.id,
              'deviceName': device.deviceName || '',
              'deviceType': device.deviceType || '',
              'serialNum': device.serialNum || '',
              'macAddress': device.macAddress || '',
              'iccid': device.iccid || '',
            }))});
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
          setData({ nodes: updatedDevices.map(device => ({
            'id': device.id,
            'deviceName': device.deviceName || '',
            'deviceType': device.deviceType || '',
            'serialNum': device.serialNum || '',
            'macAddress': device.macAddress || '',
            'iccid': device.iccid || '',
          }))});
          return updatedDevices;
        });
      }
    });
  
    const createSubGasWell = client.graphql({
      query: onCreateGasWells,
      }).subscribe({
      next: (eventData) => {
          console.log("Created New Gas Wells",eventData)
        const newEntry = eventData.data.onCreateGasWells;
        console.log(newEntry)
        if (newEntry.landfillsID === id) {
          setAllGasWells((prevGasWells) => {
            const updatedGasWells = [...prevGasWells, newEntry].sort((a, b) => a.gasWellName.localeCompare(b.gasWellName));
            setGasWellData({ nodes: updatedGasWells.map(gasWell => ({
              'id': gasWell.id,
              'gasWellName': gasWell.gasWellName || '',
              'type': gasWell.type || '',
              'subtype': gasWell.subtype || '',
              'lat': gasWell.lat || '',
              'lng': gasWell.lng || '',
            }))});
            return updatedGasWells;
          });
        }
      }
    });

    const updateSubGasWell = client.graphql({
      query: onUpdateGasWells
    }).subscribe({
      next: (eventData) => {
          console.log("Updated New GasWell",eventData)
  
        const updatedEntry = eventData.data.onUpdateGasWells;
        if (updatedEntry.landfillsID === id) {
          setAllDevices((prevDevices) => {
            const updatedGasWells = prevDevices.map((device) =>
              device.id === updatedEntry.id ? updatedEntry : device
            ).sort((a, b) => a.gasWellName.localeCompare(b.gasWellName));
            setGasWellData({ nodes: updatedGasWells.map(gasWell => ({
              'id': gasWell.id,
              'gasWellName': gasWell.gasWellName || '',
              'type': gasWell.type || '',
              'subtype': gasWell.subtype || '',
              'lat': gasWell.lat || '',
              'lng': gasWell.lng || '',
            }))});
            return updatedGasWells;
          });
        }
      }
    });
    
    const deleteSubGasWell = client.graphql({
      query: onDeleteGasWells
    }).subscribe({
      next: (eventData) => {
          console.log("Deleted New GasWell",eventData)
  
        const deletedEntry = eventData.data.onDeleteGasWells;
        setAllDevices((prevDevices) => {
          const updatedGasWells = prevDevices.filter(device => device.id !== deletedEntry.id);
          setGasWellData({ nodes: updatedGasWells.map(gasWell => ({
            'id': gasWell.id,
            'gasWellName': gasWell.gasWellName || '',
            'type': gasWell.type || '',
            'subtype': gasWell.subtype || '',
            'lat': gasWell.lat || '',
            'lng': gasWell.lng || '',
          }))});
          return updatedGasWells;
        });
      }
    });

    return () => {
      createSub.unsubscribe();
      updateSub.unsubscribe();
      deleteSub.unsubscribe();
      createSubGasWell.unsubscribe();
      updateSubGasWell.unsubscribe();
      deleteSubGasWell.unsubscribe();
    };
  }, [id]);
  const theme = useTheme([
    {
      Table: `
        --data-table-library_grid-template-columns:  ${isMobile ? '175px 175px 175px 175px 175px;' : '20% 20% 20% 20% 20%'};
        border: 1px solid rgba(34,36,38,.1) ;
      `,
      Row: `
      border-top: 1px solid rgba(34,36,38,.1)
      `,
      HeaderCell: `
      &:first-of-type {
border-left: none ;
    }
        border-left: 1px solid rgba(34,36,38,.1) ;
      padding: .92857143em 0.5rem;
      background: #f9fafb;
      font-weight: 700;
    `,
      Cell: `
      &:first-of-type {
border-left: none ;
    }
        border-left: 1px solid rgba(34,36,38,.1) ;
        border-top: 1px solid rgba(34,36,38,.1)
    `,
    },
  ]);

  if (!allDevices) {
    return <Center style={{padding: '1rem', }}><Loader color="blue" /></Center>;
  }

  const googleMapsLink = `${landfill?.address} ${landfill?.city} ${landfill?.state} ${landfill?.zip}`.replaceAll(' ', '%20');
  const iconStyle = { width: rem(20), height: rem(20) };
  const menuItems = [
    { value: 'general', label: 'General', icon: <IconInfoCircleFilled style={iconStyle} stroke={1.1} /> },
    { value: 'devices', label: 'Devices', icon: <IconCpu style={iconStyle} stroke={1.1} /> },
    { value: 'gasWells', label: 'GasWells', icon: <IconCoin style={iconStyle} stroke={1.1} /> },
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
            <Flex
            justify='space-between'
            align='center'
            >
              <h5>Devices</h5>
              
              <Button
              onClick={() => {
                openModalImportDevice(); 
                setFileType('devices'); 
                setFile(null); 
                setSelectedRows([]); 
                setModalTitle('Import Devices');
              }} leftSection={<IconTableImport style={{ width: '1rem', height: '1rem' }}  />}>Import</Button>
            </Flex>
            
            {allDevices.length > 0 ? 
            (
              <div style={{ overflow: 'auto', padding: '1rem 0' }}>
                {data ?
                 
                  ( <>
                    <CompactTable 
                    columns={COLUMNS} 
                    data={data} 
                    theme={theme} 
                    layout={{ custom: true }}/>
                    </>) :
                  (<Center style={{padding: '1rem', }}><Loader color="blue" /></Center>)
                }
                
            </div>
              
            ) : (
              <div>No devices found.</div>
            )

            }

          </div>
        );
        case 'gasWells':
          return (
            <div style={{ padding: '0.75rem', width: '100%', overflowY: 'auto' }}>
              <Flex
              justify='space-between'
              align='center'
              >
                <h5>Gas Wells</h5>
                
                <Button 
                onClick={() => {
                  openModalImportDevice(); 
                  setFileType('gasWells'); 
                  setFile(null); 
                  setSelectedRows([]); 
                  setModalTitle('Import Gas Wells');
                }} 
                  
                leftSection={<IconTableImport style={{ width: '1rem', height: '1rem' }}  />}>Import</Button>
              </Flex>
              
              {allGasWells.length > 0 ? 
              (
                <div style={{ overflow: 'auto', padding: '1rem 0' }}>
                  {gasWellData ?
                   
                    ( <>
                      <CompactTable 
                      columns={columnsGasWell} 
                      data={gasWellData} 
                      theme={theme} 
                      layout={{ custom: true }}/>
                      </>) :
                    (<Center style={{padding: '1rem', }}><Loader color="blue" /></Center>)
                  }
                  
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


  const handleTableSelectImport = (event, deviceName) => {

    setSelectedRows(
      event.currentTarget.checked
        ? [...selectedRows, deviceName]
        : selectedRows.filter((name) => name !== deviceName)
    )
  }

  const toggleAll = () => {
    setSelectedRows(allChecked || indeterminate ? [] : rows.map((row) => row));
  };

  return (
    <>
    <Modal zIndex={1050} opened={openedModal} onClose={closeModal} title="Add Devices">
    <AddDevices landfillsID={id} landfillName={landfill?.name} closeModal={closeModal} allDevices={allDevices}/>
  </Modal>
  <Modal zIndex={1050} size="auto" opened={openedModalImportDevice} onClose={closeModalImportDevice} title={modalTitle}>
    <Flex 
    justify='space-between'
    align='center'
    gap='1rem'
    >
      <FileButton color='gray' onChange={setFile} accept="text/csv">
        {(props) => <Button {...props}>Upload CSV</Button>}
      </FileButton>
      <Button onClick={handleDeviceImport} loading={deviceImportLoading} color='green' disabled={selectedRows.length == 0}>Import Data</Button>
    </Flex>

    {file &&
    <Table mt='1rem' >
    <Table.Thead>
      <Table.Tr>
        <Table.Th>
          <Checkbox
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={toggleAll}
          />

        </Table.Th>
        {cols.map((col, index) => (
          <Table.Th key={index}>{col.name}</Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>
     
      {rows.map((row, rowIndex) => (
        <Table.Tr key={rowIndex} bg={selectedRows.some(thisRow => fileType == 'devices' ? thisRow.deviceName == row.deviceName : thisRow.gasWellName == row.gasWellName) ? 'var(--mantine-color-blue-light)' : undefined}
>
          <Table.Td>
            <Checkbox
              aria-label="Select row"
              checked={selectedRows.some(thisRow => fileType == 'devices' ? thisRow.deviceName == row.deviceName : thisRow.gasWellName == row.gasWellName)}
              onChange={(event) => handleTableSelectImport(event, row)}
            />
          </Table.Td>
          {Object.values(row).map((cell, cellIndex) => (
            <Table.Td  key={cellIndex}>{cell}</Table.Td>
          ))}
        </Table.Tr>
      ))}
    </Table.Tbody>
  </Table>
    }
      
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
                <ActionIcon style={{background: 'var(--apis-light-blue-600)'}}>
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
          gap={0}
            direction="column"
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

