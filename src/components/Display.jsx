import React from 'react';
import Score from './Score';
import TextSplash from './TextSplash';
import Canvas from './Canvas';
import ScreenControls from './ScreenControls';
import { connect } from 'react-redux';

export class Display extends React.PureComponent {
  constructor (props) {
    super(props);

    this.renderScore = this.renderScore.bind(this);
  }

  /**
   * Call create canvas once the component has mounted and
   * begin loading assets and then start the render loop
   */
  componentDidMount() {
    //this.props.didMount();
  }

  componentWillUnmount() {
    //this.props.willUnmount();
  }

  renderScore(score) {
    const name = score.get('name');
    const value = score.get('value');
    return <Score key={ name } value={ value } />
  }

  render() {
    return (
      <div id="display" className="display" style={ {width: this.props.width} } ref="display">
        <div className="score-header">
          { this.props.scores.map(this.renderScore) }
        </div>
        <ScreenControls controls={ this.props.controls } />
        <Canvas width={this.props.width} height={this.props.height} onMount={this.props.canvasDidMount} />
        <TextSplash message={ this.props.message } />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    message: state.get('message'),
    scores: state.get('scores'),
    controls: state.get('controls')
  }
}

export const DisplayContainer = connect(mapStateToProps)(Display);
