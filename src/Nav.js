// src/App.js
import React from 'react';
import { Image, Tabs, rem } from '@mantine/core';
import { IconBuildingFactory, IconCalendarMonth, IconFileDescription, IconPackages, IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import Landfills from "./Landfills";

const Nav = () => {
    const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Tabs defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery">
        <Image
            radius="md"
            height={35}
            width={35}
            fit="contain"
            src="APISlogo.png"
            />
        </Tabs.Tab>
        <Tabs.Tab value="landfills" leftSection={<IconBuildingFactory style={iconStyle} />}>
          Landfills
        </Tabs.Tab>
        <Tabs.Tab value="dispatch" leftSection={<IconCalendarMonth style={iconStyle} />}>
          Dispatch
        </Tabs.Tab>
        <Tabs.Tab value="reports" leftSection={<IconFileDescription style={iconStyle} />}>
          Reports
        </Tabs.Tab>
        <Tabs.Tab value="inventory" leftSection={<IconPackages style={iconStyle} />}>
          Inventory
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings style={iconStyle} />}>
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" style={{padding: "0.75rem"}}>
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="landfills" style={{padding: "0.75rem"}}>
        <h2>Landfill Management</h2>
        
        <Landfills />
      </Tabs.Panel>

      <Tabs.Panel value="settings" style={{padding: "0.75rem"}}>
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
};

export default Nav;
