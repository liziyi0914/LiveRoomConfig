import React from 'react';
import {
  BasicLayoutProps
} from '@ant-design/pro-layout';
import logo from '@/logo2.png';

export const layout = (): BasicLayoutProps => {
  return {
    logo: <img src={logo} style={{width:32,height:32,borderRadius:'8px'}}/>,
    headerContentRender: () => <h1>LiveRoom 配置文件生成器</h1>,
    footerRender: ()=>(
      <footer style={{ textAlign: 'center' }}>
        LNightStudio ©2021 Created by liziyi0914 <a href='https://beian.miit.gov.cn/'>粤ICP备2021031980号</a>
      </footer>
    ),
    rightRender: ()=>null
  };
};
