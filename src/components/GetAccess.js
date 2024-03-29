import { Card, Divider, Space } from 'antd';
import React, { useState } from 'react';
import { GetDirectoryAccess, HandleDirectoryEntry, GenerateDirectoryList } from '../lib/Access';
import Dragdrop from './Dragdrop';
import Settings from './Settings';
import "../tester.css"
import { get } from 'idb-keyval';
import { text, bus_sort } from '../lib/BustoolsHandler';

let masterTree = [];

function GetAccess() {
  const [data, setData] = useState([]);

  const startAccess = async () => {
    let rawTree = await GetDirectoryAccess();
    masterTree = [...masterTree, rawTree];
    setData(masterTree);
  };

  let props = {
    async onDrop(e) {
      e.preventDefault();
      const fileHandlesPromises = [...e.dataTransfer.items]
        .filter((item) => item.kind === 'file' || item.kind === 'directory')
        .map((item) => item.getAsFileSystemHandle());

      for await (const handle of fileHandlesPromises) {
        if (handle.kind === 'directory') {
          const out = { name: handle.name };
          let pathList = {};
          let bkupHandle = handle;
          await HandleDirectoryEntry(handle, out, bkupHandle, pathList);
          let rawTree = await GenerateDirectoryList(pathList, bkupHandle);
          masterTree = [...masterTree, rawTree];
          setData(masterTree);
        }
      }
    }
  }
  props.onClick = startAccess;

  const onSelect = async (keys, info) => {
    //console.log('Trigger Select', keys, info);
    console.log(keys);
    let filehandle = await get(keys[0]);
    console.log('Filehandle acquired', filehandle);
    if (filehandle.kind === "file") {
      let file = await filehandle.getFile();
      await bus_sort(file);
    }
  };

  const onExpand = async (keys, info) => {
    //console.log('Trigger Expand', keys, info);
    //let dirhandle = await get(keys[0]);
    //console.log('Dirhandle acquired', dirhandle);
  };
  return (
    <>
      <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
        <Card
          title="Bustools Text"
          bordered={false}
          className="custom-card"
        >
          <Dragdrop {...props}></Dragdrop>
          <Divider />
          <Settings {...[data]} />
        </Card>
      </Space>
    </>
  );
}
export default GetAccess;