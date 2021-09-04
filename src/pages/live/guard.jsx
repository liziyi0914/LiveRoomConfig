import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Select,
  Result
} from 'antd';
import React from 'react';
import { history } from 'umi';
import Rule from '../../components/Rule';
import Layout from '../../components/Layout';
import RuleModelForm from '../../components/RuleModelForm';
import ConfigManager from '../../ConfigManager';
import TextModelForm from '../../components/TextModelForm';


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
      define: ConfigManager.getLiveDefine(liveNames?.[0] ?? ''),
      guard: ConfigManager.getLiveGuard(liveNames?.[0] ?? ''),
    };
  }

  updateGuard(guard) {
    this.setState({ guard: guard });
    ConfigManager.setLiveGuard(this.state.currentLive, guard);
  }

  render() {
    if (this.state.liveNames.length === 0) {
      return (
        <Layout>
          <Result
            status='404'
            title='404'
            subTitle='请先添加配置组'
            extra={<Button type='primary' onClick={() => history.push('/live/index')}>去添加</Button>}
          />
        </Layout>
      );
    }

    let ruleComps = [];
    let { guard } = this.state;

    let defineMap = {};

    for (const key in this.state.globalDefines) {
      defineMap[key] = key;
    }

    for (const key in this.state.define) {
      defineMap[key] = key;
    }

    for (const g in guard) {
      ruleComps.push((
        <div>
          <Card
            title={guard[g].name}
            extra={(
              <Space>
                {RuleModelForm(
                  <Button type='link'>添加</Button>,
                  values => {
                    let _g = guard;
                    _g[g]['rules'] = [...(_g[g]?.['rules']??[]), values];
                    this.updateGuard(_g);
                  },
                  {},
                  defineMap,
                )}
                {TextModelForm(
                  <Button type='link'>编辑</Button>,
                  '消息',
                  '消息内容',
                  content=>{
                    let _g = guard;
                    _g[g]['msg'] = content;
                    this.updateGuard(_g);
                  },
                  guard[g]?.msg??'感谢${sender}的${guard}，${result}x${count} 已送达至 ${receiver}'
                )}
              </Space>
            )}
          >
            <Row>
              {guard?.[g]?.['rules']?.map(r => (
                <Col span={4}>
                  <Rule {...r} definedRules={defineMap}
                        onUpdate={value => {
                          let _g = guard;
                          _g[g].rules = _g[g]?.rules?.map(i => i === r ? value : i);
                          this.updateGuard(_g);
                        }}
                        onDelete={() => {
                          let _g = guard;
                          _g[g].rules = _g[g]?.rules?.filter(i => i !== r);
                          this.updateGuard(_g);
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
          <h1>大航海</h1>
          <Select
            style={{ minWidth: '10rem' }}
            defaultValue={this.state.currentLive}
            onChange={value => this.setState({
              currentLive: value,
              define: ConfigManager.getLiveDefine(value),
              guard: ConfigManager.getLiveGuard(value),
            })}
          >
            {this.state.liveNames.map(name => (
              <Select.Option value={name}>{name}</Select.Option>
            ))}
          </Select>
        </Space>
        <br />
        {ruleComps}
      </Layout>
    );
  }

};
