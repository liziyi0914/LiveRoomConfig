import {
  Spin,
} from 'antd';

export default () => {
  return (
    <div style={{ textAlign: 'center', padding: '3rem' }}>
      <Spin tip='加载中...' spinning/>
    </div>
  );
};
