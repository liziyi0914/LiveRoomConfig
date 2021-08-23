import {
  Card,
  Button,
  Space,
  Row
} from 'antd';
import styles from './Rule.less';
import React from 'react';
import RuleModelForm from './RuleModelForm';
import ConfigManager from '../ConfigManager';

const typeMap = {
  include: '引用',
  monster: '生物',
  item: '物品',
  command: '指令',
  js: 'JS脚本'
};

export default class extends React.Component {

  static defaultProps = {
    type: 'monster',
    weight: 10,
    data: '',
    definedRules: [],
    onUpdate: values=>{},
    onDelete: ()=>{}
  };

  render() {
    let props = this.props;
    let type = props?.type ?? 'monster';

    let v = {};

    for (let key in props) {
      if (key === 'extra') {
        for (let k in props.extra) {
          v['extra.'+k] = props.extra?.[k];
        }
      } else {
        v[key] = props[key];
      }
    }

    return (
      <Card className={styles.card}>
        <Row className={styles.header}>
          <div className={styles.type}>{typeMap[type]}</div>
          <div className={styles.weight}>{props?.weight ?? 10}</div>
        </Row>
        <div className={styles.content}>{type==='monster'?ConfigManager.monsterMap[props?.data ?? 'ZOMBIE']:props?.data ?? ''}</div>
        <Space>
          {RuleModelForm(
            <Button type='link'>编辑</Button>,
            values => props.onUpdate(values),
            v,
            props.definedRules
          )}
          <Button type="link" danger onClick={()=>props.onDelete()}>删除</Button>
        </Space>
      </Card>
    );
  }
}
