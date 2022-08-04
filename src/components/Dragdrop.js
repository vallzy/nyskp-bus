import { Card, Icon } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import Dropzone from 'react-dropzone';

function Dragdrop(props) {
    console.log(props);
    const handleOnDragEnter = ev => {
        ev.stopPropagation(); 
        ev.preventDefault();
    }
    const handleOnDragOver = ev => {
        ev.stopPropagation(); 
        ev.preventDefault();
    }
    const handleOnDrop = async ev => {
        ev.preventDefault();
        ev.stopPropagation();
    }
    const handleOnLeave= ev => {
        ev.preventDefault();
        ev.stopPropagation();
    }
    const handleOnClick = () => {
        
    }
    return (
      <>
      <div className="dropzone" 
      onDragEnter={ev => handleOnDragEnter(ev)} 
      onDragOver={ev => handleOnDragOver(ev)} 
      onDrop={ev => props.onDrop ? props.onDrop(ev) : handleOnDrop(ev)}
      onDragLeave={ev => handleOnLeave(ev)}
      onClick={props.onClick}
      >
      <Card
      className="custom-card custom-card-bordered"
      bordered={true}
      style={{backgroundColor: '#fff'}}
      >
        <p>
        <InboxOutlined type="message" style={{ fontSize: '30px', color: '#08c'}} theme="outlined" />
        </p>
        <p className="title">Click or drag folder to this area to give us access</p>
      </Card>
      </div>
    </>
    );
}

  export default Dragdrop;