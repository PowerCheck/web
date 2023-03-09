import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  SearchInput,
} from 'react-admin';

import { FilterByRow } from '../MiscFunctions';

const searchFilter = [
  <SearchInput source="q" alwaysOn />,
];

const ScriptList = (props:any) => {
  return (
    <List {...props}
      title = "Scripts"
      filters={searchFilter}
    >
      <Datagrid rowClick={FilterByRow}>
        <TextField source="Name" />
        <TextField source="Author" />
        <TextField source="Version" />
        <TextField source="Category" />
        <TextField source="Count" />
      </Datagrid>

    </List>
  );
};

export default ScriptList;
