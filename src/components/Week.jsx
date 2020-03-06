import React, { PureComponent } from "react";
import { Radio, InputNumber, Row, Col, Select, List, Checkbox, message } from "antd";
import { zhCN } from "../locales/zh-CN";
const { Group } = Radio;
let langObj = zhCN;
export default class Week extends PureComponent {
    constructor(props) {
        super(props);
        langObj = props.objLang || zhCN;
        this.weekOptions = [
            {
                label: langObj.monday,
                value: 1
            },
            {
                label: langObj.tuesday,
                value: 2
            },
            {
                label: langObj.wednesday,
                value: 3
            },
            {
                label: langObj.thursday,
                value: 4
            },
            {
                label:langObj.friday,
                value: 5
            },
            {
                label: langObj.saturday,
                value: 6
            },
            {
                label: langObj.sunday,
                value: 7
            }
        ];
    }

    getWeekOptions() {
        return this.weekOptions.map((item, index) => {
            return (
                <Select.Option value={item.value} key={`${item.label}-${index}`}>
                    {item.label}
                </Select.Option>
            );
        });
    }

    changeParams(type, value) {
        const state = { ...this.props.week };
        state[type] = value;
        if (type === 'start') {
            if (state.end - state.start <= 1) {
                state.end = value + 1;
            }
        }
        if (type === 'end') {
            if (state.end - state.start <= 1) {
                state.start = value - 1;
            }
        }
        this.props.onChange(state);
    }

    render() {
        const {
            week: { type, start, end, some, begin, beginEvery, last },
            objLang = {},
        } = this.props;
        return (
            <div>
                <Group
                    value={type}
                    onChange={e => {
                        const state = { ...this.props.week };
                        // if (e.target.value === "some") {
                        //     state.some = ["1"];
                        // }
                        state.type = e.target.value;
                        this.props.onChange(state);
                    }}
                >
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">{objLang.perWeek}</Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="?">{objLang.notSpecified}</Radio>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">{objLang.cycle}</Radio>{objLang.from}{" "}
                            <Select
                                style={{ width: 80 }}
                                defaultValue={1}
                                placeholder={objLang.week}
                                size="small"
                                value={start}
                                onChange={value => {
                                    this.changeParams("start", value);
                                }}
                                disabled={type !== "period"}
                            >
                                {this.getWeekOptions().slice(0, 6)}
                            </Select>{" "}
                            {objLang.to}{" "}
                            <Select
                                style={{ width: 80 }}
                                defaultValue={2}
                                placeholder={objLang.week}
                                value={end}
                                size="small"
                                onChange={value => {
                                    this.changeParams("end", value);
                                }}
                                disabled={type !== "period"}
                            >
                                {this.getWeekOptions().slice(1, 7)}
                            </Select>
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>{objLang.NO}{" "}
                            <InputNumber
                                min={1}
                                max={4}
                                defaultValue={"1"}
                                placeholder={objLang.week}
                                size="small"
                                value={begin}
                                onChange={value => {
                                    this.changeParams("begin", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />{" "}
                            {objLang.weekOf}{" "}
                            <Select
                                style={{ width: 80 }}
                                defaultValue={"1"}
                                placeholder={objLang.week}
                                value={beginEvery}
                                size="small"
                                onChange={value => {
                                    this.changeParams("beginEvery", value);
                                }}
                                disabled={type !== "beginInterval"}
                            >
                                {this.getWeekOptions()}
                            </Select>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="last"></Radio>
                            {objLang.lastTheMonth}
                            <Select
                                style={{ width: 80 }}
                                defaultValue={1}
                                placeholder={objLang.week}
                                size="small"
                                value={last}
                                onChange={value => {
                                    this.changeParams("last", value);
                                }}
                                disabled={type !== "last"}
                            >
                                {this.getWeekOptions()}
                            </Select>
                        </List.Item>
                        <List.Item>
                            <Radio value="some">{objLang.specificWeek}</Radio>
                            <Select
                                style={{ width: "auto" }}
                                defaultValue="1"
                                mode="multiple"
                                placeholder={objLang.weeks}
                                size="small"
                                value={some}
                                showArrow
                                onChange={value => {
                                    if (value.length < 1) {
                                        return message.warn(objLang.selectLeastOne);
                                    }
                                    this.changeParams("some", value);
                                }}
                                disabled={type !== "some"}
                            >
                                {this.getWeekOptions()}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        );
    }
}
