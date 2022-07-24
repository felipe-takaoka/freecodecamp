const { Button, Divider, Row, Col } = window.antd;
const PLAY = 'PLAY';
const STOP_PULSE = 'STOP_PULSE';

const audioClips = [
{
  keyCode: 81,
  keyTrigger: 'Q',
  id: 'Heater-1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3' },

{
  keyCode: 87,
  keyTrigger: 'W',
  id: 'Heater-2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3' },

{
  keyCode: 69,
  keyTrigger: 'E',
  id: 'Heater-3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3' },

{
  keyCode: 65,
  keyTrigger: 'A',
  id: 'Heater-4',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3' },

{
  keyCode: 83,
  keyTrigger: 'S',
  id: 'Clap',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3' },

{
  keyCode: 68,
  keyTrigger: 'D',
  id: 'Open-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3' },

{
  keyCode: 90,
  keyTrigger: 'Z',
  id: "Kick-n'-Hat",
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3' },

{
  keyCode: 88,
  keyTrigger: 'X',
  id: 'Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3' },

{
  keyCode: 67,
  keyTrigger: 'C',
  id: 'Closed-HH',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3' }];



const playClip = clip => {
  return {
    type: PLAY,
    clip: clip };

};

const stopPulse = () => ({
  type: STOP_PULSE });


const reducer = (state = { clip: null, pulse: false }, action) => {
  switch (action.type) {
    case PLAY:
      return { ...state, clip: action.clip, pulse: true };
    case STOP_PULSE:
      return { ...state, pulse: false };
    default:
      return state;}

};

class DrumPadElement extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlay = this.handlePlay.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress(e) {
    if (e.keyCode === this.props.audioClip.keyCode)
    this.handlePlay();
  }

  handlePlay() {
    this.props.stopPulse();
    const sound = document.getElementById(this.props.audioClip.keyTrigger);
    sound.currentTime = 0;
    sound.play();
    this.props.playClip(this.props.audioClip);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("button", { className: "drum-pad",
        type: "primary",
        onClick: this.handlePlay,
        id: this.props.audioClip.id }, /*#__PURE__*/
      React.createElement("audio", { className: "clip",
        id: this.props.audioClip.keyTrigger,
        src: this.props.audioClip.url }),
      this.props.audioClip.keyTrigger));


  }}


const DrumPad = props => {
  const audioClips = props.audioClips;
  const audioClipsPerRow = 3;
  const rowOfIndex = idx => Math.floor(idx / audioClipsPerRow);
  const drumPad = Array(rowOfIndex(audioClips.length));

  props.audioClips.forEach((audioClip, idx) => {
    row = drumPad[rowOfIndex(idx)];
    if (row) {
      row.push(audioClip);
    } else {
      drumPad[rowOfIndex(idx)] = [audioClip];
    }
  });

  return drumPad.map((row, idx) => /*#__PURE__*/
  React.createElement(Row, { key: `drum-pad-row-${idx}` },
  row.map((audioClip) => /*#__PURE__*/
  React.createElement(DrumPadElement, {
    key: audioClip.id,
    audioClip: audioClip,
    playClip: props.playClip,
    stopPulse: props.stopPulse }))));



};

class Presentational extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { clip, pulse } = this.props;

    return /*#__PURE__*/(
      React.createElement("div", { id: "drum-machine",
        className: pulse ? "pulse" : "",
        onAnimationEnd: this.props.stopPulse }, /*#__PURE__*/
      React.createElement("div", { id: "display" },
      clip ? clip.id : null), /*#__PURE__*/

      React.createElement(Divider, { style: { marginTop: "10px", marginBottom: "10px" } }), /*#__PURE__*/
      React.createElement(DrumPad, {
        audioClips: audioClips,
        playClip: this.props.playClip,
        stopPulse: this.props.stopPulse })));


  }}


const mapStateToProps = state => {
  return {
    clip: state.clip,
    pulse: state.pulse };

};

const mapDispatchToProps = dispatch => {
  return {
    playClip: clip => {dispatch(playClip(clip));},
    stopPulse: () => {dispatch(stopPulse());} };

};

const connect = ReactRedux.connect;
const Container = connect(mapStateToProps, mapDispatchToProps)(Presentational);
const store = Redux.createStore(reducer);
const Provider = ReactRedux.Provider;

class AppWrapper extends React.Component {
  render() {
    return /*#__PURE__*/(
      React.createElement(Provider, { store: store }, /*#__PURE__*/
      React.createElement(Container, null)));


  }}
;

ReactDOM.render( /*#__PURE__*/React.createElement(AppWrapper, null), document.getElementById("app"));