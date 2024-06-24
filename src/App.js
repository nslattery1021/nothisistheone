// src/App.js
import React from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Image, Tabs, rem } from '@mantine/core';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { IconBuildingFactory, IconCalendarMonth, IconFileDescription, IconPackages, IconInfoSquareRounded, IconMessageCircle, IconSettings } from '@tabler/icons-react';

import Home from './Home'; // Ensure correct import path
import Inventory from './Inventory'; // Ensure correct import path
import LandfillMapList from './LandfillMapList'; // Ensure correct import path
import LandfillProfile from './LandfillProfile'; // Ensure correct import path
import Settings from './Settings'; // Ensure correct import path
import ExampleComponent from './ExampleComponent'; // Ensure correct import path

const App = () => {



  return (
    <div>
    {/* Routes nest inside one another. Nested route paths build upon
          parent route paths, and nested route elements render inside
          parent route elements. See the note about <Outlet> below. */}
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index path="/home" element={<Home />} />
        <Route path="/landfills" element={<LandfillMapList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/example" element={<ExampleComponent />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/landfill/:id" element={<LandfillProfile />} />

        {/* Using path="*"" means "match anything", so this route
              acts like a catch-all for URLs that we don't have explicit
              routes for. */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes></div>
  );
};
function Layout() {
  const iconStyle = { width: rem(20), height: rem(20) };
  const navigate = useNavigate();
  const { tabValue } = useParams();
  return (
    <div>
      {/* <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/landfills">Landfills</Link>
          </li>
          
          <li>
            <Link to="/dispatch">Dispatch</Link>
          </li>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
          <li>
            <Link to="/inventory">Inventory</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>
        </ul>
      </nav> */}
<Tabs
      value={tabValue}
      onChange={(value) => navigate(`/${value}`)}
    >
      <Tabs.List>
      <Tabs.Tab style={{flexGrow: 0}} value="home"><Image
            height={35}
            width={35}
            style={{width: "35px"}}
            fit="contain"
            src="/APISlogo.png"
            /></Tabs.Tab>
      <Tabs.Tab value="landfills" leftSection={<IconBuildingFactory stroke={1.1} style={iconStyle}/>}></Tabs.Tab>
      <Tabs.Tab value="dispatch" leftSection={<IconCalendarMonth stroke={1.1} style={iconStyle} />}></Tabs.Tab>
      <Tabs.Tab value="reports" leftSection={<IconFileDescription stroke={1.1} style={iconStyle} />}></Tabs.Tab>
      <Tabs.Tab value="inventory" leftSection={<IconPackages stroke={1.1} style={iconStyle} />}></Tabs.Tab>
      <Tabs.Tab value="settings" leftSection={<IconSettings stroke={1.1} style={iconStyle} />}></Tabs.Tab>
      {/* <Tabs.Tab value="example" leftSection={<IconInfoSquareRounded stroke={1.1} style={iconStyle} />}></Tabs.Tab> */}

      </Tabs.List>
    </Tabs>

     
      <Outlet />
    </div>
  );
}


function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}

function NoMatch() {
  return (
    <div style={{padding: "0.75rem"}}>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
const customAuthenticator = withAuthenticator(App, {
  hideSignUp: true
});

export default customAuthenticator;
