'use babel';

import TestListMakerView from './test-list-maker-view';
import Parser from './parser';
import { CompositeDisposable } from 'atom';

export default {

  testListMakerView: null,
  modalPanel: null,
  subscriptions: null,
  editor: null,
  parser: null,


  activate(state) {
    this.testListMakerView = new TestListMakerView(state.testListMakerViewState);
    this.parser = new Parser();
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

    this.watchFiles();
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

  watchFiles() {
    atom.workspace.onDidStopChangingActivePaneItem(() => {

        if (!atom.workspace.getActivePaneItem() || !atom.workspace.getActivePaneItem().buffer){
            return;
        }

        let file = atom.workspace.getActivePaneItem().buffer.file;
        let filename = file.getBaseName();
        let regex = /.spec\.js$/gm;

        if (regex.test(filename)) {
            this.editor = atom.workspace.getActiveTextEditor();
            let fileContent = this.editor.getText();
            this.activateWatcher(fileContent);
        }
    }, atom.workspace.getActivePaneItem());
  },

  activateWatcher(source) {
    var parseResult = this.parser.parse(source, this.editor);
    this.testListMakerView.updateUI(parseResult[0].name);

    atom.workspace.getActivePaneItem().onDidChange(() => {
       var parseResult = this.parser.parse(source, this.editor);
       this.testListMakerView.updateUI(parseResult[0].name);
    });

    //  parser.parse(); √
    //  updateUI(result); √
    //  check for content change √
    //  if changed => parser.parse(); √
    //  if changed => updateUI(result); √
    //  Need to stop watching for changes if file changes. [[[Global State Variable]]]
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
