'use babel';

import TestListMakerView from './test-list-maker-view';
import { CompositeDisposable } from 'atom';

export default {

  testListMakerView: null,
  modalPanel: null,
  subscriptions: null,


  activate(state) {
    this.testListMakerView = new TestListMakerView(state.testListMakerViewState);
    this.modalPanel = atom.workspace.addRightPanel({
      item: this.testListMakerView.getElement(),
      visible: true
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'test-list-maker:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.testListMakerView.destroy();
  },

  serialize() {
    return {
      testListMakerViewState: this.testListMakerView.serialize()
    };
  },

  toggle() {
    console.log('TestListMaker was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
