'use strict';
/** @jsx h */

import { h, Component } from 'preact';

class SidePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render(props, state) {
    return <section id="side-panel" className="side-panel">
      <section id="side-panel-properties">
        Properties
      </section>
      <section id="side-panel-editor">
        JS Editor
      </section>
      <section id="side-panel-schema">
        GraphQL Schema
      </section>
    </section>;
  }
}

export default SidePanel;
