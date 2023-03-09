import * as React from 'react';
import {
  List,
  Datagrid,
  TextField,
  SearchInput,
  DateField,
} from 'react-admin';

const searchFilter = [
  <SearchInput source="q" alwaysOn />,
];

const ReportList = (props:any) => {
  return (
    <>
    <List {...props}
      title = "Reports"
      sort = {{field: "Date", order: "DESC"}}
      filters={searchFilter}
    >
      <Datagrid rowClick="show">
        <TextField source="Title" />
        <TextField source="Plugin" />
        <TextField source="Version" />
        <DateField source="Runtime.Start" label="Date" showTime={true} />
      </Datagrid>

    </List>
    </>
  );
};

export default ReportList;