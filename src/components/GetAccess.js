import { Button, Card, Tree, Typography, Divider, Space } from 'antd';
import React, { useState } from 'react';
import { BFS } from '../lib/DirRootTree';
import { GetDirectoryAccess, HandleDirectoryEntry } from '../lib/Access';
import Dragdrop from './Dragdrop';
import { writeFile } from '../lib/fs-helper';
import "../tester.css"
import { get } from 'idb-keyval';

const { DirectoryTree } = Tree;
const { Title } = Typography;


let masterTree = [];

async function tester() {
  let fileHandle;
  [fileHandle] = await window.showOpenFilePicker();
  let file = await fileHandle.getFile();
  console.log('handle', fileHandle);
  console.log('file', file);
  const root = await navigator.storage.getDirectory();
  const sandbox = await root.getDirectoryHandle('sandbox', {
    create: true,
  });
  let result = await sandbox.getFileHandle("output.txt", { create: true });
  //let content = await readFile(await fileHandle.getFile());
  await writeFile(result, "Hello");
  console.log(await (await result.getFile()).text());
  let path = await root.resolve(result);
  console.log(path);
  await window.callMain(["text", "-p"]);
}

function GetAccess() {
  const [data, setData] = useState([]);
  
  const startAccess = async () => {
    let rawTree = await GetDirectoryAccess();
    masterTree = [...masterTree, ...await BFS(rawTree)];
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
          await HandleDirectoryEntry( handle, out );
          masterTree = [...masterTree, ...await BFS(out)];
          setData(masterTree);
        } else {
          console.log(`File: ${handle.name}`);
        }
      }
    }
  }
  props.onClick = startAccess;

  const onSelect = async (keys, info) => {
    console.log('Trigger Select', keys, info);
    let filehandle = await get(keys[0]);
    console.log('Filehandle acquired', filehandle);
  };

  const onExpand = async (keys, info) => {
    //console.log('Trigger Expand', keys, info);
    let dirhandle = await get(keys[0]);
    console.log('Dirhandle acquired', dirhandle);
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