import * as React from 'react';
import { RaRecord, useRecordContext } from 'react-admin';
import get from 'lodash/get';

export const UTCDateField = ({source}:any) => {
  const record:RaRecord = useRecordContext();
  const timestamp:number = get(record, source)
  const date:Date = new Date(timestamp);

  return <span>{date.toUTCString()}</span>;
}
UTCDateField.defaultProps = { label: 'Date (UTC)' };
