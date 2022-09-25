import { Card, Button, Spin } from 'antd';
import React, { useState } from 'react';
import { get } from 'idb-keyval';
import { verifyPermission } from '../lib/fs-helper';

const Finalize = (props) => {
    const [spin, setSpin] = useState(false);
    let fileState = props[0];
    let opts = props[1];

    const onClick = async () => {
       setSpin(true);
       let fh = await get(fileState[0].path);
       await verifyPermission(fh);
       let file = await fh.getFile();
       await opts.func(file);
       setSpin(false);
    }

    return(
        <>
        <Card bordered={false}>
            <Button style={{marginRight:'0.5rem'}}onClick={onClick}>Run and save output</Button>
            {spin && (
                <Spin size={'large'}/>
            )}
        </Card>
        </>
    )
}

export default Finalize;