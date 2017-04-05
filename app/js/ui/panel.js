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

    const exampleObjectsHandlersAndResolvers = `
class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}
  
getMessage: function ({id}) {
  if (!fakeDatabase[id]) {
    throw new Error('no message exists with id ' + id);
  }
  return new Message(id, fakeDatabase[id]);
},
createMessage: function ({input}) {
  // Create a random id for our "database".
  var id = require('crypto').randomBytes(10).toString('hex');

  fakeDatabase[id] = input;
  return new Message(id, input);
},
updateMessage: function ({id, input}) {
  if (!fakeDatabase[id]) {
    throw new Error('no message exists with id ' + id);
  }
  // This replaces all old data, but some apps might want partial update.
  fakeDatabase[id] = input;
  return new Message(id, input);
}
    `;

    const schema = codeMirror(document.querySelector('#side-panel-editor'), {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      value: exampleObjectsHandlersAndResolvers
    });

    DataManager.onChange(function(data, eventType) {
      if (eventType === 'select') {
        const selectedEntry = DataManager.getSelectedEntity();
        this.setState({ selectedEntry });
      }

      if (eventType === 'deselect') {
        this.setState({ selectedEntry: null });
      }

      if (eventType === 'dblclick') {
        const selectedEntry = DataManager.getSelectedEntity();
        this.setState({ selectedEntry, isPropertiesOpen: true });
      }
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

  onEntityChange(entity) {
    if (!entity) {
      return false;
    }

    if (entity.isNode) {
      DataManager.updateNode(entity);
    }

    if (entity.isEdge) {
      DataManager.updateEdge(entity);
    }
  }

  render(props, state) {
    return <section id="side-panel" className={{ hasOpen: state.isPropertiesOpen || state.isSchemaOpen || state.isJavascriptOpen }}>
      <header className={{ open: state.isPropertiesOpen }} onClick={ this.togglePanelProperties.bind(this) }>Properties</header>
      <section id="side-panel-properties" className={{ open: state.isPropertiesOpen }}>
        <PropertiesManager entity={ state.selectedEntry } onEntityChange={ this.onEntityChange } />
      </section>

      <header className={{ open: state.isSchemaOpen }} onClick={ this.togglePanelSchema.bind(this) }>Schema</header>
      <section id="side-panel-schema" className={{ open: state.isSchemaOpen }} />

      <header className={{ open: state.isJavascriptOpen }} onClick={ this.togglePanelJs.bind(this) }>Javascript</header>
      <section id="side-panel-editor" className={{ open: state.isJavascriptOpen }} />
    </section>;
  }
}

export default SidePanel;
