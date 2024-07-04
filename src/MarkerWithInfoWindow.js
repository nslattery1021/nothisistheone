import React, { useCallback, useState } from 'react';
import {  AdvancedMarker,
    InfoWindow,
    Pin,
    useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { IconGaugeFilled, IconInfoCircle, IconPackage, IconCpu, IconTool, IconMenu2, IconPlus, IconAdjustmentsHorizontal } from '@tabler/icons-react';
import { Button, ActionIcon, HoverCard, Popover, Group, Text, rem } from '@mantine/core';
import { Icon, Label } from 'semantic-ui-react';
import { translate } from '@aws-amplify/ui';

import moment from 'moment';

 
const MarkerWithInfoWindow = ({ props, isSelected, onClick, openDrawer, setModalWindow }) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

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
              {props.Devices?.Services?.items.some(serv => !serv.isComplete) && (() => {
                const services = props.Devices?.Services?.items.filter(serv => !serv.isComplete);
                console.log(services)
                return (
                  <Label style={{padding: '0', margin: '0px !important', transform: 'translateX(-50%)', top: '-1.5em', position: 'absolute', zIndex: '100', left: '100%'}}>
                    <Button.Group>
                      {services.filter(serv => serv.priority === "High").length > 0 && 
                        <Button size="xs" color="red">{services.filter(serv => serv.priority === "High").length}</Button>
                      }
                      {services.filter(serv => serv.priority === "Medium").length > 0 && 
                        <Button size="xs" color="orange">{services.filter(serv => serv.priority === "Medium").length}</Button>
                      }
                      {services.filter(serv => serv.priority === "Low").length > 0 && 
                        <Button size="xs" color="yellow">{services.filter(serv => serv.priority === "Low").length}</Button>
                      }
                    </Button.Group>
                  </Label>
                );
              })()}
  
      
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
                {hasDevice && props.Devices?.macAddress ? 
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
              <div style={{display: 'flex', marginTop: '0.5rem', gap: '0.35rem', flexWrap: 'wrap'}}>
              
              <Group justify="center">
                <HoverCard shadow="md">
                  <HoverCard.Target>
                  <div><Label><Icon name='tachometer alternate' /> 23</Label></div>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                  <div class="tooltiptext" style={{
                    lineHeight: '1'
                  }}>
                        <div
                        style={{
                          lineHeight: '1',
                          fontSize: '1rem',
                          marginBottom: '0.35rem',
                          fontWeight: '600'
                        }}>CalGas Reading</div>
                        <div
                        style={{
                          lineHeight: '1.3',
                          color: 'gray',
                          fontSize: '0.75rem',
                          fontWeight: '400'
                        }}>
                            <div>Last entry by Neil Slattery</div>
                            <div>at {moment(new Date()).format('l h:mm a')}</div>
                        </div>
                    </div>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
              <Group justify="center">
                <HoverCard shadow="md">
                  <HoverCard.Target>
                  <div><Label color='yellow'><div style={{
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        backgroundColor: 'white', 
                        mask: `url(/valve-icon.svg) no-repeat center / contain`,
                        WebkitMask: `url(/valve-icon.svg) no-repeat center / contain`,
                        height: '11px',
                        width: '10px',
                      }}></div>
                      50
                    </div></Label></div>
                  </HoverCard.Target>
                  <HoverCard.Dropdown>
                  <div class="tooltiptext" style={{
                    lineHeight: '1'
                  }}>
                        <div
                        style={{
                          lineHeight: '1',
                          fontSize: '1rem',
                          marginBottom: '0.35rem',
                          fontWeight: '600'
                        }}>QED Position</div>
                        <div
                        style={{
                          lineHeight: '1.3',
                          color: 'gray',
                          fontSize: '0.75rem',
                          fontWeight: '400'
                        }}>
                            <div>Last entry by Neil Slattery</div>
                            <div>at {moment(new Date()).format('l h:mm a')}</div>
                        </div>
                    </div>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>
                <div><Label color='green'><Icon name='tint' />Pump</Label></div>
              </div>
            </div>
          </div>
            
            
            <ActionIcon.Group  style={{marginTop: '1rem', width: '100%'}}>
                <ActionIcon onClick={() =>  setModalWindow({modalName: 'editGasWell', modalTitle: `Edit ${props.gasWellName}`})} variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconInfoCircle size={20} stroke={2} /></ActionIcon>
                <ActionIcon onClick={() => setModalWindow({modalName: 'installation', modalTitle: 'Installation'})} variant="light" color="gray" size="lg" style={{flexGrow: 1}}><IconPackage size={20} stroke={2} /></ActionIcon>
                
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

