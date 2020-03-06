import React, { PureComponent } from "react";
import { Radio, InputNumber, Row, Col, Select, List, Checkbox } from "antd";
const { Group } = Radio;
export default class Day extends PureComponent {
    constructor(props) {
        super(props);
        this.formatDayOptions();
    }

    // formatDayOptions() {
    //     this.dayOptions = [];
    //     for (let x = 1; x < 32; x++) {
    //         this.dayOptions.push({
    //             label: x,
    //             value: `${x}`
    //         });
    //     }
    // }

    formatDayOptions() {
        this.dayOptions = [];
        for (let x = 1; x < 32; x++) {
            const label = x < 10 ? `0${x}` : x;
            const value = `${x}`;
            const ele = (
                <Select.Option value={value} key={`${label}-${x}`}>
                    {label}
                </Select.Option>
            );
            this.dayOptions.push(ele);
        }
    }

    changeParams(type, value) {
        const state = { ...this.props.day };
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

    changeType = e => {
        const state = { ...this.props.day };
        // if (e.target.value === "some") {
        //     state.some = ["1"];
        // }
        state.type = e.target.value;
        this.props.onChange(state);
    };

    render() {
        const {
            day: { type, start, end, some, begin, beginEvery, last, closeWorkDay },
            objLang = {},
        } = this.props;
        return (
            <div>
                <Group value={type} onChange={this.changeType}>
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">{objLang.perDay}</Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="?">{objLang.notSpecified}</Radio>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">{objLang.cycle}</Radio>{objLang.from}{" "}
                            <InputNumber
                                min={1}
                                max={30}
                                defaultValue={1}
                                style={{ width: 80 }}
                                placeholder={objLang.day}
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
                                max={31}
                                defaultValue={2}
                                style={{ width: 80 }}
                                placeholder={objLang.day}
                                value={end}
                                size="small"
                                onChange={value => {
                                    this.changeParams("end", value);
                                }}
                                disabled={type !== "period"}
                            />
                            &nbsp;{objLang.day}&nbsp;
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>
                            {" "}
                            <InputNumber
                                min={1}
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
                                defaultValue={1}
                                placeholder={objLang.day}
                                size="small"
                                value={beginEvery}
                                onChange={value => {
                                    this.changeParams("beginEvery", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />
                            &nbsp;{objLang.dayExecuteOnce}
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="closeWorkDay"></Radio>
                            {objLang.perMonth}{" "}
                            <InputNumber
                                min={1}
                                defaultValue={1}
                                placeholder={objLang.day}
                                size="small"
                                value={closeWorkDay}
                                onChange={value => {
                                    this.changeParams("closeWorkDay", value);
                                }}
                                disabled={type !== "closeWorkDay"}
                            />
                            &nbsp;{objLang.nearestWorkingDay}
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="last">
                                {objLang.thisMonthLast}{" "}
                                <InputNumber
                                    min={0}
                                    placeholder={objLang.day}
                                    size="small"
                                    value={last}
                                    onChange={value => {
                                        this.changeParams("last", value);
                                    }}
                                    disabled
                                // disabled={type !== "last"}
                                />{" "}
                                {objLang.day}
                            </Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="some">{objLang.specificDay}</Radio>
                            <Select
                                style={{ width: "auto" }}
                                defaultValue={["00"]}
                                mode="multiple"
                                placeholder={objLang.days}
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
                                {this.dayOptions}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        );
    }
}
