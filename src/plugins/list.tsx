import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  SearchInput,
  DateField
} from 'react-admin';

import { FilterByRow } from '../MiscFunctions';

const searchFilter = [
  <SearchInput source="q" alwaysOn />,
];

const PluginsList = (props:any) => {
  return (
    <List {...props}
      title = "Plugins"
      filters={searchFilter}
    >
      <Datagrid rowClick={FilterByRow}>
        <TextField source="Plugin" />
        <TextField source="Version" />
        <DateField source="LastReport" showTime={true} />
        <TextField source="Count" />
      </Datagrid>

    </List>
  );
};

export default PluginsList;
