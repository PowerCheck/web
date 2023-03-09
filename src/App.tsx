import React from 'react';
// import logo from './logo.svg';
import './App.css';

import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

import ExtensionIcon from '@mui/icons-material/Extension';
import DescriptionIcon from '@mui/icons-material/Description';

import reports from './reports';
import plugins from './plugins';
import scripts from './scripts';

import { ApiProvider } from './MiscFunctions';

const App = () => {
  const dataProvider = simpleRestProvider(ApiProvider());

  return (
    <Admin
      title="Admin title"
      dataProvider={dataProvider}
    >
      <Resource name = "reports" {...reports} />
      <Resource name = "plugins" {...plugins} icon={ExtensionIcon}/>
      <Resource name = "scripts" {...scripts} icon={DescriptionIcon}/>
    </Admin>
  );
}

export default App;
