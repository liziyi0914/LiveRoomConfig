import React from 'react';
import {
  ModalForm,
  ProFormText
} from '@ant-design/pro-form';

export default (button,title,label,callback=(()=>{}),init='') => {
  return (
    <ModalForm
      title={title}
      trigger={button}
      onFinish={(values) => {
        if (values?.data!=='') {
          callback(values?.data);
          return true;
        }
        return false;
      }}
      modalProps={{destroyOnClose:true}}
      initialValues={{data:init}}
    >
      <ProFormText
        label={label}
        name="data"
        rules={[{ required: true, message: '请输入名称' }]}
        initialValue={''}
      />
    </ModalForm>
  );
};
