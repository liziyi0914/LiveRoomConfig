import React from 'react';
import {
  ModalForm,
  ProFormText,
  ProFormList, ProFormDigit,
} from '@ant-design/pro-form';

export default (button,callback=(()=>{}),initialValues={}) => {
  return (
    <ModalForm
      title='礼物规则'
      trigger={button}
      onFinish={(values) => {
        if (values?.data!=='') {
          callback(values);
          return true;
        }
        return false;
      }}
      modalProps={{destroyOnClose:true}}
      initialValues={initialValues}
    >
      <ProFormText
        label="名称"
        name="name"
        initialValue={''}
        rules={[{ required: true, message: '请输入名称' }]}
      />
      <ProFormDigit
        label="每分钟上限"
        name="limit"
        initialValue={''}
        rules={[{ required: true, message: '请输入每分钟上限' }]}
      />
      <ProFormText
        label="消息"
        name="msg"
        initialValue={''}
      />
      <ProFormList
        name="matches"
        creatorButtonProps={{
          position: 'bottom',
          creatorButtonText: '新建礼物规则',
        }}
        rules={[{ required: true, message: '请创建一条礼物规则' }]}
        initialValue={['']}
      >
        <ProFormText
          width="lg"
          name="match"
          label="礼物匹配规则"
          rules={[{ required: true, message: '请输入礼物规则' }]}
        />
      </ProFormList>
    </ModalForm>
  );
};
