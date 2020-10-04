import { hot } from 'react-hot-loader/root';
import React, { useRef } from 'react';
import { Route, Switch } from 'react-router-dom';

import Reader from '../Reader/Reader';
import { NotFound } from './404';

import './app.scss';

function App() {
  const vscode_api_ref = useRef(acquireVsCodeApi());

  return (
    <div styleName="app">
      <Switch>
        <Route path="/404">
          <NotFound />
        </Route>
        <Route path="/">
          <Reader vscode_api={vscode_api_ref.current} />
        </Route>
      </Switch>
    </div>
  );
}

export default hot(App);
