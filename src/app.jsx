import sass from './app.scss' //
import css from './app.css' //默认情况下，webpack 处理不了 CSS 的东西,需要引入css-loader和style-loader 插件

import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
ReactDOM.render(
  <Root></Root>,
  document.getElementById('root')
);