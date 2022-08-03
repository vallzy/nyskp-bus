import { Button, Card, Tree, Typography, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import { BFS } from '../lib/DirRootTree'; 
import { GetDirectoryAccess } from '../lib/Access';
import { getNewFileHandle, writeFile, readFile } from '../lib/fs-helper';
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
  let result = await sandbox.getFileHandle("output.txt", {create: true});
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
    let tree = BFS(rawTree);
    console.log(tree);
    setData(tree);
  };
  return(
    <>
    <Card
      title="Bustools Text"
      bordered={false}
      style={{
        width: "100%",
        margin: 5
      }}
    >
      <Button type="primary" style={{margin: 5}} onClick={startAccess}>Access Directory</Button>
      <Button type="primary" style={{margin: 5}} onClick={tester}>Access File</Button>
      <Divider/>
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
    </>
  );
}
export default GetAccess;