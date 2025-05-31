import React from 'react';
import { Layout, Menu } from 'antd';
import { WifiOutlined, DashboardOutlined, FileTextOutlined, BluetoothOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SystemMonitor from './components/SystemMonitor';
import LogViewer from './components/LogViewer';
import WiFiPentest from './components/WiFiPentest';
import BluetoothPentest from './components/BluetoothPentest';

const { Header, Content, Sider } = Layout;

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0, background: '#001529' }}>
          <div style={{ color: 'white', fontSize: '20px', padding: '0 24px' }}>
            Orange Pi Zero 3 Dashboard
          </div>
        </Header>
        <Layout>
          <Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1" icon={<DashboardOutlined />}>
                <Link to="/">Система</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<WifiOutlined />}>
                <Link to="/wifi">WiFi Pentest</Link>
              </Menu.Item>
              <Menu.Item key="3" icon={<BluetoothOutlined />}>
                <Link to="/bluetooth">Bluetooth Pentest</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<FileTextOutlined />}>
                <Link to="/logs">Логи</Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ padding: '24px' }}>
            <Content
              style={{
                background: '#fff',
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Routes>
                <Route path="/" element={<SystemMonitor />} />
                <Route path="/wifi" element={<WiFiPentest />} />
                <Route path="/bluetooth" element={<BluetoothPentest />} />
                <Route path="/logs" element={<LogViewer />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App; 