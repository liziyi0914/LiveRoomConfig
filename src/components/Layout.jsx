import {
  Card
} from 'antd';

export default (props)=>{
  return (
    <Card style={{margin:'1.25rem'}}>
      {props.children}
    </Card>
  );
};
