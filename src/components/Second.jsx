import React, { PureComponent } from "react";
import { Radio, InputNumber, message, List, Checkbox, Select } from "antd";
const { Group } = Radio;
export default class Second extends PureComponent {
    constructor(props) {
        super(props);
        this.formatSecondOptions();
    }

    // formatSecondOptions() {
    //     this.secondOptions = [];
    //     for (let x = 0; x < 60; x++) {
    //         this.secondOptions.push({
    //             label: x < 10 ? `0${x}` : x,
    //             value: `${x}`
    //         });
    //     }
    // }

    changeParams(type, value) {
        const state = { ...this.props.second };
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

    formatSecondOptions() {
        this.secondOptions = [];
        for (let x = 0; x < 60; x++) {
            const label = x < 10 ? `0${x}` : x;
            const value = `${x}`;
            const ele = (
                <Select.Option value={value} key={`${label}-${x}`}>
                    {label}
                </Select.Option>
            );
            this.secondOptions.push(ele);
        }
    }

    render() {
        const {
            second: { type, start, end, begin, beginEvery, some },
            objLang = {},
        } = this.props;
        return (
            <div>
                <Group
                    value={type}
                    onChange={e => {
                        const state = { ...this.props.second };
                        // if (e.target.value !== "some") {
                        //     state.some = ["0"];
                        // }
                        state.type = e.target.value;
                        this.props.onChange(state);
                    }}
                >
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">{objLang.perSecond}</Radio>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">{objLang.cycle}</Radio>
                            {objLang.from} &nbsp;
                            <InputNumber
                                min={0}
                                max={58}
                                defaultValue={0}
                                style={{ width: 80 }}
                                placeholder={objLang.second}
                                size="small"
                                value={start}
                                onChange={value => {
                                    this.changeParams("start", value);
                                }}
                                disabled={type !== "period"}
                            />
                            &nbsp;{objLang.to}&nbsp;
                            <InputNumber
                                min={1}
                                max={59}
                                defaultValue={1}
                                style={{ width: 80 }}
                                placeholder={objLang.second}
                                value={end}
                                size="small"
                                onChange={value => {
                                    this.changeParams("end", value);
                                }}
                                disabled={type !== "period"}
                            />
                            &nbsp;{objLang.second}&nbsp;
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>
                            {objLang.fromTheFirst} &nbsp;
                            <InputNumber
                                min={0}
                                max={59}
                                defaultValue={0}
                                placeholder={objLang.second}
                                size="small"
                                value={begin}
                                onChange={value => {
                                    this.changeParams("begin", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />{" "}
                            &nbsp;{objLang.secondsStartEvery} &nbsp;
                            <InputNumber
                                min={0}
                                max={59}
                                defaultValue={0}
                                placeholder={objLang.second}
                                size="small"
                                value={beginEvery}
                                onChange={value => {
                                    this.changeParams("beginEvery", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />{" "}
                            &nbsp;{objLang.secondsExecuteOnce}
                        </List.Item>
                        <List.Item>
                            <Radio value="some">{objLang.specificSeconds}</Radio>
                            <Select
                                style={{ width: "auto" }}
                                defaultValue={1}
                                mode="multiple"
                                placeholder={objLang.seconds}
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
                                {this.secondOptions}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        );
    }
}
