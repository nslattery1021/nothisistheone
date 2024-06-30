import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { Box, Button, Group, NumberInput, Select, TextInput, rem } from '@mantine/core';
import { IconX, IconCheck } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { devicesByLandfillsID } from './graphql/queries';
import { createDevices } from './graphql/mutations';

const AddDevices = ({ landfillsID, landfillName, closeModal, allDevices }) => {
  const [deviceType, setDeviceType] = useState('Header Monitor');
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [highestNumber, setHighestNumber] = useState(0);

  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  const client = generateClient();

  const deviceTypeOptions = [
    { value: 'Header Monitor', label: 'Header Monitor' },
    { value: 'Smart Well', label: 'Smart Well' },
  ];

  const fetchHighestDeviceNumber = async () => {
    const deviceNumbers = allDevices
    .filter(device => device.deviceType === deviceType)
    .map(device => parseInt(device.deviceName.split('-')[1].substring(2)))
    .filter(num => !isNaN(num));

    const highestNum = deviceNumbers.length > 0 ? Math.max(...deviceNumbers) : 0;
    setHighestNumber(highestNum+1);
  };

  useEffect(() => {
    if (deviceType) {
      fetchHighestDeviceNumber();
    }
  }, [deviceType, landfillsID]);

  const firstName = landfillName.split(' ')[0];
  const typeAbbreviation = deviceType === 'Smart Well' ? 'SW' : 'HM';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    

    try {
        var needToAdd = 0;
        const newDevices = Array.from({ length: quantity }, (_, index) => {
            var deviceNumber = (highestNumber + index + needToAdd).toString().padStart(4, '0');

            var newName = `${firstName}-${typeAbbreviation}${deviceNumber}`;

            while(allDevices.some(dev => dev.deviceName == newName)){
                needToAdd++;
                newName = `${firstName}-${typeAbbreviation}${(highestNumber + index + needToAdd).toString().padStart(4, '0')}`;
            }

            console.log(allDevices.some(dev => dev.deviceName == newName))

            return {
              deviceName: newName,
              deviceType,
              landfillsID,
            };
          });

      console.log("New Device",newDevices)

      for (const device of newDevices) {
        console.log("Each New Device",{
            "macAddress": "",
            "deviceName": device.deviceName,
            "iccid": "",
            "serialNum": "",
            "deviceType": device.deviceType,
            "landfillsID": landfillsID,
            "flowMeter": "",
            "restrictionSize": 0,
            "pipeSize": 0,
            "Services": []
        })
        // createDevices(input: {deviceName: "", landfillsID: "", deviceType: ""})
        // await client.graphql({
        //     query: createDevices,
        //     variables: {
        //         input: { device }
        //     }
        // });

        await client.graphql({
            query: createDevices,
            variables: {
                input: {
                "macAddress": "",
                "deviceName": device.deviceName,
                "iccid": "",
                "serialNum": "",
                "deviceType": device.deviceType,
                "landfillsID": landfillsID,
                "flowMeter": "",
                "restrictionSize": 0,
                "pipeSize": 0,
            }
            }
        });
      }

      // Clear the form fields
      setDeviceType('Header Monitor');
      setQuantity(1);

      notifications.show({
        id: 'success-adding-devices',
        withCloseButton: true,
        autoClose: 5000,
        title: 'Devices Added!',
        message: `${quantity} ${deviceType} devices have been added.`,
        icon: <IconCheck />,
        color: 'green'
      });
        closeModal();
      
    } catch (error) {
      console.error('Error adding devices:', error);

      notifications.show({
        id: 'error-adding-devices',
        withCloseButton: true,
        autoClose: 5000,
        title: 'Error',
        message: `There's been an error adding your devices: ${error}`,
        icon: <IconX />,
        color: 'red'
      });
      closeModal();
    }

    
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <Select
          label="Device Type"
          value={deviceType}
          onChange={(value) => setDeviceType(value)}
          data={deviceTypeOptions}
          placeholder="Select device type"
          required
          styles={{
            dropdown: { zIndex: 1055 },
            root: { zIndex: 1055 },
          }}
        />

        
        <NumberInput
          label="Quantity"
          value={quantity}
          onChange={(value) => setQuantity(value)}
          min={1}
          required
        />
       
            <NumberInput
            label="Starting Index"
            value={highestNumber}
            onChange={(value) => setHighestNumber(value)}
            required
            />
        
        <Group position="right" mt="md">
          <Button type="submit">Add Devices</Button>
        </Group>
      </form>
    </div>
  );
};

export default AddDevices;
