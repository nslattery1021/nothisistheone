import React, { useCallback, useEffect, useState } from 'react';
import { APIProvider, Map, useMarkerRef} from '@vis.gl/react-google-maps';
import { IconGaugeFilled, IconInfoCircle, IconPackage, IconCpu, IconTool, IconMenu2, IconPlus, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Badge, Group, Input, Menu, Modal, Divider, ActionIcon, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import MarkerWithInfoWindow from './MarkerWithInfoWindow';
import AddGasWell from './AddGasWell';

const GoogleMapComponent = ({ openDrawer, lat, lng, gasWells }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [markerRef, marker] = useMarkerRef();

    useEffect(() => {
      if (!marker) {
        return;
      }
  
      // do something with marker instance here
    }, [marker]);
    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      };
      const menuButtonStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 10 // Ensure the menu button is above the map
      };
      const searchInputStyle = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10 // Ensure the menu button is above the map
      };
    
    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <Modal opened={opened} onClose={close} title="Add Landfill">
                <AddGasWell />
            </Modal>
            <Menu style={menuButtonStyle}>
                <Menu.Target>
                <ActionIcon size="lg" variant="default" color="gray">
                    <IconMenu2 size={18} />
                </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Label>Map Options</Menu.Label>
                    
                <Menu.Item onClick={open} leftSection={<IconPlus style={{ width: rem(14), height: rem(14) }} />}>Add Gas Well</Menu.Item>
                <Divider />
                <Menu.Item leftSection={<IconAdjustmentsHorizontal style={{ width: rem(14), height: rem(14) }} />}>Filters</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Input style={searchInputStyle} placeholder="Search gas wells" />

        <Map
            style={{width: '100%', height: '90%'}}
            defaultCenter={ center }
            mapTypeId= 'satellite'
            defaultZoom={16}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
            options={{
                mapId: 'Maps', // Replace 'YOUR_MAP_ID' with your actual Map ID
            }}
            >
            {gasWells.map((well) => (
                <MarkerWithInfoWindow
                openDrawer={openDrawer} 
                key={well.id} 
                props={well} />
            ))}
        </Map>
       
      </APIProvider>
    );
  }

  export default GoogleMapComponent;

