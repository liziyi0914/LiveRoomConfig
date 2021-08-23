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
import GiftModelForm from '../../components/GiftModelForm';
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
      gift: ConfigManager.getLiveGift(liveNames?.[0] ?? ''),
    };
  }

  updateGift(gift) {
    this.setState({ gift: gift });
    ConfigManager.setLiveGift(this.state.currentLive, gift);
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
    let { gift } = this.state;

    let defineMap = {};

    for (const key in this.state.globalDefines) {
      defineMap[key] = key;
    }

    for (const key in this.state.define) {
      defineMap[key] = key;
    }

    for (const g in gift) {
      ruleComps.push((
        <div>
          <Card
            title={g}
            extra={(
              <Space>
                {RuleModelForm(
                  <Button type='link'>添加</Button>,
                  values => {
                    let _g = gift;
                    _g[g]['rules'] = [...(_g[g]?.['rules']??[]), values];
                    this.updateGift(_g);
                  },
                  {},
                  defineMap,
                )}
                {GiftModelForm(
                  <Button type='link'>编辑</Button>,
                  values => {
                    let _g = gift;
                    _g[values.name] = {
                      matches: values.matches.map(i => i.match),
                      limit: values.limit,
                      msg: values.msg,
                    };
                    this.updateGift(_g);
                  },
                  {
                    name: g,
                    matches: gift?.[g]?.matches.map(i => ({
                      match: i
                    })),
                    limit: gift?.[g]?.limit,
                    msg: gift?.[g]?.msg,
                  },
                )}
                <Button
                  type='link'
                  danger
                  onClick={() => {
                    let _g = gift;
                    delete _g[g];
                    this.updateGift(_g);
                  }}
                >删除</Button>
              </Space>
            )}
          >
            <Row>
              {gift?.[g]?.['rules']?.map(r => (
                <Col span={4}>
                  <Rule {...r} definedRules={defineMap}
                        onUpdate={value => {
                          let _g = gift;
                          _g[g] = _g[g]?.map(i => i === r ? value : i);
                          this.updateGift(_g);
                        }}
                        onDelete={() => {
                          let _g = gift;
                          _g[g] = _g[g]?.filter(i => i !== r);
                          this.updateGift(_g);
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
          <h1>礼物</h1>
          <Select
            style={{ minWidth: '10rem' }}
            defaultValue={this.state.currentLive}
            onChange={value => this.setState({
              currentLive: value,
              define: ConfigManager.getLiveDefine(value),
              gift: ConfigManager.getLiveGift(value),
            })}
          >
            {this.state.liveNames.map(name => (
              <Select.Option value={name}>{name}</Select.Option>
            ))}
          </Select>
        </Space>
        <br />
        <Space>
          {GiftModelForm(
            <Button type='primary'>添加</Button>,
            values => {
              let _g = gift;
              _g[values.name] = {
                matches: values.matches.map(i => i.match),
                limit: values.limit,
                msg: values.msg,
                rules: []
              };
              this.updateGift(_g);
            },
            {
              name: uuid(),
              limit: 20,
              msg: '感谢 ${sender} 赠送的 ${gift}x${gift_count}，${result}x${count} 已送达至 ${receiver}'
            },
          )}
          <Button
            type='link'
            danger
            onClick={() => {
              this.updateGift({});
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
