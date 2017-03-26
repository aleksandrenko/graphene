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
      isPropertiesOpen: true,
      isSchemaOpen: false,
      isJavascriptOpen: false,
      selectedEntry: null
    };
  }

  componentDidMount() {
    const editor = codeMirror(document.querySelector('#side-panel-schema'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'yaml',
      lineWrapping: true,
      value: ''
    });

    const schema = codeMirror(document.querySelector('#side-panel-editor'), {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      value: `// selected node/edge schema`
    });

    DataManager.onChange(function(data) {
      const selectedEntry = DataManager.getSelectedEntity();
      this.setState({ selectedEntry });
    }.bind(this));
  }

  togglePanelProperties() {
    this.setState({ isPropertiesOpen: !this.state.isPropertiesOpen });
  }

  togglePanelSchema() {
    this.setState({ isSchemaOpen: !this.state.isSchemaOpen });
  }

  togglePanelJs() {
    this.setState({ isJavascriptOpen: !this.state.isJavascriptOpen });
  }

  render(props, state) {
    return <section id="side-panel" className={{ hasOpen: state.isPropertiesOpen || state.isSchemaOpen || state.isJavascriptOpen }}>
      <header className={{ open: state.isPropertiesOpen }} onClick={ this.togglePanelProperties.bind(this) }>Properties</header>
      <section id="side-panel-properties" className={{ open: state.isPropertiesOpen }}>
        <PropertiesManager entity={ state.selectedEntry } />
      </section>

      <header className={{ open: state.isSchemaOpen }} onClick={ this.togglePanelSchema.bind(this) }>Schema</header>
      <section id="side-panel-schema" className={{ open: state.isSchemaOpen }} />

      <header className={{ open: state.isJavascriptOpen }} onClick={ this.togglePanelJs.bind(this) }>Javascript</header>
      <section id="side-panel-editor" className={{ open: state.isJavascriptOpen }} />
    </section>;
  }
}

export default SidePanel;
