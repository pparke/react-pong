import React from 'react';

export default class ScreenControls extends React.PureComponent {

  renderControl(control) {
    const text = control.get('text');
    const action = control.get('action');
    return <button key={ text } onClick={ action }>{ text }</button>;
  }

  render() {
    return (
      <div className="menu">
        { this.props.controls.map(this.renderControl) }
      </div>
    );
  }
}
