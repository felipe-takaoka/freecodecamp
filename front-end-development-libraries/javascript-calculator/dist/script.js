const { DeleteOutlined, CloseOutlined, MinusOutlined, PlusOutlined } = icons;
const { Button, Divider, Row, Col } = window.antd;

const Numpad = props => {
  return /*#__PURE__*/(
    React.createElement("div", { id: "numpad" }, /*#__PURE__*/
    React.createElement(Row, null, /*#__PURE__*/
    React.createElement(Col, { span: 12 }, /*#__PURE__*/
    React.createElement(Button, { danger: true, block: true, icon: /*#__PURE__*/React.createElement(DeleteOutlined, null),
      type: "primary",
      id: "clear",
      onClick: props.handleClear })), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "divide", onClick: props.handleOperatorInput }, "/")), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, icon: /*#__PURE__*/React.createElement(CloseOutlined, null), id: "multiply", onClick: props.handleOperatorInput }))), /*#__PURE__*/


    React.createElement(Row, null, /*#__PURE__*/
    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "seven", onClick: props.handleDigitInput }, "7")), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "eight", onClick: props.handleDigitInput }, "8")), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "nine", onClick: props.handleDigitInput }, "9")), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "subtract", icon: /*#__PURE__*/React.createElement(MinusOutlined, null), onClick: props.handleOperatorInput }))), /*#__PURE__*/


    React.createElement(Row, null, /*#__PURE__*/
    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "four", onClick: props.handleDigitInput }, "4")), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "five", onClick: props.handleDigitInput }, "5")), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "six", onClick: props.handleDigitInput }, "6")), /*#__PURE__*/

    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { block: true, icon: /*#__PURE__*/React.createElement(PlusOutlined, null), id: "add", onClick: props.handleOperatorInput }))), /*#__PURE__*/


    React.createElement(Row, null, /*#__PURE__*/
    React.createElement(Col, { span: 18 }, /*#__PURE__*/
    React.createElement(Row, null, /*#__PURE__*/
    React.createElement(Col, { span: 8 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "one", onClick: props.handleDigitInput }, "1")), /*#__PURE__*/

    React.createElement(Col, { span: 8 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "two", onClick: props.handleDigitInput }, "2")), /*#__PURE__*/

    React.createElement(Col, { span: 8 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "three", onClick: props.handleDigitInput }, "3"))), /*#__PURE__*/


    React.createElement(Row, null, /*#__PURE__*/
    React.createElement(Col, { span: 16 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "zero", onClick: props.handleDigitInput }, "0")), /*#__PURE__*/

    React.createElement(Col, { span: 8 }, /*#__PURE__*/
    React.createElement(Button, { block: true, id: "decimal", onClick: props.handleDigitInput }, ".")))), /*#__PURE__*/



    React.createElement(Col, { span: 6 }, /*#__PURE__*/
    React.createElement(Button, { type: "primary", block: true, style: { height: "100%" }, id: "equals", onClick: props.handleResult }, "=")))));






};

const initState = {
  input: "0",
  output: '',
  result: '',
  prevOp: null };


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = initState;
    this.handleClear = this.handleClear.bind(this);
    this.handleDigitInput = this.handleDigitInput.bind(this);
    this.handleOperatorInput = this.handleOperatorInput.bind(this);
    this.handleResult = this.handleResult.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.parse = this.parse.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  handleClear() {
    this.setState(initState);
  }

  handleDigitInput(event) {
    let digit = event.currentTarget.children[0].textContent;
    this.setState((prevState, props) => {
      if (digit === '.') {
        if (prevState.input.includes('.'))
        return prevState;else

        return { input: prevState.input + digit, output: prevState.output + digit };
      } else
      if (prevState.input != '0')
      return { input: prevState.input + digit, output: prevState.output + digit };else

      return { input: digit, output: prevState.output + digit };
    });
  }

  handleOperatorInput(event) {
    const idToOperator = {
      "add": "+",
      "subtract": "-",
      "multiply": "*",
      "divide": "/" };

    const operator = idToOperator[event.currentTarget.id];

    this.setState((prevState, props) => {
      var output;

      const operators = Object.values(idToOperator);
      const prevInput = prevState.output[prevState.output.length - 1];
      const prevPrevInput = prevState.output[prevState.output.length - 2];

      if (operators.includes(prevInput)) {
        if (operator !== "-") {
          if (operators.includes(prevPrevInput))
          prevState.output = prevState.output.slice(0, prevState.output.length - 2);else

          prevState.output = prevState.output.slice(0, prevState.output.length - 1);
        } else if (prevInput === "-") {
          prevState.output = prevState.output.slice(0, prevState.output.length - 1);
        }
      }

      if (prevState.output === '')
      output = prevState.input + operator;else
      if (prevState.result !== '')
      output = prevState.result.toString() + operator;else

      output = prevState.output + operator;

      return {
        input: "",
        output: output,
        prevOp: operator };

    });
  }

  parse(str) {
    try {
      return Function(`'use strict'; return (${str})`)();
    }
    catch (err) {
      this.setState({ output: `err(${str})` });
    }
  }

  handleResult(e) {
    this.setState((prevState, props) => {
      if (prevState.prevOp) {
        const expr = prevState.output;
        const res = this.parse(expr);
        return {
          input: res,
          output: expr + "=" + res,
          result: res };

      } else

      return prevState;
    });
  }

  handleKeyPress(e) {
    const keyIds = {
      48: "zero",
      49: "one",
      50: "two",
      51: "three",
      52: "four",
      53: "five",
      54: "six",
      55: "seven",
      56: "eight",
      57: "nine",
      8: "clear",
      13: "equals",
      61: "equals",
      187: "equals",
      45: "subtract",
      189: "subtract",
      47: "divide",
      191: "divide",
      42: "multiply",
      43: "add",
      46: "decimal",
      190: "decimal" };


    let id = keyIds[e.keyCode];
    switch (e.keyCode) {
      case 56:
        id = e.shiftKey ? "multiply" : id;
        break;
      case 187:
        id = e.shiftKey ? "add" : id;
        break;}


    if (id) {
      const button = document.getElementById(id);
      button.click();
    }
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "calculator" }, /*#__PURE__*/
      React.createElement(Row, null, /*#__PURE__*/
      React.createElement(Col, { span: 24 }, /*#__PURE__*/
      React.createElement("div", { id: "screen" }, /*#__PURE__*/
      React.createElement("div", { id: "output" }, this.state.output), /*#__PURE__*/
      React.createElement("div", { id: "display" }, this.state.input)))), /*#__PURE__*/



      React.createElement(Numpad, { handleClear: this.handleClear,
        handleDigitInput: this.handleDigitInput,
        handleOperatorInput: this.handleOperatorInput,
        handleResult: this.handleResult })));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));