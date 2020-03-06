import React, { PureComponent } from "react";
import { Radio, InputNumber, Row, Col, List, Checkbox, Select } from "antd";
const { Group } = Radio;
export default class Month extends PureComponent {
    constructor(props) {
        super(props);
        this.formatMonthOptions();
    }

    changeParams(type, value) {
        const state = { ...this.props.month };
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

    // eachMonthOptions() {
    //     const options = [];
    //     for (let i = 1; i < 13; i++) {
    //         options.push({ label: `${i}月`, value: `${i}` });
    //     }
    //     return options;
    // }

    formatMonthOptions() {
        const { objLang = {}, lang } = this.props;
        this.monthOptions = [];
        for (let x = 1; x < 13; x++) {
            let label = `${x}${objLang.month}`;
            if (lang === 'enUS') {
                switch (x) {
                    case 1:
                        label = 'January';
                        break;
                    case 2:
                        label = 'February';
                        break;
                    case 3:
                        label = 'March';
                        break;
                    case 4:
                        label = 'April';
                        break;
                    case 5:
                        label = 'May';
                        break;
                    case 6:
                        label = 'June';
                        break;
                    case 7:
                        label = 'July';
                        break;
                    case 8:
                        label = 'August';
                        break;
                    case 9:
                        label = 'September';
                        break;
                    case 10:
                        label = 'October';
                        break;
                    case 11:
                        label = 'November';
                        break;
                    case 12:
                        label = 'December';
                        break;
                }
            }

            const value = `${x}`;
            const ele = (
                <Select.Option value={value} key={`${label}-${x}`}>
                    {label}
                </Select.Option>
            );
            this.monthOptions.push(ele);
        }
    }

    changeType = e => {
        const state = { ...this.props.month };
        // if (e.target.value === "some") {
        //     state.some = ["1"];
        // }
        state.type = e.target.value;
        this.props.onChange(state);
    };

    render() {
        const {
            month: { type, start, end, beginEvery, begin, some },
            objLang = {},
        } = this.props;
        return (
            <div>
                <Group value={type} onChange={this.changeType}>
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">{objLang.perMonth}</Radio>
                        </List.Item>
                        {/* <List.Item>
                            <Radio value="?">不指定</Radio>
                        </List.Item> */}
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">{objLang.cycle}</Radio>{objLang.from}{" "}
                            <InputNumber
                                min={1}
                                max={11}
                                defaultValue={1}
                                placeholder={objLang.month}
                                size="small"
                                value={start}
                                onChange={value => {
                                    this.changeParams("start", value);
                                }}
                                disabled={type !== "period"}
                            />{" "}
                            {objLang.to}{" "}
                            <InputNumber
                                min={2}
                                max={12}
                                defaultValue={2}
                                placeholder={objLang.month}
                                value={end}
                                size="small"
                                onChange={value => {
                                    this.changeParams("end", value);
                                }}
                                disabled={type !== "period"}
                            />
                            &nbsp;{objLang.month}&nbsp;
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>
                            <InputNumber
                                min={1}
                                max={12}
                                defaultValue={1}
                                placeholder={objLang.day}
                                size="small"
                                value={begin}
                                onChange={value => {
                                    this.changeParams("begin", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />{" "}
                            {objLang.dayStartEvery}{" "}
                            <InputNumber
                                min={1}
                                max={12}
                                defaultValue={1}
                                placeholder={objLang.month}
                                endYear={beginEvery}
                                size="small"
                                onChange={value => {
                                    this.changeParams("beginEvery", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />{" "}
                            {objLang.monthExecuteOnce}
                        </List.Item>
                        <List.Item>
                            <Radio value="some">{objLang.specificMonth}</Radio>
                            <Select
                                style={{ width: "auto" }}
                                defaultValue={1}
                                mode="multiple"
                                placeholder={objLang.months}
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
                                {this.monthOptions}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        );
    }
}
