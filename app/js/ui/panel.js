'use strict';
/** @jsx h */

import {h, render, Component} from 'preact';
import DataManager from '../DataManager';
import PropertiesManager from '../PropertiesManager';
import graphql from '../utils/graphql';

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
    const schema = codeMirror(document.querySelector('#side-panel-schema'), {
      lineNumbers: true,
      readOnly: true,
      undoDepth: 0,
      mode: 'yaml',
      lineWrapping: true,
      value: ''
    });

    const editor = codeMirror(document.querySelector('#side-panel-editor'), {
      lineNumbers: true,
      lineWrapping: true,
      mode: 'javascript',
      value: ''
    });

    DataManager.onChange(function (data, eventType) {
      const selectedEntry = DataManager.getSelectedEntity();

      if (eventType === 'select') {
        this.setState({ selectedEntry });

        if (selectedEntry.isNode) {
          const nodeJS = graphql.getNodeResolver(selectedEntry);
          const nodeSchema = graphql.getNodeSchema(selectedEntry);
          editor.setValue(nodeJS);
          schema.setValue(nodeSchema);
        }
      }

      if (eventType === 'update') {
        let jsToSet, schemaToSet;

        if (selectedEntry.isNode) {
          jsToSet = graphql.getNodeResolver(selectedEntry);
          schemaToSet = graphql.getNodeSchema(selectedEntry);
        }

        if (selectedEntry.isEdge) {
          jsToSet = graphql.getEdgeResolver(selectedEntry);
          schemaToSet = graphql.getEdgeSchema(selectedEntry);
        }

        editor.setValue(jsToSet);
        schema.setValue(schemaToSet);
      }

      if (eventType === 'deselect') {
        this.setState({ selectedEntry: null });
        editor.setValue('');
        schema.setValue('');
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
    return <section id="side-panel"
                    className={{ hasOpen: state.isPropertiesOpen || state.isSchemaOpen || state.isJavascriptOpen }}>
      <header className={{ open: state.isPropertiesOpen }} onClick={ this.togglePanelProperties.bind(this) }>
        Properties
      </header>
      <section id="side-panel-properties" className={{ open: state.isPropertiesOpen }}>
        <PropertiesManager entity={ state.selectedEntry } onEntityChange={ this.onEntityChange }/>
      </section>

      <header className={{ open: state.isSchemaOpen }} onClick={ this.togglePanelSchema.bind(this) }>Schema</header>
      <section id="side-panel-schema" className={{ open: state.isSchemaOpen }}/>

      <header className={{ open: state.isJavascriptOpen }} onClick={ this.togglePanelJs.bind(this) }>Javascript
      </header>
      <section id="side-panel-editor" className={{ open: state.isJavascriptOpen }}/>
    </section>;
  }
}

export default SidePanel;
