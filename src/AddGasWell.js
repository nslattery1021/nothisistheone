import React, { useState, useEffect } from 'react';
import { TextInput, NumberInput, Button, Group, Box, Select, Loader } from '@mantine/core';
import { IconMapPinFilled } from '@tabler/icons-react';

const AddGasWellForm = ({ onSubmit, landfillsID, gasWell }) => {
  const [gasWellName, setGasWellName] = useState(gasWell?.gasWellName ?? '');
  const [lat, setLat] = useState(gasWell?.lat ?? '');
  const [lng, setLng] = useState(gasWell?.lng ?? '');
  const [type, setType] = useState(gasWell?.type ?? '');
  const [subtype, setSubtype] = useState(gasWell?.subtype ?? '');
  const [restrictionSize, setRestrictionSize] = useState('');
  const [id, setId] = useState(gasWell?.id ?? '');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserLocation = () => {
    // if geolocation is supported by the users browser
    if(lat && lng){
      if(!window.confirm("Would you like to update the location?")){
        return;
      }
    }

    if (navigator.geolocation) {
      // get the current users location
      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });

          console.log(latitude, longitude)
          
          setLat(latitude);
          setLng(longitude);

          setLoading(false);

        },
        // if there was an error getting the users location
        (error) => {
          console.error('Error getting user location:', error);
          setLoading(false);

        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  const typeOptions = [
    { value: 'Header Monitor', label: 'Header Monitor' },
    { value: 'Smart Well', label: 'Smart Well' },
  ];

  const subtypeOptions = {
    'Header Monitor': [
      { value: 'Above Surface', label: 'Above Surface' },
      { value: 'Subsurface', label: 'Subsurface' },
      { value: 'Riser', label: 'Riser' },
    ],
    'Smart Well': [
      { value: '2" Well', label: '2" Well' },
      { value: '3" Well', label: '3" Well' },
    ],
  };

  const restrictionSizeOptions = {
    '2" Well' : [
      { value: 'Normal (1.1" ID)', label: 'Normal (1.1" ID)' },
      { value: 'High Flow (1.4" ID)', label: 'High Flow (1.4" ID)' },
    ],
    '3" Well' : [
      { value: 'Normal (1.8" ID)', label: 'Normal (1.8" ID)' },
      { value: 'High Flow (2.1" ID)', label: 'High Flow (2.1" ID)' },
    ],
    'Above Surface' : [
      { value: '5.85', label: '6" (5.85" ID)' },
      { value: '7.61', label: '8" (7.61" ID)' },
      { value: '9.49', label: '10" (9.49" ID)' },
      { value: '11.25', label: '12" (11.25" ID)' },
      { value: '12.35', label: '14" (12.35" ID)' },
      { value: '14.12', label: '16" (14.12" ID)' },
      { value: '15.88', label: '18" (15.88" ID)' },
      { value: '17.65', label: '20" (17.65" ID)' },
      { value: '21.18', label: '24" (21.18" ID)' },
      { value: '26.47', label: '30" (26.47" ID)' },
      { value: '31.76', label: '36" (31.76" ID)' }
    ],
    'Subsurface' : [
      { value: '5.85', label: '6" (5.85" ID)' },
      { value: '7.61', label: '8" (7.61" ID)' },
      { value: '9.49', label: '10" (9.49" ID)' },
      { value: '11.25', label: '12" (11.25" ID)' },
      { value: '12.35', label: '14" (12.35" ID)' },
      { value: '14.12', label: '16" (14.12" ID)' },
      { value: '15.88', label: '18" (15.88" ID)' },
      { value: '17.65', label: '20" (17.65" ID)' },
      { value: '21.18', label: '24" (21.18" ID)' },
      { value: '26.47', label: '30" (26.47" ID)' },
      { value: '31.76', label: '36" (31.76" ID)' }
    ],
    'Riser' : [
      { value: '5.85', label: '6" (5.85" ID)' },
      { value: '7.61', label: '8" (7.61" ID)' },
      { value: '9.49', label: '10" (9.49" ID)' },
      { value: '11.25', label: '12" (11.25" ID)' },
      { value: '12.35', label: '14" (12.35" ID)' },
      { value: '14.12', label: '16" (14.12" ID)' },
      { value: '15.88', label: '18" (15.88" ID)' },
      { value: '17.65', label: '20" (17.65" ID)' },
      { value: '21.18', label: '24" (21.18" ID)' },
      { value: '26.47', label: '30" (26.47" ID)' },
      { value: '31.76', label: '36" (31.76" ID)' }
    ],
  };

  useEffect(() => {
    // Only reset subtype if type is changed to a different value
    if (type && !subtypeOptions[type].some(option => option.value === subtype)) {
      console.log("changed")
      setSubtype('');
      setRestrictionSize('');
      // console.log('subtype',subtype)
    }
    // if (subtype) {

    //   if (!restrictionSizeOptions[subtype].some(option => option.value === restrictionSize)) {
    //     setRestrictionSize('');
    //   }
      
    // }
  }, [type, subtype, restrictionSize]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGasWell = { id, gasWellName, lat, lng, type, subtype, landfillsID };
    onSubmit(newGasWell);
    // Clear the form fields
    setGasWellName('');
    setLat('');
    setLng('');
    setType('');
    setSubtype('');
  };

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Gas Well Name"
          value={gasWellName}
          onChange={(e) => setGasWellName(e.target.value)}
          required
        />
        <Group grow>
        <NumberInput
          label="Latitude"
          value={lat}
          onChange={(value) => setLat(value)}
          required
          precision={6}
        />
        <NumberInput
          label="Longitude"
          value={lng}
          onChange={(value) => setLng(value)}
          required
          precision={6}
        />
        </Group>
        
        <Button style={{margin: '1rem 0 0.5rem 0'}} leftSection={<IconMapPinFilled size={14} />} disabled={loading} onClick={getUserLocation}>{loading ? <Loader  color="blue" size="xs" /> : 'Get Location'}</Button>
        <Select
          label="Type"
          value={type}
          onChange={(value) => setType(value)}
          data={typeOptions}
          required
        />
        <Select
          label="Subtype"
          value={subtype}
          onChange={(value) => setSubtype(value)}
          disabled={!type && !subtype}
          data={type ? subtypeOptions[type] : []}
          required
        />
        <Select
          label="Restriction Size"
          value={restrictionSize}
          onChange={(value) => setRestrictionSize(value)}
          disabled={!type && !subtype && !restrictionSize}
          data={subtype ? restrictionSizeOptions[subtype] : []}
          required
        />
        <Group position="right" mt="md">
          <Button type="submit">{gasWell ? 'Update Gas Well' : 'Add Gas Well'}</Button>
        </Group>
      </form>
    </Box>
  );
};

export default AddGasWellForm;
