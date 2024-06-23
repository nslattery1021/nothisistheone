// src/App.js
import React from 'react';
import { Flex, Button, Tabs } from '@mantine/core';
import { getCurrentUser } from 'aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import Landfills from "./Landfills";
import { IconLogout } from '@tabler/icons-react';

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
    <div>
        <Flex
      mih={50}
      gap="sm"
      justify="flex-end"
      align="center"
      direction="row"
      wrap="nowrap"
    >
<Button leftSection={<IconLogout size={14} />} variant="light" color="red" onClick={handleSignOut}>Sign Out</Button>
    </Flex>

    <Tabs defaultValue="landfills">
      <Tabs.List>
        <Tabs.Tab value="landfills">
          Landfills
        </Tabs.Tab> 
      </Tabs.List>
      <Tabs.Panel value="landfills" style={{padding: "0.75rem"}}>        
        <Landfills />
      </Tabs.Panel>
    </Tabs>
    </div>
    
  );
};

export default Nav;
