import { Button, Card, Tree, Typography, Divider } from 'antd';
import React, { useState } from 'react';
import { BFS } from '../lib/DirRootTree'; 
import { GetDirectoryAccess } from '../lib/Access';
const { DirectoryTree } = Tree;
const { Title } = Typography;

function GetAccess() {
  const [data, setData] = useState([]);
  const startAccess = async () => {
    let rawTree = await GetDirectoryAccess();
    let tree = BFS(rawTree);
    setData(tree);
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