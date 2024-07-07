// src/App.js
import React from 'react';
// import { withAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';
import '@mantine/dates/styles.css';
import { Image, Tabs, rem } from '@mantine/core';
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useNavigate, useParams } from 'react-router-dom';
import { IconBuildingFactory, IconCalendarMonth, IconFileDescription, IconPackages, IconInfoSquareRounded, IconMessageCircle, IconSettings } from '@tabler/icons-react';
import {I18n} from 'aws-amplify/utils'
import Home from './Home'; // Ensure correct import path
import Inventory from './Inventory'; // Ensure correct import path
import LandfillMapList from './LandfillMapList'; // Ensure correct import path
import LandfillMap from './LandfillMap'; // Ensure correct import path
import NewMap from './NewMap'; // Ensure correct import path
import LandfillProfiles from './LandfillProfiles'; // Ensure correct import path
import Settings from './Settings'; // Ensure correct import path
import ExampleComponent from './ExampleComponent'; // Ensure correct import path
import Dispatch from './Dispatch';
const components = {
  Header() {
    return (
      <div style={{textAlign:"center", padding:'1rem'}}>
        <Image
        height={200}
        width={200}
        fit="contain"
          alt="Apis logo"
          src="/APISlogo.png"
        />
      </div>
    );
  },
}
const formFields = {
  signUp: {
    email: {
      order: 1
    },
    password: {
      order: 2
    },
    confirm_password: {
      order: 3
    },
    family_name: {
      label: 'Last Name',
      placeholder: 'Enter your last name',
      order: 5
    },
    given_name: {
      label: 'First Name',
      placeholder: 'Enter your first name',
      order: 4
    }
  }
}

I18n.putVocabulariesForLanguage('en', {
  'Sign In' : 'Login',
  'Sign in' : 'Log in',
})
 
const App = () => {

  // currentAuthenticatedUser();
  

  return (
    <Authenticator hideSignUp formFields={formFields} components={components} signUpAttributes={[
      'address',
      'birthdate',
      'email',
      'family_name',
      'given_name',
      'locale',
      'phone_number',
      'picture',
      'updated_at',
      'zoneinfo',
    ]}>
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
        <Route path="/dispatch" element={<Dispatch />} />
        <Route path="/landfill/:id" element={<LandfillMap />} />
        {/* <Route path="/landfill/:id" element={<NewMap />} /> */}
        <Route path="/profile/:id" element={<LandfillProfiles />} />

        {/* Using path="*"" means "match anything", so this route
              acts like a catch-all for URLs that we don't have explicit
              routes for. */}
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
    </Authenticator>
  );
};
function Layout() {
  const iconStyle = { width: rem(20), height: rem(20) };
  const navigate = useNavigate();
  const { tabValue } = useParams();
  return (
    <div>
   
<Tabs
      value={tabValue}
      onChange={(value) => navigate(`/${value}`)}
      defaultValue="home"
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
// const customAuthenticator = withAuthenticator(App, {
//   hideSignUp: false, // Change to true if you want to hide sign-up
//   components: {
//     SignIn: {
//       Header() {
//         return <div className="authenticator-container">Sign in to your account</div>;
//       },
//       Footer() {
//         return <div className="authenticator-container">Footer content</div>;
//       },
//     },
//     SignUp: {
//       Header() {
//         return <div className="authenticator-container">Create a new account</div>;
//       },
//       Footer() {
//         return <div className="authenticator-container">Footer content</div>;
//       },
//     },
//   },
// });

export default App;
