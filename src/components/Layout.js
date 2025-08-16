import React, { Component } from 'react';
import './_settings/_base.scss';
import './Layout.scss';

export class Layout extends Component {
  static displayName = Layout.name;

  render() {
    return (
      <div>
        <main className="container main">
          {this.props.children}
        </main>
      </div>
    );
  }
}
