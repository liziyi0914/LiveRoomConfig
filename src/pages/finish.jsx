import React from 'react';
import {
  Button,
  Input,
  Space,
  message,
} from 'antd';
import Layout from '../components/Layout';
import ConfigManager from '../ConfigManager';
import copy from 'clipboard-copy';


export default class extends React.Component {

  constructor() {
    super();

    this.state = {
      result: ''
    };
  }

  componentDidMount() {
    this.setState({result:JSON.stringify(ConfigManager.getConfig(),null,4)});
  }

  render() {
    return (
      <Layout>
        <Input.TextArea
          value={this.state.result}
          rows={20}
        />
        <br/>
        <br/>
        <Space>
          <Button
            type="primary"
            onClick={()=>{
              copy(JSON.stringify(ConfigManager.getConfig()))
                .then(()=>message.success('复制成功'));
            }}
          >复制</Button>
          <Button
            href={"data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ConfigManager.getConfig()))}
            download={'config.json'}
          >下载</Button>
          <Button
            onClick={()=> {
              ConfigManager.reset();
              this.setState({result:JSON.stringify(ConfigManager.getConfig(),null,4)});
            }}
            danger
          >重置</Button>
        </Space>
      </Layout>
    );
  }

}
