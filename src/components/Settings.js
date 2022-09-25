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
        title: 'Pairing'
    },
    {
        title: 'Finalize'
    }
];

const options = 
{
    'text': {
        files: [
            {
                key: 'textinputfile',
                type: '.bus',
                purpose: 'Input .bus file',
                required: true
            }
        ]
    },
    'sorted': {
        files: [
            {
                key: 'sortedinputfile',
                type: '.bus',
                purpose: 'Input .bus file',
                required: true
            }
        ]
    },
    'count': {
        files: [
            {
                key: 'countinputfile',
                type: '.bus',
                purpose: 'input',
                required: true
            },
            {
                key: 'countecfile',
                type: '.ec',
                purpose: 'input',
                required: true
            },
            {
                key: 'counttxtfile',
                type: '.txt',
                purpose: 'input',
                required: true
            }
        ]
    },
}

const { DirectoryTree } = Tree;

async function CheckIfSufficientFiletypes(opt) {
    let flag = false;
    let ext_log = [];
    let ext_record = {};
    let access = await CountFileType();
    let opt_f = options[opt].files;
    for (let i = 0; i < opt_f.length; i++) {
        let file = opt_f[i];
        if(!file.required) continue;
        let exttype = file.type.slice(1);
        ext_record[exttype] ? ext_record[exttype].count += 1 : ext_record[exttype] = {count : 1};
    }

    const keys = Object.keys(ext_record);
    for(let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if(access[key] === undefined || access[key].count < ext_record[key].count) {
            flag = true;
            ext_log.push([key, access[key] === undefined ? ext_record[key].count : ext_record[key].count - access[key].count]);
        }
    }
    return [flag, ext_log]
}

const Settings = (props) => {
    const [current, setCurrent] = useState(0);
    const [option, setOption] = useState('text');
    let shouldBlock = props[0].length <= 0;
    const next = async () => {
        if (current === 1) {
            const log = await CheckIfSufficientFiletypes(option);
            if(log[0]) {
                return message.error("Could not detect sufficient file types with access for this option.")
            }
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
                            <Pairing {...[props[0], options[option]]}/>
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