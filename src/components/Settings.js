import { Button, message, Steps, Card, Tree, Typography, Collapse, Radio, Space} from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
const { Step } = Steps;
const { Text } = Typography;

const steps = [
  {
    title: 'Access'
  },
  {
    title: 'Options'
  },
  {
    title: 'Pair Files'
  },
  {
    title: 'Finalize'
  }
];

const options = [
    {
        key: 'text',
        files: [
            {
                type: 'input',
                optional: false,
                extension: '.bus'
            },
            {
                type: 'output',
                optional: true,
                extension: '.txt'
            }
        ]
    }
]

const { DirectoryTree } = Tree;

const Settings = (props) => {
  const [current, setCurrent] = useState(0);
  const [option, setOption] = useState('text');

  let shouldBlock = props[0].length <= 0;
  
  const next = () => {
    if(!shouldBlock)
        setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <>
    <Card style={{width:'100%'}}>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title}/>
        ))}
      </Steps>
      <div className="steps-content">
        <Card style={{margin:'1rem'}} bordered={false}>
        {current === 0 && (
        <>
            {shouldBlock
            ? <Text type="danger">You must give access to files or folders to proceed.</Text> 
            : <Text type="success"><CheckOutlined /> Access given</Text>
            }
            {!shouldBlock && (
            <DirectoryTree
            multiple
            treeData={props[0]}
            selectable={true}
            height={300}
            style={{marginBottom:'1rem', marginTop:'1rem'}}
            />
            )}
        </>
        )}
        {current === 1 && (
        <>
        <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
        <Radio.Group defaultValue={option} buttonStyle="solid">
            <Radio.Button value="text" onClick={() => setOption('text')}>Text</Radio.Button>
            <Radio.Button value="sort" onClick={() => setOption('sort')}>Sort</Radio.Button>
            <Radio.Button value="count" onClick={() => setOption('count')}>Count</Radio.Button>
            <Radio.Button value="inspect" onClick={() => setOption('inspect')}>Inspect</Radio.Button>
        </Radio.Group>
        </Space>
        </>
        )}
        </Card>
      </div>
      <div className="steps-action">
        {current < steps.length - 1 && (
          <Button disabled={shouldBlock} type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => message.success('Processing complete!')}>
            Done
          </Button>
        )}
        {current > 0 && (
          <Button
            style={{
              margin: '0 8px',
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
      </Card>
    </>
  );
};

export default Settings;