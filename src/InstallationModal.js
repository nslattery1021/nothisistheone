import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { Card, Group, Combobox, Stack, useCombobox, Button, ScrollArea, Text, Box, Badge, Loader, Center } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconChevronDown, IconTool, IconListDetails, IconX, IconCheck } from '@tabler/icons-react';

import { devicesByLandfillsID } from './graphql/queries';
import { updateGasWells } from './graphql/mutations';


const InstallationModal = ({ landfillsID, gasWell }) => {
    const [devices, setDevices] = useState(null);
    const [deviceOptions, setDeviceOptions] = useState(null);
    const [search, setSearch] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemLabel, setSelectedItemLabel] = useState(null);
    const limit = 150;
    const combobox = useCombobox({
      onDropdownClose: () => {
        combobox.resetSelectedOption();
        combobox.focusTarget();
        setSearch('');
      },
  
      onDropdownOpen: () => {
        combobox.focusSearchInput();
      },
    });

    useEffect(() => {
        try {
            const foundDevices = devices.find(dev => dev.id == selectedItem)
            console.log("selected",foundDevices)
            setSelectedItemLabel(

                <>
                    <div>
                        <Text fw={500}>{foundDevices.deviceName}</Text>
                        <Text size="sm" c="dimmed">{foundDevices.serialNum}</Text>
                    </div>                  
                </>
                );
        } catch(error){
            setSelectedItemLabel(<Text fw={500}>No device linked.</Text>);
        }
        

    }, [selectedItem]);


  const client = generateClient();
  
  const options = devices ? devices
  .filter((item) => item.deviceName.toLowerCase().includes(search.toLowerCase().trim()) || item.serialNum.toLowerCase().includes(search.toLowerCase().trim()))
  .sort((a,b) => a.deviceName.localeCompare(b.deviceName) )
  .map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
        <div style={{lineHeight: '1.1', margin: '0.25rem 0'}}>
            <div style={{fontSize: '1em', fontWeight: '600'}}>
                {item.deviceName}
            </div>
            <div style={{fontSize: '.92857143em', color: 'rgba(0,0,0,.4)'}}>
                {item.serialNum}
            </div>
        </div>
    </Combobox.Option>
  )) : [];

  useEffect(() => {

    const fetchDevices = async () => {
        try {
 console.log(gasWell)
          const deviceData = await client.graphql({
            query: devicesByLandfillsID,
            variables: { landfillsID: landfillsID, limit },
          });
          setDevices(deviceData.data.devicesByLandfillsID.items.filter(dev => dev.deviceType == gasWell.type));
          gasWell.gasWellsDevicesId && setSelectedItem(gasWell.gasWellsDevicesId);
        } catch (error) {
          console.error('Error fetching dec:', error);
        }
      };
      fetchDevices();
  }, [landfillsID]);

  const handleRemoveSelectedItem = async () => {
    if(window.confirm('Are you sure you would like to to remove this device?')){
        try {
            await client.graphql({
              query: updateGasWells,
                variables: {
                    input: {
                      "id": gasWell.id,
                      "gasWellsDevicesId": null,
                    }
                }
            });
            setSelectedItem(null);
            notifications.show({ message: `Device remove from ${gasWell.gasWellName} successfully`, color: 'red' })
          } catch (error) {
            console.log(error)
            notifications.show({ message: `Error updating device: ${error}`, color: 'red' })
          }
    }
  };

  if (!devices) {
    return <Center style={{padding: '1rem', }}><Loader color="blue" /></Center>;
  }


  return (
<Box sx={{ maxWidth: 400, zIndex: 1051 }} mx="auto">
<h4>{gasWell.gasWellName}</h4>

    <Text style={{fontSize: 'var(--mantine-font-size-sm)', marginBottom: '0.5rem'}}>Linked Device</Text>
      <Combobox
        store={combobox}
        position="bottom-start"
        withArrow
        style={{
            cursor: 'pointer'
        }}
        onOptionSubmit={async (val) => {
            // console.log('val',val)
            if(window.confirm('Are you sure you want to change devices?')){
                console.log(gasWell)

                try {
                    await client.graphql({
                      query: updateGasWells,
                        variables: {
                            input: {
                              "id": gasWell.id,
                              "gasWellsDevicesId": val,
                            }
                        }
                    });
                    setSelectedItem(val);
                    combobox.closeDropdown();
                    notifications.show({ message: `Device added to ${gasWell.gasWellName} successfully`, color: 'green' })
                  } catch (error) {
                    console.log(error)
                    notifications.show({ message: `Error updating device: ${error}`, color: 'red' })
                  }
            }
        }}
      >
        <Combobox.Target withAriaAttributes={false}>
        <Card shadow="sm" radius="md" withBorder>
            <Stack>
                <Group style={{margin: '0'}} justify="space-between" mt="md" mb="xs">
                    {selectedItemLabel}
                </Group>
                <Group grow wrap="nowrap">
                    <Button onClick={() => combobox.toggleDropdown()} color="blue">
                        Search Devices
                    </Button>
                    <Button onClick={handleRemoveSelectedItem} disabled={selectedItem == null} color="red" variant='light'>
                        Remove
                    </Button>
                </Group>
            </Stack>                
        </Card>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Search
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Search devices"
          />
          <Combobox.Options>
          <ScrollArea.Autosize type="scroll" mah={350}>
            {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
            </ScrollArea.Autosize>
            </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

    </Box>
      
    
  );

};

export default InstallationModal;
