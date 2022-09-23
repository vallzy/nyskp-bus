import React from 'react';
import 'antd/dist/antd.min.css'
import './index.css';
import { Layout, Menu, Space, Card, Radio, Divider, Button } from 'antd';
import GetAccess from './components/GetAccess';
import { clear } from 'idb-keyval';

const { Header, Content } = Layout;

const items = [
  { label: 'Home', key: 'home' }
];

const App = () => (
  <Layout className="layout">
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={items}
      >
      </Menu>
    </Header>
    <Content>
      <Space
        direction="vertical"
        size="middle"
        style={{
          display: 'flex',
          backgroundColor: 'white'
        }}
      >
        <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
        <Card style={{justifyContent: 'center', border:'0px', marginTop: '1rem' }}>
        <Radio.Group defaultValue="a" buttonStyle="solid">
          <Radio.Button value="a">Text</Radio.Button>
          <Radio.Button value="b">Sort</Radio.Button>
          <Radio.Button value="c">Count</Radio.Button>
        </Radio.Group>
        </Card>
        <Divider type="vertical" />
        <Card style={{justifyContent: 'center', border:'0px', marginTop: '1rem' }}>
          <Button>Test</Button>
        </Card>
        </Space>
        <GetAccess />
      </Space>
    </Content>
  </Layout>
);

export default App;