import { Button, Card, Tree, Typography, Divider, Space } from 'antd';
import React, { useState } from 'react';
import { BFS } from '../lib/DirRootTree';
import { GetDirectoryAccess, HandleDirectoryEntry } from '../lib/Access';
import Dragdrop from './Dragdrop';
import { writeFile } from '../lib/fs-helper';
import "../tester.css"

const { DirectoryTree } = Tree;
const { Title } = Typography;


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
    console.log(rawTree);
    let tree = BFS(rawTree);
    setData(tree);
  };

  let props = {
    async onDrop(e) {
      e.preventDefault();
      const fileHandlesPromises = [...e.dataTransfer.items]
        .filter((item) => item.kind === 'file')
        .map((item) => item.getAsFileSystemHandle());
  
      for await (const handle of fileHandlesPromises) {
        if (handle.kind === 'directory') {
          console.log('Directory', handle);
          const out = {};
          await HandleDirectoryEntry( handle, out );
          let droptree = BFS(out);
          setData(droptree);
        } else {
          console.log(`File: ${handle.name}`);
        }
      }
    }
  }

  props.onClick = startAccess;
  return (
    <>
      <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
        <Card
          title="Bustools Text"
          bordered={false}
          className="custom-card"
        >
          <Button type="primary" style={{ margin: 5 }} onClick={startAccess}>Access Directory</Button>
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
            treeData={data}
          />
        </Card>
      </Space>
    </>
  );
}
export default GetAccess;