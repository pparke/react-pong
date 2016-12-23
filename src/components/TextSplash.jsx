import React from 'react';
import { List } from 'immutable';

export default function TextSplash(props) {
  let classNames = ['text-splash'].concat(props.message.get('classNames', List()).toJS());
  const text = props.message.get('text');
  if (!text) {
    classNames.push('hidden');
  }
  classNames = classNames.join(' ');

  const animationComplete = props.message.get('animationComplete', () => {});

  return (
    <h1 className={ classNames } onAnimationEnd={ animationComplete }>{ text }</h1>
  );
}
