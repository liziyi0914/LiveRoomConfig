import React from 'react';
import { Button, message } from 'antd';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormDependency,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';
import ConfigManager from '../ConfigManager';

export default (button,callback=(()=>{}),initialValues={},definedRules=[]) => {
  return (
    <ModalForm
      title='规则'
      trigger={button}
      onFinish={(values) => {
        let v = {};
        let extra = {};
        for (let key in values) {
          if (key.startsWith('extra.')) {
            extra[key.replace('extra.','')] = values[key];
          } else {
            v[key] = values[key];
          }
        }
        v['extra'] = extra;
        if (v?.data!=='') {
          callback(v);
          return true;
        }
        return false;
      }}
      modalProps={{destroyOnClose:true}}
      initialValues={initialValues}
    >
      <ProFormRadio.Group
        label="类型"
        name="type"
        radioType="button"
        required
        initialValue={'include'}
        options={[
          {
            label: '引用',
            value: 'include',
          },
          {
            label: '生物',
            value: 'monster',
          },
          {
            label: '物品',
            value: 'item',
          },
          {
            label: '命令',
            value: 'command',
          },
          {
            label: 'JS脚本',
            value: 'js',
          },
        ]}
      />
      <ProFormDigit
        label="权重"
        name="weight"
        required
        initialValue={10}
      />
      <ProFormDependency name={['type']}>
        {({type})=>{
          switch (type) {
            case 'include': {
              return (
                <ProFormSelect
                  label="规则名称"
                  name="data"
                  valueEnum={definedRules}
                  rules={[{ required: true, message: '请选择规则' }]}
                />
              );
            }
            case 'item': {
              return [
                <ProFormText
                  label="物品名称"
                  name="data"
                  rules={[{ required: true, message: '请输入物品名称' }]}
                  initialValue={''}
                />,
                <ProFormText
                  label="显示名称"
                  name="extra.displayName"
                  initialValue={''}
                />,
                <ProFormTextArea
                  label="附加消息"
                  name="extra.lores"
                  initialValue={''}
                />
              ];
            }
            case 'monster': {
              return (
                <ProFormSelect
                  label="生物"
                  name="data"
                  valueEnum={ConfigManager.monsterMap}
                  rules={[{ required: true, message: '请选择规则' }]}
                />
              );
            }
            case 'command': {
              return [
                <ProFormText
                  label="命令"
                  name="data"
                  rules={[{ required: true, message: '请输入命令' }]}
                  initialValue={''}
                />,
                <ProFormSelect
                  label="触发者"
                  name="extra.executor"
                  valueEnum={{player:'玩家',console:'控制台'}}
                  rules={[{ required: true, message: '请选择触发者' }]}
                  initialValue={'console'}
                />
              ];
            }
            case 'js': {
              return (
                <ProFormText
                  label="js文件名"
                  name="data"
                  required
                  initialValue={''}
                />
              );
            }
          }
        }}
      </ProFormDependency>
    </ModalForm>
  );
};
