import React, { useEffect, useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { ActionIcon, Accordion, Divider, Drawer, Button, Group, Modal, Timeline, Text, Loader, Center } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconDots, IconTool, IconListDetails, IconX, IconCheck } from '@tabler/icons-react';

import { devicesByLandfillsID } from './graphql/queries';
import { createGasWells } from './graphql/mutations';


const LandfillMap = ({ landfillsID }) => {
  const [devices, setDevices] = useState(null);

  const client = generateClient();
  
  useEffect(() => {
    const fetchDevices = async () => {
        try {
 
          const deviceData = await client.graphql({
            query: devicesByLandfillsID,
            variables: { landfillsID: landfillsID },
          });
  
          setDevices(deviceData.data.devicesByLandfillsID.items);
  
        } catch (error) {
          console.error('Error fetching dec:', error);
        }
      };
      fetchDevices();
  }, [landfillsID]);

  if (!devices) {
    return <Center style={{padding: '1rem', }}><Loader color="blue" /></Center>;
  }


  return (
    <>
    <div>Hi</div>
    </>
      
    
  );

};

export default LandfillMap;
