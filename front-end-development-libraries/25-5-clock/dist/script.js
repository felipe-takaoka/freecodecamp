const { DownCircleOutlined, UpCircleOutlined, PlayCircleOutlined, PauseCircleOutlined, UndoOutlined } = icons;
const { Typography, Button, Row, Col, Card, Statistic } = window.antd;
const { Countdown } = Statistic;
const { Title } = Typography;

const initState = {
  break: 5,
  session: 25,
  timeLeft: 25 * 60,
  activeTimer: "Session",
  active: false };


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = initState;

    this.handleLengthChange = this.handleLengthChange.bind(this);
    this.handleStartStop = this.handleStartStop.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.decrementTimeLeft = this.decrementTimeLeft.bind(this);
    this.clockify = this.clockify.bind(this);
    this.timedOut = this.timedOut.bind(this);
  }

  handleLengthChange(e) {
    const [stateVar, changeType] = e.currentTarget.id.split("-");
    const increment = changeType === "increment" ? 1 : -1;

    this.setState((prevState, props) => {
      var newState = {};
      const newValue = Math.min(60, Math.max(1, prevState[stateVar] + increment));
      newState[stateVar] = newValue;
      newState["timeLeft"] = stateVar === "session" ? 60 * newValue : prevState.timeLeft;
      return prevState.active ? prevState : newState;
    });
  }

  timedOut() {
    this.setState((prevState, props) => {
      if (prevState.activeTimer === "Session") {
        return {
          activeTimer: "Break",
          timeLeft: 60 * prevState.break };

      } else {
        this.audioBeep.play();
        return {
          activeTimer: "Session",
          timeLeft: 60 * prevState.session };

      }
    });

    const now = new Date().getTime();
    this.decrementTimeLeft(now)();
  }

  decrementTimeLeft(lastDecrementAt) {
    return () => {
      this.setState((prevState, props) => {
        const now = new Date().getTime();
        const secondsPassed = (now - lastDecrementAt) / 1000;

        if (prevState.active) {
          const newTimeLeft = Math.max(0, prevState.timeLeft - secondsPassed);
          // Set timeout for next decrement
          if (newTimeLeft > 0) {
            setTimeout(this.decrementTimeLeft(now), Math.min(1000, newTimeLeft));
          } else {
            this.timedOut();
          }
          return { timeLeft: newTimeLeft };
        }
        return prevState;
      });
    };
  }

  handleStartStop() {
    this.setState((prevState, props) => {
      const now = new Date().getTime();
      this.decrementTimeLeft(now)();
      return {
        active: !prevState.active };

    });
  }

  handleReset() {
    this.setState(initState);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }

  clockify() {
    let minutes = Math.floor(this.state.timeLeft / 60);
    let seconds = Math.floor(this.state.timeLeft - minutes * 60);
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }

  render() {
    return /*#__PURE__*/(
      React.createElement(React.Fragment, null, /*#__PURE__*/
      React.createElement(Title, { level: 1 }, "25+5 Clock"), /*#__PURE__*/
      React.createElement(Row, null, /*#__PURE__*/
      React.createElement(Col, { span: 12, id: "break-label" }, /*#__PURE__*/
      React.createElement(Title, { level: 3 }, "Break Length"), /*#__PURE__*/
      React.createElement(Button, { type: "text",
        icon: /*#__PURE__*/React.createElement(DownCircleOutlined, null),
        id: "break-decrement",
        onClick: this.handleLengthChange }), /*#__PURE__*/
      React.createElement("span", { style: { fontSize: "2em" }, id: "break-length" }, this.state.break), /*#__PURE__*/
      React.createElement(Button, { type: "text",
        icon: /*#__PURE__*/React.createElement(UpCircleOutlined, null),
        id: "break-increment",
        onClick: this.handleLengthChange })), /*#__PURE__*/


      React.createElement(Col, { span: 12, id: "session-label" }, /*#__PURE__*/
      React.createElement(Title, { level: 3 }, "Session Length"), /*#__PURE__*/
      React.createElement(Button, { type: "text",
        icon: /*#__PURE__*/React.createElement(DownCircleOutlined, null),
        id: "session-decrement",
        onClick: this.handleLengthChange }), /*#__PURE__*/
      React.createElement("span", { style: { fontSize: "2em" }, id: "session-length" }, this.state.session), /*#__PURE__*/
      React.createElement(Button, { type: "text",
        icon: /*#__PURE__*/React.createElement(UpCircleOutlined, null),
        id: "session-increment",
        onClick: this.handleLengthChange }))), /*#__PURE__*/



      React.createElement(Row, null, /*#__PURE__*/
      React.createElement(Col, { span: 24 }, /*#__PURE__*/
      React.createElement(Card, { bordered: false,
        style: { backgroundColor: "transparent" },
        title: this.state.activeTimer,
        id: "timer-label" }, /*#__PURE__*/
      React.createElement("div", { id: "time-left" }, /*#__PURE__*/
      React.createElement(Statistic, { value: this.clockify() }))))), /*#__PURE__*/





      React.createElement(Row, null, /*#__PURE__*/
      React.createElement(Col, { span: 24 }, /*#__PURE__*/
      React.createElement(Button, { type: "text",
        size: "large",
        icon: this.state.active ? /*#__PURE__*/React.createElement(PauseCircleOutlined, null) : /*#__PURE__*/React.createElement(PlayCircleOutlined, null),
        id: "start_stop",
        onClick: this.handleStartStop }), /*#__PURE__*/
      React.createElement(Button, { type: "text",
        size: "large",
        icon: /*#__PURE__*/React.createElement(UndoOutlined, null),
        id: "reset",
        onClick: this.handleReset }))), /*#__PURE__*/



      React.createElement("audio", {
        id: "beep",
        preload: "auto",
        ref: audio => {
          this.audioBeep = audio;
        },
        src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" })));



  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));