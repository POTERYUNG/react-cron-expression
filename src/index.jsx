import React, { PureComponent } from "react";
import PropTypes from 'prop-types'
import { Tabs, Dropdown, Row, Col, Input, List, Collapse } from "antd";
import Year from "./components/Year";
import Month from "./components/Month";
import Week from "./components/Week";
import Day from "./components/Day";
import Hour from "./components/Hour";
import Minute from "./components/Minute";
import Second from "./components/Second";
import CronParse from "./parse-lib/index";
import CronParser from "cron-parser";
import moment from "moment";
import { zhCN } from "./locales/zh-CN";
import { enUS } from "./locales/en-US";
const { TabPane } = Tabs;
const { Panel } = Collapse;
import "./css/index.less";

const noop = function () { };

const dateMinute = "YYYY-MM-DD HH:mm";
let objLang = zhCN;
class CronReactExpression extends PureComponent {
    constructor(props) {
        super(props);
        const date = new Date();
        const { activeKey, onlyShowTab, lang = 'zhCN' } = this.props;
        objLang = lang === 'zhCN' ? zhCN : enUS;
        this.state = {
            activeKey: onlyShowTab || activeKey || "second",
            year: {
                type: "",
                start: date.getFullYear(),
                end: date.getFullYear()
            },
            month: {
                start: 1,
                end: 2,
                begin: 1,
                beginEvery: 1,
                type: "*",
                some: ['1']
            },
            week: {
                start: 1,
                end: 2,
                last: 1,
                begin: 1,
                beginEvery: 1,
                type: "?",
                some: [1]
            },
            day: {
                last: 1,
                closeWorkDay: 1,
                start: 1,
                end: 2,
                begin: 1,
                beginEvery: 1,
                type: "*",
                some: ['1']
            },
            hour: {
                start: 0,
                end: 1,
                begin: 0,
                beginEvery: 1,
                type: "*",
                some: []
            },
            minute: {
                start: 0,
                end: 1,
                begin: 0,
                beginEvery: 1,
                type: "*",
                some: []
            },
            second: {
                start: 0,
                end: 1,
                begin: 0,
                beginEvery: 1,
                type: "*",
                some: []
            },
            runTime: []
        };
    }

    initValue() {
        let { value } = this.props;
        value = value.toUpperCase();
        const valuesArray = value.split(" ");
        let newState = { ...this.state };
        newState.second.value = valuesArray[0] || "";
        newState.minute.value = valuesArray[1] || "";
        newState.hour.value = valuesArray[2] || "";
        newState.day.value = valuesArray[3] || "";
        newState.month.value = valuesArray[4] || "";
        newState.week.value = valuesArray[5] || "";
        newState.year.value = valuesArray[6] || "";
        this.setState(newState, () => {
            this.parse();
        });
    }

    componentDidMount(props) {
        this.initValue(props);
    }

    componentDidUpdate(props) {
        const { value } = this.props;
        if (props.value !== value && value) {
            this.initValue();
        }
    }

    parse() {
        let { year, month, week, day, hour, minute, second } = this.state;
        if (year.value.indexOf("-") > -1) {
            year.type = "period";
            const period = year.value.split("-")[0];
            year.start = period[0];
            year.end = period[1];
        } else {
            year.type = year.value;
        }
        if (week.value.indexOf("-") > -1) {
            week.type = "period";
            const period = week.value.split("-")[0];
            week.start = period[0];
            week.end = period[1];
        } else if (week.value.indexOf("L") > -1) {
            week.type = "last";
            week.last = week.value.split("L")[0] || 1;
        } else if (week.value.indexOf("#") > -1) {
            week.type = "beginInterval";
            week.begin = week.value.split("#")[0];
            week.beginEvery = week.value.split("#")[1];
        } else if (week.value.indexOf(",") > -1 || /^[0-9]+$/.test(week.value)) {
            week.type = "some";
            week.some = week.value.split(",");
        } else {
            week.type = week.value || "?";
        }

        if (month.value.indexOf("-") > -1) {
            month.type = "period";
            month.start = month.value.split("-")[0];
            month.end = month.value.split("-")[1];
        } else if (month.value.indexOf("/") > -1) {
            month.type = "beginInterval";
            month.begin = month.value.split("/")[0];
            month.beginEvery = month.value.split("/")[1];
        } else if (month.value.indexOf(",") > -1 || /^[0-9]+$/.test(month.value)) {
            month.type = "some";
            month.some = month.value.split(",");
        } else {
            month.type = month.value || "?";
        }

        if (day.value.indexOf("-") > -1) {
            day.type = "period";
            day.start = day.value.split("-")[0];
            day.end = day.value.split("-")[1];
        } else if (day.value.indexOf("W") > -1) {
            day.type = "closeWorkDay";
            day.closeWorkDay = day.value.split("W")[0] || 1;
        } else if (day.value.indexOf("L") > -1) {
            day.type = "last";
            day.last = day.value.split("L")[0] || 1;
        } else if (day.value.indexOf("/") > -1) {
            day.type = "beginInterval";
            day.begin = day.value.split("/")[0];
            day.beginEvery = day.value.split("/")[1];
        } else if (day.value.indexOf(",") > -1 || /^[0-9]+$/.test(day.value)) {
            day.type = "some";
            day.some = day.value.split(",");
        } else {
            day.type = day.value || "?";
        }

        if (hour.value.indexOf("-") > -1) {
            hour.type = "period";
            hour.start = hour.value.split("-")[0];
            hour.end = hour.value.split("-")[1];
        } else if (hour.value.indexOf("/") > -1) {
            hour.type = "beginInterval";
            hour.begin = hour.value.split("/")[0];
            hour.beginEvery = hour.value.split("/")[1];
        } else if (hour.value.indexOf(",") > -1 || /^[0-9]+$/.test(hour.value)) {
            hour.type = "some";
            hour.some = hour.value.split(",");
        } else {
            hour.type = hour.value || "?";
        }

        if (minute.value.indexOf("-") > -1) {
            minute.type = "period";
            minute.start = minute.value.split("-")[0];
            minute.end = minute.value.split("-")[1];
        } else if (minute.value.indexOf("/") > -1) {
            minute.type = "beginInterval";
            minute.begin = minute.value.split("/")[0];
            minute.beginEvery = minute.value.split("/")[1];
        } else if (minute.value.indexOf(",") > -1 || /^[0-9]+$/.test(minute.value)) {
            minute.type = "some";
            minute.some = minute.value.split(",");
        } else {
            minute.type = minute.value || "?";
        }

        if (second.value.indexOf("-") > -1) {
            second.type = "period";
            second.start = second.value.split("-")[0];
            second.end = second.value.split("-")[1];
        } else if (second.value.indexOf("/") > -1) {
            second.type = "beginInterval";
            second.begin = second.value.split("/")[0];
            second.beginEvery = second.value.split("/")[1];
        } else if (second.value.indexOf(",") > -1 || /^[0-9]+$/.test(second.value)) {
            second.type = "some";
            second.some = second.value.split(",");
        } else {
            second.type = second.value || "?";
        }
        this.setState({
            year: { ...year },
            month: { ...month },
            week: { ...week },
            day: { ...day },
            hour: { ...hour },
            minute: { ...minute },
            second: { ...second }
        });
        console.log("this.state :", this.state);
    }

    format() {
        const { year, month, week, day, hour, minute, second } = this.state;
        return `${second.value} ${minute.value} ${hour.value} ${day.value} ${month.value} ${week.value} ${year.value}`;
    }

    changeState(state) {
        this.setState(state, () => {
            this.culcCron();
        });
    }

    // 计算用户的cron
    culcCron() {
        const { n2s } = this;
        let { year, month, week, day, hour, minute, second } = this.state;
        if (year.type === "period") {
            year.value = `${n2s(year.start)}-${n2s(year.end)}`;
        } else {
            year.value = year.type;
        }
        if (month.type === "period") {
            month.value = `${n2s(month.start)}-${n2s(month.end)}`;
        } else if (month.type === "beginInterval") {
            month.value = `${n2s(month.begin)}/${n2s(month.beginEvery)}`;
        } else if (month.type === "some") {
            month.value = month.some.join(",");
        } else {
            month.value = month.type;
        }
        if (week.type === "period") {
            week.value = `${n2s(week.start)}-${n2s(week.end)}`;
        } else if (week.type === "beginInterval") {
            week.value = `${n2s(week.begin)}#${n2s(week.beginEvery)}`;
        } else if (week.type === "last") {
            week.value = n2s(week.last) + "L";
        } else if (week.type === "some") {
            week.value = week.some.join(",");
        } else {
            week.value = week.type;
        }
        if (day.type === "period") {
            day.value = `${n2s(day.start)}-${n2s(day.end)}`;
        } else if (day.type === "beginInterval") {
            day.value = `${n2s(day.begin)}/${n2s(day.beginEvery)}`;
        } else if (day.type === "closeWorkDay") {
            day.value = n2s(day.closeWorkDay || 1) + "W";
        } else if (day.type === "last") {
            day.value = n2s(day.last || 1) + "L";
        } else if (day.type === "some") {
            day.value = day.some.join(",");
        } else {
            day.value = day.type;
        }
        if (hour.type === "period") {
            hour.value = `${n2s(hour.start)}-${n2s(hour.end)}`;
        } else if (hour.type === "beginInterval") {
            hour.value = `${n2s(hour.begin)}/${n2s(hour.beginEvery)}`;
        } else if (hour.type === "some") {
            hour.value = hour.some.join(",");
        } else {
            hour.value = hour.type;
        }
        if (minute.type === "period") {
            minute.value = `${n2s(minute.start)}-${n2s(minute.end)}`;
        } else if (minute.type === "beginInterval") {
            minute.value = `${n2s(minute.begin)}/${n2s(minute.beginEvery)}`;
        } else if (minute.type === "some") {
            minute.value = minute.some.join(",");
        } else {
            minute.value = minute.type;
        }
        if (second.type === "period") {
            second.value = `${n2s(second.start)}-${n2s(second.end)}`;
        } else if (second.type === "beginInterval") {
            second.value = `${n2s(second.begin)}/${n2s(second.beginEvery)}`;
        } else if (second.type === "some") {
            second.value = second.some.join(",");
        } else {
            second.value = second.type;
        }
        this.setState(
            {
                year: { ...year },
                month: { ...month },
                week: { ...week },
                day: { ...day },
                hour: { ...hour },
                minute: { ...minute },
                second: { ...second }
            },
            () => {
                this.triggerChange();
            }
        );
    }

    n2s(number) {
        if (typeof number === "number" && number !== NaN) {
            return `${number}`;
        }
        return number;
    }

    triggerChange() {
        const { onChange, showRunTime } = this.props;
        const crontab = this.format();
        console.log('crontab', crontab)
        onChange && onChange(crontab);
        if (!showRunTime) return; // 既然不需要，那就不算了
        let tempArr = [];
        const weekCron = crontab.split(" ")[5];
        try {
            if (weekCron !== "?") {
                const interval = CronParser.parseExpression(String(crontab).trim());
                for (let i = 0; i < 5; i++) {
                    const temp = moment(interval.next().toString()).format(dateMinute);
                    tempArr.push(temp);
                }
            } else {
                const cron = new CronParse();
                tempArr = cron.expressionChange(String(crontab).trim());
            }
        } catch (error) {
            // console.log("error :", error);
            tempArr.push("暂无最新执行周期");
        }
        if (tempArr.length > 0) {
            this.setState({
                runTime: tempArr
            });
        }
    }

    // 发生表单值改变，重新计算
    onChange = (type, value) => {
        this.state[type].value = value;

        this.setState({ ...this.state }, () => {
            this.parse();
        });
    };

    renderOverLay() {
        const { activeKey, week, day } = this.state;
        const { tabType, onlyShowTab, lang } = this.props;
        let tabs = [
            {
                title: objLang.second,
                key: 'second',
                content: (
                    <Second
                        {...this.state}
                        objLang={objLang}
                        onChange={state => {
                            this.changeState({ second: state });
                        }}
                    />
                ),
            },
            {
                title: objLang.minute,
                key: 'minute',
                content: (
                    <Minute
                        {...this.state}
                        objLang={objLang}
                        onChange={state => {
                            this.changeState({ minute: state });
                        }}
                    />
                ),
            },
            {
                title: objLang.hour,
                key: 'hour',
                content: (
                    <Hour
                        {...this.state}
                        objLang={objLang}
                        onChange={state => {
                            this.changeState({ hour: state });
                        }}
                    />
                ),
            },
            {
                title: objLang.day,
                key: 'day',
                content: (
                    <Day
                        {...this.state}
                        objLang={objLang}
                        onChange={state => {
                            if (week.type === '?' && state.type === '?') {
                                const obj = { ...week, type: "*" }
                                console.log('obj', obj)
                                this.setState({
                                    week: obj
                                })
                            } else {
                                const obj = { ...week, type: "?" }
                                console.log('obj', obj)
                                this.setState({
                                    week: obj
                                })
                            }
                            this.changeState({ day: state });
                        }}
                    />
                ),
            },
            {
                title: objLang.month,
                key: 'month',
                content: (
                    <Month
                        {...this.state}
                        objLang={objLang}
                        lang={lang}
                        onChange={state => {
                            this.changeState({ month: state });
                        }}
                    />
                ),
            },
            {
                title: objLang.week,
                key: 'week',
                content: (
                    <Week
                        {...this.state}
                        objLang={objLang}
                        onChange={state => {
                            if (day.type === '?' && state.type === '?') {
                                const obj = { ...week, type: "*" }
                                console.log('obj', obj)
                                this.setState({
                                    day: obj
                                })
                            } else {
                                const obj = { ...week, type: "?" }
                                console.log('obj', obj)
                                this.setState({
                                    day: obj
                                })
                            }

                            this.changeState({ week: state });
                        }}
                    />
                ),
            },
            {
                title: objLang.year,
                key: 'year',
                content: (
                    <Year
                        {...this.state}
                        objLang={objLang}
                        onChange={state => {
                            this.changeState({ year: state });
                        }}
                    />
                ),
            },
        ];
        if (!!onlyShowTab) {
            tabs = tabs.filter((item) => item.key === onlyShowTab);
        }

        return (
            <Tabs
                activeKey={activeKey}
                onChange={key => {
                    this.setState({ activeKey: key });
                }}
                type={tabType}
            >
                {
                    tabs.map((item) => {
                        return (
                            <TabPane tab={item.title} key={item.key}>
                                {item.content}
                            </TabPane>
                        );
                    })
                }
            </Tabs>
        );
    }

    render() {
        const state = JSON.parse(JSON.stringify(this.state));
        const { year, month, week, day, hour, minute, second, runTime } = state;
        const { showRunTime, showCrontab } = this.props;
        return (
            <div className="cron-editor-react">
                {this.renderOverLay()}
                {
                    showCrontab && (
                        <List bordered style={{ marginTop: 10 }} >
                            <List.Item className="cron-list-type">
                                <Row type="flex" gutter={5} style={{ width: "100%", textAlign: "center" }}>
                                    <Col span={3}>{objLang.second}</Col>
                                    <Col span={3}>{objLang.minute}</Col>
                                    <Col span={3}>{objLang.hour}</Col>
                                    <Col span={3}>{objLang.day}</Col>
                                    <Col span={3}>{objLang.month}</Col>
                                    <Col span={3}>{objLang.week}</Col>
                                    <Col span={3}>{objLang.year}</Col>
                                </Row>
                            </List.Item>
                            <List.Item>
                                <Row type="flex" gutter={5} style={{ width: "100%", textAlign: "center" }}>
                                    <Col span={3}>
                                        <Input
                                            value={second.value}
                                            onChange={e => {
                                                this.onChange("second", e.target.value);
                                            }}
                                            disabled
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <Input
                                            value={minute.value}
                                            onChange={e => {
                                                this.onChange("minute", e.target.value);
                                            }}
                                            disabled
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <Input
                                            value={hour.value}
                                            onChange={e => {
                                                this.onChange("hour", e.target.value);
                                            }}
                                            disabled
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <Input
                                            value={day.value}
                                            onChange={e => {
                                                this.onChange("day", e.target.value);
                                            }}
                                            disabled
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <Input
                                            value={month.value}
                                            onChange={e => {
                                                this.onChange("month", e.target.value);
                                            }}
                                            disabled
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <Input
                                            value={week.value}
                                            onChange={e => {
                                                this.onChange("week", e.target.value);
                                            }}
                                            disabled
                                        />
                                    </Col>
                                    <Col span={3}>
                                        <Input
                                            value={year.value}
                                            onChange={e => {
                                                this.onChange("year", e.target.value);
                                            }}
                                            disabled
                                        />
                                    </Col>
                                </Row>
                            </List.Item>
                        </List>
                    )
                }

                {
                    showRunTime
                    && (
                        <Collapse>
                            <Panel header={objLang.lastFiveTimes} key="1">
                                <List
                                    bordered
                                    dataSource={runTime}
                                    renderItem={(item, index) => (
                                        <List.Item>
                                            {objLang.NO}{index + 1}{objLang.NO}： {item}
                                        </List.Item>
                                    )}
                                />
                            </Panel>
                        </Collapse>
                    )
                }
            </div>
        );
    }
}

CronReactExpression.propTypes = {
    onChange: PropTypes.func,
    showRunTime: PropTypes.bool,
    value: PropTypes.string,
    tabType: PropTypes.string,
    activeKey: PropTypes.string,
    onlyShowTab: PropTypes.string,
    lang: PropTypes.string,
    showCrontab: PropTypes.bool
}

CronReactExpression.defaultProps = {
    onChange: noop,
    showRunTime: false,
    value: '0 0 0 * * ?',
    tabType: 'line',
    activeKey: 'second',
    onlyShowTab: '',
    lang: 'zhCN',
    showCrontab: true
}

export default CronReactExpression;
