import { TreeSelect, Card, Typography, Steps } from 'antd';
import React, { useState } from 'react';
const { Text, Title } = Typography;
const { Step } = Steps;

let steps = [];

function InitSteps(option) {
  let st = [];
  for (let i = 0; i < option.files.length; i++)
    st.push({ title: option.files[i].purpose })
  return st;
}

function InitFileState(option) {
  let filestate = [];
  for (let i = 0; i < option.files.length; i++)
    filestate.push({key: option.files[i].key, path: undefined});
  return filestate;
}

const Pairing = (props) => {
  const [value, setValue] = useState();
  const [fileState, setFileState] = useState(InitFileState(props[1]));
  const [current, setCurrent] = useState(0);
 
  const onChange = (value) => {
    console.log('onChange:', current);
    setCurrent(value);
  };

  const option = props[1];
  const fileStateHandler = props[2];

  console.log('filestate', fileState);
  steps = InitSteps(option);

  const option_files = option.files;

  const onSelect = (value, node, extra) => {
    handleFileState(current, value);
  }

  const handleFileState = (index, path) => {
    let copy = fileState;
    copy[index].path = path;
    setFileState(copy);
    fileStateHandler(fileState);
    if(current < steps.length) {
      setCurrent(current + 1);
    }
  }

  return (
    <>
      <Card bordered={false}>
        <Title level={5}>Pair the files</Title>
        <Steps current={current} onChange={onChange}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className="steps-content">
        <Card bordered={false}>
          {option_files.map((item, index) => {
            return (<div key={item.key+index}>
              {current === index && (
                
                  <TreeSelect
                    key={item.key}
                    style={{
                      width: '100%',
                      marginTop: '0.5rem',
                      marginBottom: '0.5rem'
                    }}
                    onSelect={onSelect}
                    value={fileState[current].path}
                    fieldNames={{ label: 'title', value: 'key', children: 'children' }} //needed since treeselect and (directory)tree don't share field labels
                    dropdownStyle={{
                      maxHeight: 400,
                      overflow: 'auto',
                    }}
                    treeData={props[0]}
                    placeholder='Pair a file'
                    treeDefaultExpandAll
                  />
                )}
            </div>)
          })}
          </Card>
        </div>

      </Card>
    </>
  );
};

export default Pairing;