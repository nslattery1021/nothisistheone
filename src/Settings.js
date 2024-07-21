// src/App.js
import React from 'react';
import { Flex, Button, Tabs } from '@mantine/core';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { IconLogout } from '@tabler/icons-react';

import Landfills from "./Landfills";
import Users from "./Users";

async function handleSignOut() {
  try {
    await signOut({ global: true });
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

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
    currentAuthenticatedUser()
  return (
    <div style={{padding: "0.75rem"}}>
        <Flex
      mih={50}
      gap="sm"
      justify="flex-end"
      align="center"
      direction="row"
      wrap="nowrap"
    >
    </Flex>

    <Tabs defaultValue="landfills">
      <Tabs.List>
        <Tabs.Tab value="landfills">
          Landfills
        </Tabs.Tab> 
        <Tabs.Tab value="serviceTypes">
          Service Types
        </Tabs.Tab> 
        <Tabs.Tab value="tags">
          Tags
        </Tabs.Tab> 
        <Tabs.Tab value="trucks">
          Trucks
        </Tabs.Tab> 
        <Tabs.Tab value="users">
        Users
        </Tabs.Tab> 
      </Tabs.List>
      <Tabs.Panel value="landfills">        
        <Landfills />
      </Tabs.Panel>
      <Tabs.Panel value="users">        
        <Users />
      </Tabs.Panel>
    </Tabs>
    </div>
    
  );
};

export default Nav;
