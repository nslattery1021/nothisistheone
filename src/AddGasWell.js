import React, { useState, useEffect } from 'react';
import { TextInput, NumberInput, Button, Group, Box, Select, Loader } from '@mantine/core';
import { IconMapPinFilled } from '@tabler/icons-react';

const AddGasWellForm = ({ onSubmit, landfillsID, gasWell }) => {
  const [gasWellName, setGasWellName] = useState(gasWell?.gasWellName ?? '');
  const [lat, setLat] = useState(gasWell?.lat ?? '');
  const [lng, setLng] = useState(gasWell?.lng ?? '');
  const [type, setType] = useState(gasWell?.type ?? '');
  const [subtype, setSubtype] = useState(gasWell?.subtype ?? '');
  const [id, setId] = useState(gasWell?.id ?? '');
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  const typeOptions = [
    { value: 'Header Monitor', label: 'Header Monitor' },
    { value: 'Smart Well', label: 'Smart Well' },
  ];

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

  useEffect(() => {
    // Only reset subtype if type is changed to a different value
    if (type && !subtypeOptions[type].some(option => option.value === subtype)) {
      setSubtype('');
    }
  }, [type, subtype]);

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
        <Button style={{margin: '0.5rem 0'}} leftSection={<IconMapPinFilled size={14} />} disabled={loading} onClick={getUserLocation}>{loading ? <Loader  color="blue" size="xs" /> : 'Get Location'}</Button>
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
          data={type ? subtypeOptions[type] : []}
          disabled={!type && !subtype}
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
