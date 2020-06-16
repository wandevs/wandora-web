import React from 'react';

export function rootContainer(container) {
  const reduxContainer = require('./redux/index.js').default;
  return React.createElement(reduxContainer, null, container);
}