const { Button } = Reactstrap;

class Quote extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.quote === null)
    return /*#__PURE__*/React.createElement("div", null);

    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("blockquote", { className: "blockquote mb-0" }, /*#__PURE__*/
      React.createElement("p", { id: "text" },
      ' ', this.props.quote.quote), /*#__PURE__*/

      React.createElement("p", { id: "author", className: "blockquote-footer" },
      this.props.quote.author))));




  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quoteIdx: 0,
      quotes: [] };

  }

  componentDidMount() {
    fetch("https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json").
    then(res => res.json()).
    then(json => {
      this.setState({ quotes: json["quotes"] });
    });
  }

  updateCount() {
    this.setState((prevState, props) => {
      return { quoteIdx: (prevState.quoteIdx + 1) % prevState.quotes.length };
    });
  }

  tweetQuote(text) {
    console.log(text);
  }

  render() {
    let quote = this.state.quotes.length === 0 ? null : this.state.quotes[this.state.quoteIdx];
    let tweetUrl = "https://twitter.com/intent/tweet?&text=" + (quote ? encodeURIComponent('"' + quote.quote + '" ' + quote.author) : null);

    return /*#__PURE__*/(
      React.createElement("div", { id: "quote-box" }, /*#__PURE__*/
      React.createElement(Quote, { quote: quote }), /*#__PURE__*/
      React.createElement("a", { className: "button", title: "Tweet this quote", id: "tweet-quote", target: "_top", href: tweetUrl }, /*#__PURE__*/React.createElement("i", { className: "fa fa-twitter" })), /*#__PURE__*/
      React.createElement("button", { title: "Next quote", className: "button", id: "new-quote", onClick: () => this.updateCount() }, /*#__PURE__*/
      React.createElement("i", { className: "fa fa-chevron-right" }))));



  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("app"));