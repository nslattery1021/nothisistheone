// src/Landfills.js
import React, { useEffect, useState } from 'react';
import LandfillList from './LandfillList';
import AddLandfill from './AddLandfill';
import { useDisclosure } from '@mantine/hooks';
import { Flex, Modal, Button } from '@mantine/core';

const Landfills = () => {
    const [opened, { open, close }] = useDisclosure(false);

    
  return (
<div>
    <Modal opened={opened} onClose={close} title="Add Landfill">
       <AddLandfill />
    </Modal>
    <Flex
      mih={50}
      gap="sm"
      justify="flex-end"
      align="center"
      direction="row"
      wrap="nowrap"
    >
<Button onClick={open}>Open modal</Button>
    </Flex>

    <LandfillList />

</div>
  );
};

export default Landfills;
