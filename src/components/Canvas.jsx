import React from 'react';

export default class CanvasComponent extends React.Component {
  componentDidMount() {
    const ctx = this.refs.canvas.getContext('2d');
    this.props.onMount(ctx);
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <canvas ref="canvas" width={this.props.width} height={this.props.height}/>
    );
  }
}
