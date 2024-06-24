import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Menu, Modal, Divider, ActionIcon, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMenu2, IconPlus, IconAdjustmentsHorizontal } from '@tabler/icons-react';
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

  const options = {
    mapTypeId: 'satellite',
    disableDefaultUI: true, // Disable all default UI
    zoomControl: true, // Enable zoom control
  };

const GoogleMapComponent = ({ lat, lng, gasWells }) => {
    const mapRef = useRef(null);

    const [selectedWell, setSelectedWell] = useState(null);
    const [opened, { open, close }] = useDisclosure(false);

  const center = {
    lat: parseFloat(lat),
    lng: parseFloat(lng)
  };
  const isMobile = window.innerWidth <= 768;
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        const mapInstance = mapRef.current.state.map;
        // google.maps.event.trigger(mapInstance, 'resize');
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const renderCustomMarker = (well) => {
    return (
      <div className="custom-marker">
        <div className="custom-marker-title">{well.gasWellName}</div>
      </div>
    );
  };
  return (
    <div>
        <Modal opened={opened} onClose={close} title="Add Landfill">
            <AddGasWell />
        </Modal>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
      <GoogleMap
        mapContainerStyle={isMobile ? mobileContainerStyle : containerStyle}
        center={center} 
        options={options}
        zoom={16}
        ref={mapRef}
      >
        {gasWells.map((well) => (
            <Marker 
              key={well.id} 
              position={{ lat: well.lat, lng: well.lng }} 
              onClick={() => setSelectedWell(well)}
            />
          ))}
          {selectedWell && (
            <InfoWindow
              position={{ lat: selectedWell.lat, lng: selectedWell.lng }}
              onCloseClick={() => setSelectedWell(null)}
            >
              <div>
                <h3>{selectedWell.gasWellName}</h3>
              </div>
            </InfoWindow>
          )}
      </GoogleMap>
    </LoadScript>
    </div>
    
  );
}

export default GoogleMapComponent;
