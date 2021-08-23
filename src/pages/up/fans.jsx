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
      globalDefines: ConfigManager.getDefine(),
      define: ConfigManager.getUp()?.['rules']??[]
    };
  }

  updateDefine(define) {
    this.setState({ define: define });
    ConfigManager.setUp({ ...(ConfigManager.getUp()?.['rules']??[]),...define });
  }

  render() {
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
        <h1>粉丝规则</h1>
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
            uuid()
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
