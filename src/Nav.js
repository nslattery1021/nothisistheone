// src/App.js
import React from 'react';
import { Image, Tabs, rem } from '@mantine/core';
import { IconBuildingFactory, IconCalendarMonth, IconFileDescription, IconPackages, IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import LandfillMapList from "./LandfillMapList";
import Settings from "./Settings";
import { getCurrentUser } from 'aws-amplify/auth';

async function currentAuthenticatedUser() {
  try {
    const { username, userId, signInDetails } = await getCurrentUser();
    console.log(`The username: ${username}`);
    console.log(`The userId: ${userId}`);
    console.log(`The signInDetails: ${signInDetails}`);
  } catch (err) {
    console.log(err);
  }
}
const Nav = () => {
    const iconStyle = { width: rem(20), height: rem(20) };
    currentAuthenticatedUser()
  return (
    <Tabs defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab value="gallery">
        <Image
            height={35}
            width={35}
            fit="contain"
            src="APISlogo.png"
            />
        </Tabs.Tab>
        <Tabs.Tab value="landfills" leftSection={<IconBuildingFactory stroke={1.1}  style={iconStyle} />}>
          
        </Tabs.Tab>
        <Tabs.Tab value="dispatch" leftSection={<IconCalendarMonth stroke={1.1} style={iconStyle} />}>
          
        </Tabs.Tab>
        <Tabs.Tab value="reports" leftSection={<IconFileDescription stroke={1.1}  style={iconStyle} />}>
    
        </Tabs.Tab>
        <Tabs.Tab value="inventory" leftSection={<IconPackages stroke={1.1} style={iconStyle} />}>
          
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings stroke={1.1}  style={iconStyle} />}>
          
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" style={{padding: "0.75rem"}}>
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="landfills" style={{padding: "0.75rem"}}>        
        <LandfillMapList />
      </Tabs.Panel>

      <Tabs.Panel value="settings" style={{padding: "0.75rem"}}>
        <Settings />
      </Tabs.Panel>
    </Tabs>
  );
};

export default Nav;
