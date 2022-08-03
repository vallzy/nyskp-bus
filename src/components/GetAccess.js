import { Button, Card, Switch, Tree, Typography, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
const { DirectoryTree } = Tree;
const { Title } = Typography;

var treeData = [];

async function handleDirectoryEntry( dirHandle, out ) {
  for await (const entry of dirHandle.values()) {
      if (entry.kind === "file"){
      const file = await entry.getFile();
      out[ file.name ] = file;
      }
      if (entry.kind === "directory") {
      const newOut = out[ entry.name ] = { visited: false, name: entry.name };
      await handleDirectoryEntry( entry, newOut );
      }
  }
}

function BFS(node) {
  let counter = 0;
  let tr = [];
  let dirQueue = [node];
  node.name = 'root';
  while(dirQueue.length > 0) {
    var nodeIndex = dirQueue.shift();
    for (const key of Object.keys(nodeIndex)) {
      const item = nodeIndex[key];
      if(item.visited !== undefined && !item.visited) { 
        dirQueue.push(item);
      }
    }
    nodeIndex.visited = true;
    tr.push({
      title: nodeIndex.name,
      key: 'dir-' + nodeIndex.name,
      children: PopulateRoot(nodeIndex, counter)
    });

    counter += 1;
  }
  treeData = tr;
  return treeData;
}


async function GetDirectoryAccess() {
    const out = {};
    let dirHandle = await window.showDirectoryPicker();
    await handleDirectoryEntry( dirHandle, out );
    let tree = BFS(out);
    return tree;
}

function PopulateRoot(dir, num) {
  let content = [];
  let counter = 0;
  for (const key of Object.keys(dir)) {
    const item = dir[key];
    if(item instanceof File) {
        content.push({ title: key, key: num + '-' + counter, isLeaf:true });
        counter += 1;
    }
  }
  return content;
}


function GetAccess() {
  const [data, setData] = useState(treeData);
  const startAccess = async () => {
    let y = await GetDirectoryAccess();
    setData(y);
  };
  return(
    <>
    <Card
      title="Bustools Text"
      bordered={false}
      style={{
        width: "100%",
        justifyContent: 'center',
        margin: 5
      }}
    >
      <Button type="primary" style={{margin: 5}} onClick={startAccess}>Access Directory</Button>
      <Button type="primary" style={{margin: 5}}>Access File</Button>
      <Divider/>
      {data.length <= 0 &&
        <Title level={5} type='danger'>
          Currently there are no directories with access.
        </Title>
      }
      <DirectoryTree
      multiple
      defaultExpandAll
      treeData={data}
    />
    </Card>
    </>
  );
}
export default GetAccess;