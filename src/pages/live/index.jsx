import React from 'react';
import Layout from '../../components/Layout';
import {
  Button,
  List
} from 'antd';
import ConfigManager from '../../ConfigManager';
import TextModelForm from '../../components/TextModelForm';


export default class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      live: ConfigManager.getLive(),
    };
  }

  updateLive(live) {
    this.setState({ live: live });
    ConfigManager.setLive(live);
  }

  render() {
    let liveDs = [];
    let { live } = this.state;

    for (const l in live) {
      liveDs.push(l);
    }

    return (
      <Layout>
        <h1>直播配置组</h1>
        {TextModelForm(
          <Button type="primary">添加</Button>,
          '配置名称',
          '名称',
          name=>{
            let l = live;
            l[name] = {};
            this.updateLive(l);
          }
        )}
        <br/>
        <br/>
        <List
          dataSource={liveDs}
          renderItem={item=>(
            <List.Item
              actions={[
                TextModelForm(
                  <Button type="link">重命名</Button>,
                  '配置名称',
                  '名称',
                  name=>{
                    let l = live;
                    l[name] = l[item];
                    delete l[item];
                    this.updateLive(l);
                  },
                  item
                ),
                <Button
                  type="link"
                  danger
                  onClick={()=>{
                    let l = live;
                    delete l[item];
                    this.updateLive(l);
                  }}
                >删除</Button>
              ]}
            >
              {item}
            </List.Item>
          )}
          bordered
        />
      </Layout>
    );
  }

}
