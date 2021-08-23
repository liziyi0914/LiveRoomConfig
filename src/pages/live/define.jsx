import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Select,
  Result
} from 'antd';
import Rule from '../../components/Rule';
import Layout from '../../components/Layout';
import RuleModelForm from '../../components/RuleModelForm';
import React from 'react';
import ConfigManager from '../../ConfigManager';
import TextModelForm from '../../components/TextModelForm';
import { history } from 'umi';


export default class extends React.Component {

  constructor(props) {
    super(props);

    let live = ConfigManager.getLive();

    let liveNames = [];

    for (const key in live) {
      liveNames.push(key);
    }

    this.state = {
      live: ConfigManager.getLive(),
      globalDefines: ConfigManager.getDefine(),
      liveNames: liveNames,
      currentLive: liveNames?.[0] ?? '',
      define: ConfigManager.getLiveDefine(liveNames?.[0] ?? '')
    };
  }

  updateDefine(define) {
    this.setState({ define: define });
    ConfigManager.setLiveDefine(this.state.currentLive,define);
  }

  render() {
    if (this.state.liveNames.length===0) {
      return (
        <Layout>
          <Result
            status="404"
            title="404"
            subTitle="请先添加配置组"
            extra={<Button type="primary" onClick={()=>history.push('/live/index')}>去添加</Button>}
          />
        </Layout>
      );
    }

    let defineComps = [];
    let { define } = this.state;

    let globalDefineMap = {};

    for (const key in this.state.globalDefines) {
      globalDefineMap[key] = key;
    }

    for (const def in define) {
      defineComps.push((
        <div>
          <Card
            title={def}
            extra={(
              <Space>
                {RuleModelForm(
                  <Button type='link'>添加</Button>,
                  values => {
                    let d = define;
                    d[def] = [...d[def], values];
                    this.updateDefine(d);
                  },
                  {},
                  globalDefineMap
                )}
                {TextModelForm(
                  <Button type='link'>重命名</Button>,
                  '规则名称',
                  '名称',
                  name => {
                    let d = define;
                    d[name] = d[def];
                    delete d[def];
                    this.updateDefine(d);
                  },
                  def,
                )}
                <Button
                  type='link'
                  danger
                  onClick={() => {
                    let d = define;
                    delete d[def];
                    this.updateDefine(d);
                  }}
                >删除</Button>
              </Space>
            )}
          >
            <Row>
              {define?.[def]?.map(r => (
                <Col span={4}>
                  <Rule {...r} definedRules={globalDefineMap}
                        onUpdate={value => {
                          let d = define;
                          d[def] = d[def]?.map(i => i === r ? value : i);
                          this.updateDefine(d);
                        }}
                        onDelete={() => {
                          let d = define;
                          d[def] = d[def]?.filter(i => i !== r);
                          this.updateDefine(d);
                        }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
          <br />
        </div>
      ));
    }

    return (
      <Layout>
        <Space>
          <h1>预设规则</h1>
          <Select
            style={{minWidth:'10rem'}}
            defaultValue={this.state.currentLive}
            onChange={value => this.setState({
              currentLive: value,
              define: ConfigManager.getLiveDefine(value)
            })}
          >
            {this.state.liveNames.map(name=>(
              <Select.Option value={name}>{name}</Select.Option>
            ))}
          </Select>
        </Space>
        <br />
        <Space>
          {TextModelForm(
            <Button type='primary'>添加</Button>,
            '规则名称',
            '名称',
            name => {
              let d = define;
              d[name] = [];
              this.updateDefine(d);
            },
          )}
          <Button
            type='link'
            danger
            onClick={() => {
              this.updateDefine({});
            }}
          >清空</Button>
        </Space>
        <br />
        <br />
        {defineComps}
      </Layout>
    );
  }

};
