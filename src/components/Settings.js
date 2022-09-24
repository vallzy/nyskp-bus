import { Button, message, Steps, Card, Tree, Typography, Input, Radio, Space } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { CountFileType } from '../lib/Access';
import Pairing from './Pairing';
import { clear } from 'idb-keyval';
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
        title: 'Selection'
    },
    {
        title: 'Pair & Finalize'
    }
];

//To-do: rework?
const options =
{
    'text': {
        files: [['.bus', 15]]
    },
    'sorted': {
        files: [['.bus', 2]]
    },
    'count': {
        files: [['.bus', 2], ['.ec', 1], ['.tr2g', 1], ['.txt', 1]]
    },
    'inspect': {
        files: [['.bus', 1]]
    }
}


const { DirectoryTree } = Tree;

async function CheckIfSufficientFiletypes(opt) {
    let flag = false;
    let access = await CountFileType();
    let option_files = options[opt].files;
    let ext_log = [];
    for (let i = 0; i < option_files.length; i++) {
        let ext, count;
        [ext, count] = option_files[i];
        ext = ext.slice(1);
        if (access[ext] === undefined || access[ext].count < count) {
            flag = true;
            ext_log.push([ext, access[ext] === undefined ? count : count - access[ext].count]);
        }
    }
    if (flag) {
        message.error(`${opt.charAt(0).toUpperCase() + opt.slice(1)}: did not detect all required files to use this option`);
    }
    return ext_log;
}

const Settings = (props) => {
    const [current, setCurrent] = useState(0);
    const [option, setOption] = useState('text');

    let shouldBlock = props[0].length <= 0;
    const next = () => {
        if (current === 1) {
            CheckIfSufficientFiletypes(option);
        }
        if (!shouldBlock)
            setCurrent(current + 1);
    };

    const switchOption = (opt) => {
        setOption(opt);
        CheckIfSufficientFiletypes(opt);
    }


    const prev = () => {
        setCurrent(current - 1);
    };

    const onDrop = (info) => {
        console.log(info);
    }

    return (
        <>
            <Card style={{ width: '100%' }} bordered={false}>
                <Steps current={current}>
                    {steps.map((item) => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                <div className="steps-content">
                    <Card style={{ margin: '1rem' }} bordered={false}>
                        {current === 0 && (
                            <>
                                {shouldBlock
                                    ? <Text type="danger">You must give access to files or folders to proceed.</Text>
                                    : <Text type="success"><CheckOutlined /> Access given</Text>
                                }
                                {!shouldBlock && (
                                <>
                                    <DirectoryTree
                                        multiple
                                        draggable
                                        onDrop={onDrop}
                                        treeData={props[0]}
                                        height={300}
                                        style={{ marginBottom: '1rem', marginTop: '1rem' }}
                                    />
                                </>
                                )}
                            </>
                        )}
                        {current === 1 && (
                            <>
                                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Radio.Group defaultValue={option} buttonStyle="solid">
                                        <Radio.Button value="text" onClick={() => switchOption('text')}>Text</Radio.Button>
                                        <Radio.Button value="sorted" onClick={() => switchOption('sorted')}>Sort</Radio.Button>
                                        <Radio.Button value="count" onClick={() => switchOption('count')}>Count</Radio.Button>
                                        <Radio.Button value="inspect" onClick={() => switchOption('inspect')}>Inspect</Radio.Button>
                                    </Radio.Group>
                                </Space>
                            </>
                        )}
                        {current === 2 && (
                            <Pairing {...[props[0]]}/>
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