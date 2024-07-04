import React, { useState, useEffect } from 'react';
import { TextInput, Collapse, Divider, Button, Group, Box, Select, Textarea, Chip } from '@mantine/core';
import { IconMapPinFilled } from '@tabler/icons-react';

const ServiceRequestWindow = ({ onSubmit, service, devicesID, serviceTypes, deleteServiceRequest }) => {
  const [title, setTitle] = useState(service?.title ?? '');
  const [completedNotes, setCompletedNotes] = useState(service?.completedNotes ?? '');
  const [priority, setPriority] = useState(service?.priority ?? 'Low');
  const [servicetypesID, setServicetypesID] = useState(service?.servicetypesID ?? '');
  const [id, setId] = useState(service?.id ?? '');
  const [isComplete, setIsComplete] = useState(service?.isComplete ?? false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newService = { id, title, priority, devicesID, servicetypesID, isComplete, completedNotes };
    onSubmit(newService);

    setTitle('');
    setPriority('Low');
    setServicetypesID('');
    // setIsComplete(false);
  };

  

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={handleSubmit}>
        <Chip 
        checked={isComplete}
        size="xl" 
        radius="sm"
        my='xs'
        onChange={setIsComplete}>
          Complete
          </Chip>
        <Textarea
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
       <Group grow position="right" mt="sm" mb="sm">
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
        </Group>
        <Collapse in={isComplete}>
          <Textarea
            label="Completed Notes"
            value={completedNotes}
            onChange={(e) => setCompletedNotes(e.target.value)}
            required={isComplete}
          />
        </Collapse>
        <Divider my="sm"/>
        <Group grow position="right" mt="md">
          <Button onClick={() => deleteServiceRequest(service)} style={{display: !!service ? '' : 'none'}} color='red'>Delete</Button>
          <Button disabled={!priority || !servicetypesID || !title} type="submit">{service ? 'Update Service' : 'Add Service'}</Button>
        </Group>
      </form>
    </Box>
  );
};

export default ServiceRequestWindow;
