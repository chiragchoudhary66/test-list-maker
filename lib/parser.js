'use babel';

export default class Parser {

  source: null
  editor: null

  parse(source, editor) {
    this.source = source;
    this.editor = editor;
    return this.scan();
  }

  scan() {
    let result = [], count = 0;

    // Find 'describes', set indexs, find 'it'
    this.findInstanceOf('describe(\'', result, 0, this.source.length);
    this.getEndIndex(result);
    result.map((obj) => obj.children = []);
    result.map((obj) => this.findInstanceOf('it(\'', obj.children, obj.index, obj.endIndex));

    return result;
  }

  findInstanceOf(word, result, startIndex, endIndex) {
    let index = startIndex, name;
    let wordLength = word.length;

    while (index != -1 && index < endIndex) {
      index++;
      index = this.source.indexOf(word, index);
      if (index == -1 || index > endIndex) break;
      name = this.source.substring(index + wordLength, this.source.indexOf('\'', index + wordLength + 1));
      console.log(name, 'Position: ', this.editor.buffer.positionForCharacterIndex(index));
      result.push({index, name});
    }
  }

  getEndIndex(arr){
    arr.map((obj, index, arr) => {
      if (arr[index + 1]) {
        obj.endIndex = arr[index + 1]['index'];
      }
      else {
        obj.endIndex = this.source.length;
      }
    });
  }
}
