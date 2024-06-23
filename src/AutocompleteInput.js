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
      const addressComponents = place.address_components;
      const components = {};

      addressComponents.forEach(component => {
        const types = component.types;
        if (types.includes('street_number')) {
          components.streetNumber = component.long_name;
        } else if (types.includes('route')) {
          components.street = component.long_name;
        } else if (types.includes('locality')) {
          components.city = component.long_name;
        } else if (types.includes('administrative_area_level_1')) {
          components.state = component.short_name;
        } else if (types.includes('postal_code')) {
          components.zip = component.long_name;
        } else if (types.includes('country')) {
          components.country = component.long_name;
        }
      });

      const addressLine = `${components.streetNumber || ''} ${components.street || ''}`.trim();

      setInputValue(address);
      if (typeof onPlaceSelected === 'function') {
        onPlaceSelected({ address: addressLine, lat, lng, ...components });
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
        <Input
          type="text"
          placeholder="Enter an address"
          value={inputValue || ''}
          onChange={(e) => setInputValue(e.target.value)}
          style={{ width: '100%' }}
        />
      </StandaloneSearchBox>
    </LoadScript>
  );
};

export default AutocompleteInput;
