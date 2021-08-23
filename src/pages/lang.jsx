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
import { render } from "minecraft-text";
import '../mc.css';


export default class extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      langs: ConfigManager.getLang(),
    };
  }

  updateLang(langs) {
    this.setState({ langs: langs });
    ConfigManager.setLang(langs);
  }

  render() {
    let langComps = [];
    let { langs } = this.state;

    for (const name in langs) {
      langComps.push((
        <div>
          <Card
            title={name}
            extra={
              TextModelForm(
                <Button type="link">编辑</Button>,
                '编辑内容',
                '内容',
                lang=>{
                  let l = langs;
                  l[name] = lang;
                  this.updateLang(l);
                },
                langs[name]
              )
            }
          >
            <div dangerouslySetInnerHTML={{ __html:render(langs[name])}}/>
          </Card>
          <br/>
        </div>
      ));
    }

    return (
      <Layout>
        <h1>语言</h1>
        <br />
        <br />
        {langComps}
      </Layout>
    );
  }

};
