import React, { useCallback, useEffect, useState, useRef } from 'react';
import { APIProvider, Map, useMarkerRef, useMap} from '@vis.gl/react-google-maps';
import { IconClipboardText, IconMenu2, IconPlus, IconAdjustmentsHorizontal, IconSearch } from '@tabler/icons-react';
import { Autocomplete, Menu, Modal, Divider, ActionIcon, Select, SelectProps, rem } from '@mantine/core';

import { useDisclosure } from '@mantine/hooks';
import MarkerWithInfoWindow from './MarkerWithInfoWindow';

const MapMenuOptions = ({ gasWells, openDrawer, selectingGasWellId, handleGasWellSelect, setModalWindow }) => {
  const map = useMap('main-map');
  const [opened, { open, close }] = useDisclosure(false);

  const menuButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 8 // Ensure the menu button is above the map
  };
  const searchInputStyle = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 8 // Ensure the menu button is above the map
  };
  useEffect(() => {
    if (!map) return;
    // do something with the map instance
  }, [map]);
  const gasWellTitles = gasWells.map((item) => 
    ({
      value: item.gasWellName,
      device: item.Devices,
      id: item.id,
      center: {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng)
      },
      label: item.gasWellName
        
    })
  );

  const renderSelectOption = ({ option, checked }) => (
    <div style={{lineHeight: '1.1', margin: '0.25rem 0'}}>
      <div style={{fontSize: '1em', fontWeight: '600'}}>
        {option.value}
      </div>
      {option.device && 
        <div style={{fontSize: '.92857143em', color: 'rgba(0,0,0,.4)'}}>
          {option.device.serialNum}
        </div>
      }
    </div>
  );

  const handleWellSelect = useCallback((wellName) => {
    const well = gasWellTitles.find((item) => item.value === wellName);
    console.log("Well Search",well)
    if (map && well) {
      map.panTo(well.center);
      map.setZoom(19); // Set the desired zoom level
      selectingGasWellId(well.id);
      handleGasWellSelect(well);
    }
  }, [handleGasWellSelect]);

  const handleButtonClick = useCallback((content) => () => openDrawer(content), [openDrawer]);



  return <>
 
<Menu style={menuButtonStyle}>
  <Menu.Target>
  <ActionIcon size="lg" variant="default" color="gray">
      <IconMenu2 size={18} />
  </ActionIcon>
  </Menu.Target>
  <Menu.Dropdown>
      <Menu.Label>Map Options</Menu.Label>
      
      <Menu.Item onClick={() => setModalWindow({modalName: 'addGasWell', modalTitle: 'Add Gas Well'})} leftSection={<IconPlus style={{ width: rem(14), height: rem(14) }} />}>Add Gas Well</Menu.Item>
      <Divider />
      <Menu.Item onClick={() => setModalWindow({modalName: 'filters', modalTitle: 'Filters'})} leftSection={<IconAdjustmentsHorizontal style={{ width: rem(14), height: rem(14) }} />}>Filters</Menu.Item>
      <Menu.Item onClick={handleButtonClick('purchaseOrders')} leftSection={<IconClipboardText style={{ width: rem(14), height: rem(14) }} />}>Purchase Orders</Menu.Item>
  </Menu.Dropdown>
</Menu>
{/* <Input style={searchInputStyle} placeholder="Search gas wells" /> */}
<Select
placeholder="Search gas wells..."
icon={<IconSearch />}
style={searchInputStyle}
searchable
onChange={handleWellSelect}
data={gasWellTitles}
nothingFoundMessage="No gas well found."
renderOption={renderSelectOption}
/>
</>;
};

const GoogleMapComponent = ({ openDrawer, handleGasWellSelect, lat, lng, gasWells, allDevices, setModalWindow }) => {
    
  const [markerRef, marker] = useMarkerRef();
  const [selectedGasWellId, setSelectedGasWellId] = useState(null);

    useEffect(() => {
      if (!marker) {
        return;
      }
    }, [marker]);
    const handleMarkerClick = useCallback((well) => {
      console.log("Does it come here")
      setSelectedGasWellId(prevId => (prevId === well.id ? null : well.id));
      handleGasWellSelect(well);
    }, [handleGasWellSelect]);
    const center = {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
    };
    // console.log("GASWELLS",gasWells)
    return (
        <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            
        <Map
        id={'main-map'}
            style={{width: '100%', height: '100%'}}
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
                onClick={() => handleMarkerClick(well)}
                isSelected={well.id === selectedGasWellId}
                openDrawer={openDrawer} 
                key={well.id} 
                props={well}
                allDevices={allDevices}
                setModalWindow={setModalWindow} />
            ))}
        </Map>
        <MapMenuOptions 
        gasWells={gasWells} 
        openDrawer={openDrawer} 
        selectingGasWellId={setSelectedGasWellId} 
        handleGasWellSelect={handleGasWellSelect} 
        setModalWindow={setModalWindow} />
      </APIProvider>
    );
  }

  export default GoogleMapComponent;

