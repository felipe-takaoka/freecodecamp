import * as reactRnd from "https://cdn.skypack.dev/react-rnd@10.3.7";
const Rnd = reactRnd.Rnd;
const { Form, FormGroup, Label, Input, Col, Row, Button, Container } = Reactstrap;

marked.setOptions({
  breaks: true });


const renderer = new marked.Renderer();
const editorPlaceholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.icon-icons.com/icons2/2389/PNG/512/freecodecamp_logo_icon_145267.png)
`;

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorInitialHeight: 100 };


    this.resizeEditor = this.resizeEditor.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    this.resizeEditor(this.state.editorInitialHeight);
    let window = document.getElementById("editor-window");
    this.setState({
      windowInitialHeight: window.offsetHeight });

  }

  resizeEditor(height) {
    let editor = document.getElementById('editor');
    editor.style.height = `${height}px`;
    this.setState({
      editorHeight: height });

  }

  handleResize(e, direction, ref, delta, position) {
    let deltaFromInit = ref.offsetHeight - this.state.windowInitialHeight;
    this.resizeEditor(this.state.editorInitialHeight + deltaFromInit);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement(Rnd, { id: "editor-window",
        default: { x: 100, y: 100, width: 500 },
        minHeight: "150px",
        minWidth: "300px",
        onResize: this.handleResize }, /*#__PURE__*/
      React.createElement("div", { className: "window-header" }, "Editor"), /*#__PURE__*/
      React.createElement(Container, { className: "window-body" }, /*#__PURE__*/
      React.createElement("div", { className: "d-flex justify-content-center" }, /*#__PURE__*/
      React.createElement("button", { onClick: this.props.togglePreview, size: "sm", className: "button" },
      this.props.previewVisible ? "Hide Preview" : "Show Preview")), /*#__PURE__*/


      React.createElement(Row, null, /*#__PURE__*/
      React.createElement(Form, null, /*#__PURE__*/
      React.createElement(FormGroup, { row: true }, /*#__PURE__*/
      React.createElement(Col, null, /*#__PURE__*/
      React.createElement(Input, {
        type: "textarea",
        id: "editor",
        rows: "5",
        value: this.props.text,
        onChange: this.props.onKeyUp }))))))));







  }}


class Preview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement(Rnd, {
        id: "preview-window",
        default: { x: 900, y: 100, width: 500, height: 200 },
        minHeight: "150px",
        minWidth: "300px",
        enableResizing: { bottomRight: true },
        resizeHandleClasses: ['bottomRight'] }, /*#__PURE__*/
      React.createElement("div", { className: "window-header" }, "Preview"), /*#__PURE__*/
      React.createElement(Container, { className: "window-body" }, /*#__PURE__*/
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", {
        id: "preview",
        dangerouslySetInnerHTML: {
          __html: marked(this.props.text, { renderer: renderer }) } })))));






  }}


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: editorPlaceholder,
      previewVisible: true };


    this.updateText = this.updateText.bind(this);
    this.togglePreview = this.togglePreview.bind(this);
  }

  updateText(event) {
    this.setState({ text: event.target.value });
  }

  togglePreview() {
    this.setState((prevState, props) => ({
      previewVisible: !prevState.previewVisible }));

  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement(Editor, { text: this.state.text, onKeyUp: this.updateText, togglePreview: this.togglePreview, previewVisible: this.state.previewVisible }),
      this.state.previewVisible ? /*#__PURE__*/React.createElement(Preview, { text: this.state.text }) : null));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));