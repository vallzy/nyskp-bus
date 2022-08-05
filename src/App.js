import React from 'react';
import 'antd/dist/antd.min.css'
import './index.css';
import { Layout, Menu, Space } from 'antd';
import GetAccess from './components/GetAccess';

const { Header, Content } = Layout;


const items = [
  { label: 'Home', key: 'home' },
  { label: 'About', key: 'about' }
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
        <GetAccess />
      </Space>
    </Content>
  </Layout>
);

export default App;