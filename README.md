# react-cron-expression
+ 1.基于react组件的cron表达式生成工具
+ 2.可展示最近五次运行时间

## Install

```shell
npm i react-cron-expression --save
```

## Usage

```javascript
import CronReactExpression from 'react-cron-expression';

<CronReactExpression onChange={this.onChange} />
```

## API

| Prop | Description | Default
| --- | --- | -- |
| value | cron expression  |0 0 0 * * ?  |
| onChange | 值改变触发 | noop |
| showRunTime（待优化） | show cron runtime | false | 
| tabType | 页签的基本样式，可选 line、card editable-card 类型 | 'line' | 
| activeKey | 定位当前页签，可选 'second' | 'minute' | 'hour' | 'day' | 'month' | 'week' | 'year'
| onlyShowTab | 仅显示某页签，可选 'second' | 'minute' | 'hour' | 'day' | 'month' | 'week' | 'year'
| showCrontab | 是否显示crontab | true | 

## License

[MIT](./LICENSE)

