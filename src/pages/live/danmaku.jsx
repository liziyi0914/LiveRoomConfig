import {
  Card,
  Button,
  Space,
  Row,
  Col,
  Select,
  Result,
} from 'antd';
import React from 'react';
import { history } from 'umi';
import Rule from '../../components/Rule';
import Layout from '../../components/Layout';
import RuleModelForm from '../../components/RuleModelForm';
import ConfigManager from '../../ConfigManager';
import DanmakuModelForm from '../../components/DanmakuModelForm';
import {v4 as uuid} from 'uuid';


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
      danmaku: ConfigManager.getLiveDanmaku(liveNames?.[0] ?? ''),
    };
  }

  updateDanmaku(danmaku) {
    this.setState({ danmaku: danmaku });
    ConfigManager.setLiveDanmaku(this.state.currentLive, danmaku);
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
    let { danmaku } = this.state;

    let defineMap = {};

    for (const key in this.state.globalDefines) {
      defineMap[key] = key;
    }

    for (const key in this.state.define) {
      defineMap[key] = key;
    }

    for (const d in danmaku) {
      ruleComps.push((
        <div>
          <Card
            title={d}
            extra={(
              <Space>
                {RuleModelForm(
                  <Button type='link'>添加</Button>,
                  values => {
                    let _d = danmaku;
                    _d[d]['rules'] = [...(_d[d]?.['rules']??[]), values];
                    this.updateDanmaku(_d);
                  },
                  {},
                  defineMap,
                )}
                {DanmakuModelForm(
                  <Button type='link'>编辑</Button>,
                  values => {
                    let _d = danmaku;
                    _d[values.name] = {
                      matches: values.matches.map(i => i.match),
                      limit: values.limit,
                      msg: values.msg,
                    };
                    this.updateDanmaku(_d);
                  },
                  {
                    name: d,
                    matches: danmaku?.[d]?.matches.map(i => ({
                      match: i
                    })),
                    limit: danmaku?.[d]?.limit,
                    msg: danmaku?.[d]?.msg,
                  },
                )}
                <Button
                  type='link'
                  danger
                  onClick={() => {
                    let _d = danmaku;
                    delete _d[d];
                    this.updateDanmaku(_d);
                  }}
                >删除</Button>
              </Space>
            )}
          >
            <Row>
              {danmaku?.[d]?.['rules']?.map(r => (
                <Col span={4}>
                  <Rule {...r} definedRules={defineMap}
                        onUpdate={value => {
                          let _d = danmaku;
                          _d[d] = _d[d]?.map(i => i === r ? value : i);
                          this.updateDanmaku(_d);
                        }}
                        onDelete={() => {
                          let _d = danmaku;
                          _d[d] = _d[d]?.filter(i => i !== r);
                          this.updateDanmaku(_d);
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
          <h1>弹幕</h1>
          <Select
            style={{ minWidth: '10rem' }}
            defaultValue={this.state.currentLive}
            onChange={value => this.setState({
              currentLive: value,
              define: ConfigManager.getLiveDefine(value),
              danmaku: ConfigManager.getLiveDanmaku(value),
            })}
          >
            {this.state.liveNames.map(name => (
              <Select.Option value={name}>{name}</Select.Option>
            ))}
          </Select>
        </Space>
        <br />
        <Space>
          {DanmakuModelForm(
            <Button type='primary'>添加</Button>,
            values => {
              let _d = danmaku;
              _d[values.name] = {
                matches: values.matches.map(i => i.match),
                limit: values.limit,
                msg: values.msg,
                rules: []
              };
              this.updateDanmaku(_d);
            },
            {
              name: uuid(),
              limit: 20,
              msg: '${sender} 发送了 ${danmaku}，${result}x${count} 已送达至 ${receiver}'
            },
          )}
          <Button
            type='link'
            danger
            onClick={() => {
              this.updateDanmaku({});
            }}
          >清空</Button>
        </Space>
        <br />
        <br />
        {ruleComps}
      </Layout>
    );
  }

};
