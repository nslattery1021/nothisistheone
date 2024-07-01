import React, { useCallback, useState } from 'react';
import {  AdvancedMarker,
    InfoWindow,
    Pin,
    useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { IconGaugeFilled, IconInfoCircle, IconPackage, IconCpu, IconTool, IconMenu2, IconPlus, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Grid, ActionIcon, rem } from '@mantine/core';
import { Icon, Label } from 'semantic-ui-react';

 
const MarkerWithInfoWindow = ({ props, isSelected, onClick, openDrawer, openModal, setModalWindow }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(() => {
    onClick(props.id);
  }, [onClick, props.id]);


    const hasDevice = !!props.gasWellsDevicesId;

  
  const installed = '#23ad5c';
  const notInstalled = '#525252';
  const onHold = '#f44336';
  const partialInstall = '#a333c8';
  const uninstalledBySite = '#f2711c';

  var markerBackground = notInstalled;

  if(hasDevice){
    markerBackground = installed;
  } else {
    // need onhold
  }

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  const handleButtonClick = useCallback((content) => () => openDrawer(content), [openDrawer]);

  const deviceTypeIcon = props.type == "Header Monitor" ? '/HeaderMonitorIcon.svg' : '/SmartWellIcon.svg';
  const deviceTypeIconHeight = props.type == "Header Monitor" ? '30px' : '35px';
  const deviceTypeIconWidth = props.type == "Header Monitor" ? '30px' : '23px';

  return (
    <>
      <AdvancedMarker
        key={props.id}
        position={{ lat: props.lat, lng: props.lng }}
        ref={markerRef}
        onClick={handleMarkerClick}
      >
          <Label
          key={props.id}
             pointing='below'
              style={{
                background: markerBackground,
                color: 'white',
                // width: '125px',
              }}
            >
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: 'white', 
                  mask: `url(${deviceTypeIcon}) no-repeat center / contain`,
                  height: deviceTypeIconHeight,
                  width: deviceTypeIconWidth,
                }}>
                  Type
                </div>
                <div>
                  <h4 className='ui header' style={{margin: '0', color: 'white'}}>
                    {props.gasWellName}
                    <div className='sub header' style={{color: 'white'}}>{props.subtype}</div>
                  </h4>
                </div>
              </div>

              
            </Label>
      </AdvancedMarker>
      {isSelected && (
        <InfoWindow anchor={marker} onCloseClick={() => onClick(null)}>
        
          <div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <div>
              <div  
                style={{
                  height: '140px',
                  width: '100px',
                  background: '#d3d3d3',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>     
                <i 
                  className={"image outline large icon"} 
                  style={{
                    color: 'white', margin: '0'
                  }}></i>
              </div>
            </div>
            <div>
              <h3 style={{margin: '0'}}>
                {hasDevice ? 
                    <a target={"_blank"} href={`https://console.particle.io/medora-16572/devices/${props.Devices.macAddress}`}>{props.gasWellName}</a>
                    :
                    <>
                    {props.gasWellName}
                    </>
                  }
              </h3>
              {hasDevice && 
                    <>
                      <div style={{fontSize: '0.85rem'}}>{props.Devices.serialNum}</div>
                      <div style={{fontSize: '0.85rem'}}>{props.Devices.deviceName}</div>
                    </>
                  }
              <div style={{fontSize: '0.85rem'}}>{props.type} • {props.subtype}</div>
              <div style={{display: 'flex', marginTop: '0.5rem', gap: '0.25rem'}}>
                <Label><Icon name='tachometer alternate' /> 23</Label>
              </div>
            </div>
          </div>
            
            
            <ActionIcon.Group  style={{marginTop: '1rem', width: '100%'}}>
                <ActionIcon variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconInfoCircle size={20} stroke={2} /></ActionIcon>
                <ActionIcon onClick={() => {setModalWindow('installation'); openModal();}} variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconPackage size={20} stroke={2} /></ActionIcon>
                
                {hasDevice && 
                  <>
                    <ActionIcon variant="light" color="gray"size="lg" style={{flexGrow: 1}}><IconCpu size={20} stroke={2} /></ActionIcon>
                    <ActionIcon variant="light" color="gray" size="lg" onClick={handleButtonClick('service')} style={{flexGrow: 1}}><IconTool size={20} stroke={2} /></ActionIcon>
                  </>
                }
                
            </ActionIcon.Group>
          </div>
        </InfoWindow>
        )}
    </>
  );
}

export default MarkerWithInfoWindow;

