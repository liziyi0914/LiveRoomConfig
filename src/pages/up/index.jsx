import React from 'react';
import Layout from '../../components/Layout';
import ProForm, {
  ProFormText,
  ProFormDigit
} from '@ant-design/pro-form';
import ConfigManager from '../../ConfigManager';

export default class extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <ProForm
          onFinish={values=>{
            let up = ConfigManager.getUp();
            ConfigManager.setUp({...up,...values});
          }}
          initialValues={ConfigManager.getUp()}
        >
          <ProFormDigit
            name="time"
            label="时间间隔（单位：秒）"
            placeholder="请输入时间间隔"
            rules={[{ required: true, message: '请输入时间间隔' }]}
          />
          <ProFormText
            name="msg"
            label="消息"
            placeholder="请输入消息"
            rules={[{ required: true, message: '请输入消息' }]}
          />
        </ProForm>
      </Layout>
    );
  }

}
