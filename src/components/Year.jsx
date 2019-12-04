import React, { PureComponent } from "react";
import { Radio, InputNumber, Row, Col, List } from "antd";
const { Group } = Radio;
export default class Year extends PureComponent {
    changeParams(type, value) {
        const state = { ...this.props.year };
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
            year: { type, start, end }
        } = this.props;
        return (
            <div>
                <Group
                    value={type}
                    onChange={e => {
                        this.changeParams("type", e.target.value);
                    }}
                    defaultValue=""
                >
                    <List size="small" bordered>
                        <List.Item>
                            <Radio value="">不指定</Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="*">每年</Radio>
                        </List.Item>
                        <List.Item>
                            <Radio value="period">周期</Radio>
                            <InputNumber
                                min={new Date().getFullYear()}
                                defaultValue={2018}
                                value={start}
                                placeholder="年"
                                onChange={value => {
                                    this.changeParams("start", value);
                                }}
                                disabled={type !== "period"}
                            />
                            {" - "}
                            <InputNumber
                                min={new Date().getFullYear() + 1}
                                defaultValue={2019}
                                value={end}
                                placeholder="年"
                                onChange={value => {
                                    this.changeParams("end", value);
                                }}
                                disabled={type !== "period"}
                            />
                        </List.Item>
                    </List>
                </Group>
            </div>
        );
    }
}
