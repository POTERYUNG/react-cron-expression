import React, { PureComponent } from "react";
import { Radio, InputNumber, message, List, Checkbox, Select } from "antd";
const { Group } = Radio;
export default class Hour extends PureComponent {
    constructor(props) {
        super(props);
        this.formatHourOptions();
    }

    // formatHourOptions() {
    // 	this.hourOptions = [];
    // 	for (let x = 0; x < 24; x++) {
    // 		this.hourOptions.push({
    // 			label: x < 10 ? `0${x}` : x,
    // 			value: `${x}`
    // 		});
    // 	}
    // }

    formatHourOptions() {
        this.hourOptions = [];
        for (let x = 0; x < 24; x++) {
            const label = x < 10 ? `0${x}` : x;
            const value = `${x}`;
            const ele = (
                <Select.Option value={value} key={`${label}-${x}`}>
                    {label}
                </Select.Option>
            );
            this.hourOptions.push(ele);
        }
    }

    changeParams(type, value) {
        const state = { ...this.props.hour };
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
        const state = { ...this.props.hour };
        // if (e.target.value === "some") {
        //     state.some = ["1"];
        // }
        state.type = e.target.value;
        this.props.onChange(state);
    };

    render() {
        const {
            hour: { type, start, end, begin, some, beginEvery },
            objLang = {},
        } = this.props;
        return (
            <div>
                <Group value={type} onChange={this.changeType}>
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="*">{objLang.perHour}</Radio>
                        </List.Item>
                        <List.Item style={{ marginBottom: 5 }}>
                            <Radio value="period">{objLang.cycle}</Radio>{objLang.from}{" "}
                            <InputNumber
                                min={0}
                                max={22}
                                defaultValue={0}
                                style={{ width: 80 }}
                                placeholder={objLang.hour}
                                size="small"
                                value={start}
                                onChange={value => {
                                    this.changeParams("start", value);
                                }}
                                disabled={type !== "period"}
                            />
                            {objLang.to}
                            <InputNumber
                                min={1}
                                max={23}
                                defaultValue={1}
                                style={{ width: 80 }}
                                placeholder={objLang.hour}
                                value={end}
                                size="small"
                                onChange={value => {
                                    this.changeParams("end", value);
                                }}
                                disabled={type !== "period"}
                            />
                            &nbsp;{objLang.hour}&nbsp;
                        </List.Item>
                        <List.Item>
                            <Radio value="beginInterval"></Radio>
                            {objLang.fromTheFirst}
                            <InputNumber
                                min={0}
                                max={23}
                                defaultValue={0}
                                placeholder={objLang.hour}
                                size="small"
                                value={begin}
                                onChange={value => {
                                    this.changeParams("begin", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />
                            {objLang.hourStartEvery}
                            <InputNumber
                                min={1}
                                max={23}
                                defaultValue={1}
                                placeholder={objLang.hour}
                                size="small"
                                value={beginEvery}
                                onChange={value => {
                                    this.changeParams("beginEvery", value);
                                }}
                                disabled={type !== "beginInterval"}
                            />
                            {objLang.hourExecuteOnce}
                        </List.Item>
                        <List.Item>
                            <Radio value="some">{objLang.specificHours}</Radio>
                            <Select
                                style={{ width: "auto" }}
                                defaultValue={1}
                                mode="multiple"
                                placeholder={objLang.hours}
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
                                {this.hourOptions}
                            </Select>
                        </List.Item>
                    </List>
                </Group>
            </div>
        );
    }
}
