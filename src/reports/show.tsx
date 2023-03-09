import * as React from 'react';

import {
  RaRecord,
  useRecordContext,
  Show,
  SimpleShowLayout,
} from 'react-admin';

import Grid2 from '@mui/material/Unstable_Grid2'

import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';

import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { styled } from '@mui/material/styles';

import { UTCDateField } from '../CustomFields';

const ReportShow = () => {

  return (
    <Show title={<ReportTitle />}>
      <SimpleShowLayout sx={{maxHeight: 'calc(100vh - 80px)', maxWidth: 'calc(100vw - 80px)'}}>
        <Grid2 container={true} spacing={0}>
          <Grid2 xs={2} sx={{width:"fitContent", maxHeight: 'calc(100vh - 100px)', overflow: 'auto'}}>
              <ScriptList source="Data.Script" />
          </Grid2>
          <Grid2 xs sx={{maxWidth:'100hv', maxHeight: 'calc(100vh - 100px)', overflow: 'auto', marginTop: '10px' }}>
            <ReportBody source="Data" />
          </Grid2>
        </Grid2>
      </SimpleShowLayout>
    </Show>
  );
};

const ReportTitle = () => {
  const record = useRecordContext();
  // the record can be empty while loading
  if (!record) return null;
  return <span>{record.Title} - {<UTCDateField source="Runtime.Start" />}</span>;
};

const ScriptList = (props:any) => {
  const record:RaRecord = useRecordContext();

  let currentGroupName:string = ""

  return (
    <List sx={{width:"100%"}} component="ul" dense={true} key={RandomKey()}>
      {record.Data.filter( (element:any) => element.Details.length > 0 ).map( (element:any) => {
        let groupName:string = "";
        let scriptName:string = "";

        if (element.hasOwnProperty("Script")) {
          [groupName, scriptName] = element.Script.split("\\");
        }

        if (element.Category === "PowerCheckCore") {
          groupName = "PowerCheck";
          scriptName = element.Name;
        }

        groupName = RemoveNumberPrefix(groupName);
        scriptName = RemoveNumberPrefix(scriptName);

        if (groupName !== currentGroupName) {
          currentGroupName = groupName;
          return (
            <div key={RandomKey()}>
              <ListItem sx={{margin: 0, padding: 0}}>
                <ListSubheader component="div">{groupName}</ListSubheader>
              </ListItem>
              <ListItem sx={{margin: 0, padding: 0}}>
                <ListItemButton onClick={()=>{HandleClickScroll(element.Name)}}>
                  <ListItemText primary={scriptName.replace(".ps1", "")} />
                </ListItemButton>
              </ListItem>
            </div>
          );
        } else {
          return (
            <ListItem key={RandomKey()} sx={{margin: 0, padding: 0}}>
              <ListItemButton onClick={()=>{HandleClickScroll(element.Name)}}>
                <ListItemText primary={scriptName.replace(".ps1", "")}  />
              </ListItemButton>
            </ListItem>
          );
        }
      })}
    </List>
  );
};

const ReportBody = (source:any) => {
  const record:RaRecord = useRecordContext();

  let currentGroupName:string = "";
  let i:number = 0;

  return (
    <div key={RandomKey()}>
      {record.Data.filter( (element:any) => element.Details.length > 0 ).map( (element:any) => {
        let groupName:string = "";
        i ++;

        if (typeof element.Script !== "undefined") {
          groupName = RemoveNumberPrefix(element.Script.split("\\")[0]);
        } else {
          groupName = "PowerCheck";
        }

        if (groupName !== currentGroupName) {
          currentGroupName = groupName
        } else {
          groupName = "";
        }

        return ScriptTable(i, groupName, element);
      })}
    </div>
  );
}

const ScriptTable = (i:number, group:string, reportRecord:any) => {
  let spacer:any = <span>&nbsp;</span>;

  if (group !== "") {
    spacer = <h3 id={`plugin-${i}`} style={{"borderTop":"1px solid #e0e0e0", "paddingTop": "10px"}}>{group}</h3>;
  }

  return (
    <div key={RandomKey()}>
      {spacer}
      <div id={btoa(reportRecord.Name)}></div>
      <TableContainer >
      <Table size="small" sx={{border:"1px solid #e0e0e0", backgroundColor: "#fafafb"}}>
        <TableBody>
          <TableRow>
            <TableCell sx={{"fontWeight":"bolder"}}>{reportRecord.Header}</TableCell>
          </TableRow>
          <TableRow sx={{"backgroundColor":"rgba(0, 0, 0, 0.04)"}}>
            <TableCell sx={{"fontStyle": "italic"}}>{reportRecord.Comments}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><ScriptData data={reportRecord}/></TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </TableContainer>
    </div>
  );
}

const ScriptData = (data:any):any => {
  let reportRecord:any = data.data;

  switch (reportRecord.Display.toLowerCase()) {
    case "table":
      return <ScriptDataTable data={reportRecord} />;
    case "list":
      return <ScriptDataList data={reportRecord} />;
    default:
      return <></>;
  }
}

const ScriptDataTable = (data:any):any => {
  let rows:any = data.data.Details;
  let propertyCastAs:any = data.data.CastAs;

  if ( rows.length === 0) {
    return <div key={RandomKey()}></div>;
  }

  return (
    <Table size="small" key={RandomKey()}>
      <TableHead key={RandomKey()}>
        <TableRow sx={{"backgroundColor":"rgba(0, 0, 0, 0.08)"}} key={RandomKey()}>
          {Object.keys(rows[0]).map( (key:string) => {
            return <TableCell sx={{"fontWeight":"bold"}} key={RandomKey()}>{key}</TableCell>;
          })}
        </TableRow>
      </TableHead>
      <TableBody key={RandomKey()}>
        {rows.map( (row:any) => {
          return <StyledTableRow key={RandomKey()}>
            {Object.keys(row).map( (cell:any) => {
              let type:string|null = null;

              // Gets the type of the property if specified in the CastAs
              if (typeof propertyCastAs !== "undefined" && null !== propertyCastAs && false !== propertyCastAs) {
                Object.keys(propertyCastAs).forEach(typeMap => {
                  // In case propertyCastAs[typeMap] is a string instead of an array
                  if (typeof propertyCastAs[typeMap] === "string") {
                    if (propertyCastAs[typeMap] === cell) {type = typeMap;}
                    return <TableCell key={RandomKey()}>&nbsp;</TableCell>;
                  }
                  propertyCastAs[typeMap].map( (property:string) => {
                    if (property === cell) {type = typeMap;}
                    return <TableCell key={RandomKey()}>&nbsp;</TableCell>;
                  })
                });
              }

              return <TableCell key={RandomKey()}>{ WriteCellData(row[cell], type) }</TableCell>
            })}
          </StyledTableRow>
        })}
      </TableBody>
    </Table>
  );
}

const ScriptDataList = (data:any):any => {
  let rows:any = data.data.Details;

  return (
    <Table size="small">
      <TableBody>
        {Object.keys(rows[0]).map( (key:any) => {
          return <StyledTableRow key={RandomKey()}>
            <StyledTableCellHeader>{key}</StyledTableCellHeader>
            <TableCell>{rows[0][key]}</TableCell>
          </StyledTableRow>
        })}
      </TableBody>
    </Table>
  );
}

const RemoveNumberPrefix = (data:string):string => {
  if (typeof data === 'undefined') { return ""; }
  return data.replace(/\d+\s+?/gm, "");
}

const WriteCellData = (data:any, type:any) => {

  if (null !== type) {
    switch (type.toLowerCase()) {
      case "unixtimestamp":
        return `${new Date(data).toLocaleString()}`;
    }
  }

  if (null === data) {
    return "";
  }

  switch (typeof data) {
    case "string":
    case "number":
      return data;
    case "boolean":
      return `${data}`;
    default:
      return `[${typeof data}]`;
  }
}

const RandomKey = () => {
  return Math.ceil(Math.random() * 10000000000);
}

const HandleClickScroll = (i:string) => {
  const element = document.getElementById(btoa(i));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', inline: 'start' });
  }
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
":last-child td":{border:"none"}
}));

const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
"backgroundColor": "rgba(0, 0, 0, 0.08)",
"fontWeight":"bolder",
"width": "0px"
}));

export default ReportShow;
