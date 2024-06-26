import React, { useCallback, useState } from 'react';
import {  AdvancedMarker,
    InfoWindow,
    Pin,
    useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { IconGaugeFilled, IconInfoCircle, IconPackage, IconCpu, IconTool, IconMenu2, IconPlus, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Badge, Group, Input, Menu, Modal, Divider, ActionIcon, rem } from '@mantine/core';
import { Icon, Label } from 'semantic-ui-react';

 
const MarkerWithInfoWindow = ({ props, openDrawer }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  // clicking the marker will toggle the infowindow
  const handleMarkerClick = useCallback(
    () => setInfoWindowShown(isShown => !isShown),
    []);

  const installed = '#23ad5c';
  const notInstalled = '#525252';
  const onHold = '#f44336';
  const partialInstall = '#a333c8';
  const uninstalledBySite = '#f2711c';

  var markerBackground = notInstalled;
  // if the maps api closes the infowindow, we have to synchronize our state
  const handleClose = useCallback(() => setInfoWindowShown(false), []);

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
                width: '125px',
              }}
            >
              <h4 className='ui header' style={{margin: '0', color: 'white'}}>
                {props.gasWellName}
              <div className='sub header' style={{color: 'white'}}>{props.subtype}</div>
              </h4>
            </Label>
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow anchor={marker} onCloseClick={handleClose}>
        
          <div>
            <h3 style={{margin: '0'}}>{props.gasWellName}</h3>
            <div style={{fontSize: '0.85rem'}}>{props.type} • {props.subtype}</div>
            <div style={{display: 'flex', marginTop: '0.5rem', gap: '0.25rem'}}>
              <Label><Icon name='tachometer alternate' /> 23</Label>
            </div>
            
            <ActionIcon.Group  style={{marginTop: '1rem', width: '100%'}}>
                <ActionIcon variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconInfoCircle size={20} stroke={2} /></ActionIcon>
                <ActionIcon variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconPackage size={20} stroke={2} /></ActionIcon>
                <ActionIcon variant="light" color="gray"size="lg" style={{flexGrow: 1}}><IconCpu size={20} stroke={2} /></ActionIcon>
                <ActionIcon variant="light" color="gray" size="lg" onClick={openDrawer} style={{flexGrow: 1}}><IconTool size={20} stroke={2} /></ActionIcon>
            </ActionIcon.Group>
          </div>
        </InfoWindow>
        )}
    </>
  );
}

export default MarkerWithInfoWindow;

