import {
  Card,
  Button,
  Space,
  Row,
  Col,
} from 'antd';
import Rule from '../components/Rule';
import Layout from '../components/Layout';
import RuleModelForm from '../components/RuleModelForm';
import React from 'react';
import ConfigManager from '../ConfigManager';
import TextModelForm from '../components/TextModelForm';


export default class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      globalDefines: ConfigManager.getDefine(),
    };
  }

  updateGlobalDefines(globalDefines) {
    console.log(globalDefines)
    this.setState({ globalDefines: globalDefines });
    ConfigManager.setDefine(globalDefines);
  }

  render() {
    let globalDefineComps = [];
    let { globalDefines } = this.state;

    for (const define in globalDefines) {
      globalDefineComps.push((
        <div>
        <Card
          title={define}
          extra={(
            <Space>
              {RuleModelForm(
                <Button type='link'>添加</Button>,
                values => {
                  let d = globalDefines;
                  d[define] = [...d[define], values];
                  this.updateGlobalDefines(d);
                },
              )}
              {TextModelForm(
                <Button type='link'>重命名</Button>,
                '规则名称',
                '名称',
                name=>{
                  let d = globalDefines;
                  d[name] = d[define];
                  delete d[define];
                  this.updateGlobalDefines(d);
                },
                define
              )}
              <Button
                type='link'
                danger
                onClick={()=>{
                  let d = globalDefines;
                  delete d[define];
                  this.updateGlobalDefines(d);
                }}
              >删除</Button>
            </Space>
          )}
        >
          <Row>
            {globalDefines?.[define]?.map(r => (
              <Col span={4}>
                <Rule {...r}
                      onUpdate={value => {
                        let d = globalDefines;
                        d[define] = d[define]?.map(i => i === r ? value : i);
                        this.updateGlobalDefines(d);
                      }}
                      onDelete={() => {
                        let d = globalDefines;
                        d[define] = d[define]?.filter(i => i !== r);
                        this.updateGlobalDefines(d);
                      }}
                />
              </Col>
            ))}
          </Row>
        </Card>
          <br/>
        </div>
      ));
    }

    return (
      <Layout>
        <h1>全局规则</h1>
        <Space>
          {TextModelForm(
            <Button type='primary'>添加</Button>,
            '规则名称',
            '名称',
            name=>{
              let d = globalDefines;
              d[name] = [];
              this.updateGlobalDefines(d);
            }
          )}
          <Button
            type='link'
            danger
            onClick={()=>{
              this.updateGlobalDefines({});
            }}
          >清空</Button>
        </Space>
        <br />
        <br />
        {globalDefineComps}
      </Layout>
    );
  }

};
