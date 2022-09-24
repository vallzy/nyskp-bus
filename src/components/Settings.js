import { Button, message, Steps, Card, Tree, Typography } from 'antd';
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

const { DirectoryTree } = Tree;

const Settings = (props) => {
  console.log(props);

  const [current, setCurrent] = useState(0);

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
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title}/>
        ))}
      </Steps>
      <div className="steps-content">
        <Card style={{margin:'1rem'}}>
        {current === 0 && (
        <>
            {shouldBlock
            ? <Text type="danger">You must give access to files or folders to proceed.</Text> 
            : <Text type="success">You may proceed.</Text>
            }
            <DirectoryTree
            multiple
            treeData={props[0]}
            selectable={true}
            height={300}
            style={{marginBottom:'1rem', marginTop:'1rem'}}
            />
        </>
          )}
          
        {steps[current].content}
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
    </>
  );
};

export default Settings;