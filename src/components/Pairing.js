import { TreeSelect, Card, Typography } from 'antd';
import React, { useState } from 'react';
const { Text, Title } = Typography;

const Pairing = (props) => {
  const [value, setValue] = useState();
  const [fileState, setFileState] = useState([]);

  const option_files = props[1].files;

  const onChange = (newValue) => {
    console.log(newValue);
    setValue(newValue);
  };

  const onSelect = (value, node, extra) => {
    console.log('node', node);
  }

  return (
    <>
    <Card bordered={false}>
    <Title level={4}>Pair the files</Title>
    {option_files.map((item, index)=> {
          return (
          <div key={item.key + index}>
          <Text key={index} mark>{item.purpose}</Text> {item.required && ('*')}
          <TreeSelect
          key={item.key}
          style={{
            width: '100%',
            marginTop: '0.5rem',
            marginBottom: '0.5rem'
          }}
          value={value}
          onSelect={onSelect}
          fieldNames={{ label: 'title', value: 'key', children: 'children' }} //needed since treeselect and (directory)tree don't share field labels
          dropdownStyle={{
            maxHeight: 400,
            overflow: 'auto',
          }}
          treeData={props[0]}
          placeholder='Pair a file'
          treeDefaultExpandAll
        />
        </div>)
    })}
    </Card>
  </>
  );
};

export default Pairing;