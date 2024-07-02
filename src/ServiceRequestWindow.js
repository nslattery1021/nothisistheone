import React, { useState, useEffect } from 'react';
import { TextInput, NumberInput, Button, Group, Box, Select, Textarea } from '@mantine/core';
import { IconMapPinFilled } from '@tabler/icons-react';

const ServiceRequestWindow = ({ onSubmit, service, devicesID, serviceTypes }) => {
  const [title, setTitle] = useState(service?.title ?? '');
  const [priority, setPriority] = useState(service?.priority ?? 'Low');
  const [servicetypesID, setServicetypesID] = useState(service?.servicetypesID ?? '');
  const [id, setId] = useState(service?.id ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newService = { id, title, priority, devicesID, servicetypesID };
    onSubmit(newService);

    setTitle('');
    setPriority('');
    setServicetypesID('');
  };

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={handleSubmit}>
        <Textarea
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
       
        <Select
          label="Service Type"
          value={servicetypesID}
          onChange={(value) => setServicetypesID(value)}
          data={serviceTypes}
          required
        />
        <Select
          label="Priority"
          value={priority}
          onChange={(value) => setPriority(value)}
          data={["High","Medium","Low"]}
          required
        />
        <Group position="right" mt="md">
          <Button disabled={!priority || !servicetypesID || !title} type="submit">{service ? 'Update Service' : 'Add Service'}</Button>
        </Group>
      </form>
    </Box>
  );
};

export default ServiceRequestWindow;
