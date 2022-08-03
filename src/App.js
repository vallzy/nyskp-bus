import React from 'react';
import 'antd/dist/antd.min.css'
import './index.css';
import { Breadcrumb, Card, Layout, Menu, Typography, Col, Row} from 'antd';
import GetAccess from './components/GetAccess';

const { Title } = Typography;

const { Header, Content, Footer } = Layout;


const items = [
  { label: 'Home', key: 'home' },
  { label: 'About', key: 'about'}
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
    <GetAccess/>
    </Content>
  </Layout>
);

export default App;