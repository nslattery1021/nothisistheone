import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, InfoWindow, OverlayView, useLoadScript } from '@react-google-maps/api';
import { Input, Menu, Modal, Divider, ActionIcon, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconInfoCircle, IconPackage, IconCpu, IconTool, IconMenu2, IconPlus, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import AddGasWell from './AddGasWell';

const containerStyle = {
  width: '100%',
  height: '83vh',
  position: 'relative'
};

const mobileContainerStyle = {
    width: '100%',
   height: '70vh', // Adjust height for mobile devices
   position: 'relative'
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
  const options = {
    mapTypeId: 'satellite',
    disableDefaultUI: true, // Disable all default UI
    zoomControl: true, // Enable zoom control
  };

const GoogleMapComponent = ({ lat, lng, gasWells }) => {
    // const [gasWells, setGasWells] = useState([]);
    const [selectedWell, setSelectedWell] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      });
  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };
  const isMobile = window.innerWidth <= 768;
 
  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps</div>;
  }

  const installed = '#23ad5c';
  const notInstalled = '#525252';
  const onHold = '#f44336';
  const partialInstall = '#a333c8';
  const uninstalledBySite = '#f2711c';

  var markerBackground = notInstalled;

  return (
    <div>
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
      <GoogleMap
        mapContainerStyle={isMobile ? mobileContainerStyle : containerStyle}
        center={center} 
        options={options}
        zoom={16}
      >
        {gasWells.map((well) => (
            <OverlayView
            key={well.id}
            position={{ lat: well.lat, lng: well.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                background: markerBackground,
                color: 'white',
                padding: '5px',
                borderRadius: '3px',
                fontSize: '12px',
                width: '125px',
                willChange: 'transform',
                transform: 'translate(-50%, -100%) translate(0, 0)',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
              }}
              onClick={() => setSelectedWell(well)}
            >
              <h3 style={{margin: '0'}}>{well.gasWellName}</h3>
              <div>{well.subtype}</div>
            </div>
          </OverlayView>
          ))}
          {selectedWell && (
            <InfoWindow
              position={{ lat: selectedWell.lat, lng: selectedWell.lng }}
              onCloseClick={() => setSelectedWell(null)}
            //   options={{pixelOffset : isLoaded ? new google.maps.Size(0, -50) : 0}}
            >
              <div>
                <h3 style={{margin: '0',fontSize: '1rem'}}>{selectedWell.gasWellName}</h3>
                <div style={{fontSize: '0.85rem'}}>{selectedWell.type} • {selectedWell.subtype}</div>
                <ActionIcon.Group fullWidth style={{marginTop: '1rem', width: '100%'}}>
                    <ActionIcon variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconInfoCircle size={20} stroke={2} /></ActionIcon>
                    <ActionIcon variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconPackage size={20} stroke={2} /></ActionIcon>
                    <ActionIcon variant="light" color="gray"size="lg" style={{flexGrow: 1}}><IconCpu size={20} stroke={2} /></ActionIcon>
                    <ActionIcon variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconTool size={20} stroke={2} /></ActionIcon>

                </ActionIcon.Group>
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
    </div>
    
  );
}

export default GoogleMapComponent;
