import { Button, Card, Tree, Typography, Divider, Space } from 'antd';
import React, { useState } from 'react';
import { GetDirectoryAccess, HandleDirectoryEntry, GenerateDirectoryList } from '../lib/Access';
import Dragdrop from './Dragdrop';
import "../tester.css"
import { get } from 'idb-keyval';
import { text } from '../lib/BustoolsHandler';

const { DirectoryTree } = Tree;
const { Title } = Typography;

let masterTree = [];

async function tester() {
  /*
  let CLI = await getCLI();
  let y = await entries();
  for(let i = 0; i < y.length; i++) {
    if(y[i][1].kind === 'file') {
      someFiles.push(await y[i][1].getFile());
    }
  }
  const paths = await CLI.mount(someFiles);
  console.log('paths', paths);
  const output = await CLI.exec(`bustools text -p ${paths[2]}`);
  console.log(output);
  */
}

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
          const out = {name: handle.name}; 
          let pathList = {};
          let bkupHandle = handle;
          await HandleDirectoryEntry( handle, out, bkupHandle, pathList);
          let rawTree = await GenerateDirectoryList(pathList, bkupHandle);
          masterTree = [...masterTree, rawTree];
          setData(masterTree);
        } else {
          console.log(`File: ${handle.name}`);
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
    if(filehandle.kind === "file") {
      let file = await filehandle.getFile();
      await text(file);
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
          <Button type="primary" style={{ margin: 5 }} onClick={tester}>Access Directory</Button>
          <Button type="primary" style={{ margin: 5 }} onClick={tester}>Access File</Button>
          <Dragdrop {...props}></Dragdrop>
          <Divider />
          {data.length <= 0 &&
            <Title level={5} type='danger'>
              Currently there are no directories with access.
            </Title>
          }
          <DirectoryTree
            multiple
            onExpand={onExpand}
            onSelect={onSelect}
            treeData={data}
          />
        </Card>
      </Space>
    </>
  );
}
export default GetAccess;