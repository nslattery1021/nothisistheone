import React, { useState } from 'react';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import { Input } from '@mantine/core';

const libraries = ['places'];

const AutocompleteInput = ({ onPlaceSelected }) => {
  const [searchBox, setSearchBox] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const onLoad = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();

    if (places.length > 0) {
      const place = places[0];
      const address = place.formatted_address;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setInputValue(address);

      console.log(onPlaceSelected)


      if (typeof onPlaceSelected === 'function') {
        onPlaceSelected({ address, lat, lng });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyCqbQG04qDIjM-Nra1Mj2WZKBx-ypiOJ0k" libraries={libraries}>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <Input
          type="text"
          placeholder="Enter an address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </StandaloneSearchBox>
    </LoadScript>
  );
};

export default AutocompleteInput;
