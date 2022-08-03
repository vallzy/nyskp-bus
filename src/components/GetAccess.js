import { Button, Card, Switch, Tree } from 'antd';
import React, { useState } from 'react';
const { DirectoryTree } = Tree;

const treeData = [
    {
      title: 'sandbox',
      key: '0-0',
      children: [
        {
          title: 'output.bus',
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'ec.ts',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    },
    {
      title: 'tmp',
      key: '0-1',
      children: [
        {
          title: 'leaf 1-0',
          key: '0-1-0',
          isLeaf: true,
        },
        {
          title: 'leaf 1-1',
          key: '0-1-1',
          isLeaf: true,
        },
      ],
    },
  ];

async function handleDirectoryEntry( dirHandle, out ) {
for await (const entry of dirHandle.values()) {
    if (entry.kind === "file"){
    const file = await entry.getFile();
    out[ file.name ] = file;
    }
    if (entry.kind === "directory") {
    const newOut = out[ entry.name ] = {};
    await handleDirectoryEntry( entry, newOut );
    }
}
}

async function GetDirectoryAccess() {
    const out = {};
    let dirHandle = await window.showDirectoryPicker();
    await handleDirectoryEntry( dirHandle, out );
    let tree = GenerateTree(out);
}

async function GenerateTree(rootDir) {
    const cleanTree = [];
    for (const key of Object.keys(rootDir)) {
        const item = rootDir[key];
        if(item instanceof File) {
            
        }
    }
}

const GetAccess = () => (
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
      <Button type="primary" style={{margin: 5}} onClick={GetDirectoryAccess}>Access Directory</Button>
      <Button type="primary" style={{margin: 5}}>Access File</Button>

      <DirectoryTree
      multiple
      defaultExpandAll
      treeData={treeData}
    />
    </Card>
    </>
);

export default GetAccess;