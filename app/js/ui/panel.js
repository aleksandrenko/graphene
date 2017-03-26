'use strict';
/** @jsx h */

import { h, render, Component } from 'preact';
import DataManager from '../DataManager';
import PropertiesManager from '../PropertiesManager';

import codeMirror from 'codemirror';

class SidePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  componentDidMount() {
    const editor = codeMirror(document.querySelector('#side-panel-editor'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'yaml',
      lineWrapping: true,
      value: ''
    });

    const schema = codeMirror(document.querySelector('#side-panel-schema'), {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      value: `// selected node/edge schema`
    });

    DataManager.onChange((data) => {
      const selectedEntry = DataManager.getSelectedEntity();
      const propstElement = document.querySelector('#side-panel-properties');

      propstElement.innerHTML = '';

      render(<PropertiesManager entity={selectedEntry} />, propstElement);
    });
  }

  render(props, state) {
    return <section id="side-panel" className="side-panel">
      <section id="side-panel-properties">
        Properties
      </section>
      <section id="side-panel-editor" />
      <section id="side-panel-schema" />
    </section>;
  }
}

export default SidePanel;
