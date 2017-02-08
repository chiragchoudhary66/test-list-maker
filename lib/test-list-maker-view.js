'use babel';

import TreeViewMaker from 'js-treeview';

export default class TestListMakerView {

  constructor(serializedState) {
    // ROOT
    this.element = document.createElement('div');
    this.element.classList.add('test-list-maker');

    // HEADING
    const heading = document.createElement('div');
    heading.textContent = 'Test List';
    heading.classList.add('heading');

    // MAIN SECTION
    const listContainer = document.createElement('div');
    listContainer.classList.add('listContainer');
    listContainer.id = 'tree';

    this.element.appendChild(heading);
    this.element.appendChild(listContainer);
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  updateUI(result) {
    var tree = new TreeViewMaker(result, 'tree');
    tree.on('select', (e) => {
        atom.workspace.getActiveTextEditor().setCursorScreenPosition(e.data.position);
    });
  }

}
