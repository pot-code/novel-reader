import * as vscode from 'vscode';

export class Chapter extends vscode.TreeItem {
  public readonly range: vscode.Range; // position of title
  public readonly title: string;
  public readonly index: number; // zero based

  // onclick
  command = {
    command: 'chapterTreeView.jumpTo',
    title: 'Jump To',
    arguments: [this]
  };
  // iconPath = new vscode.ThemeIcon('archive');
  private _editor: vscode.TextEditor; // the context editor

  constructor(range: vscode.Range, title: string, index: number, editor: vscode.TextEditor) {
    super(title, vscode.TreeItemCollapsibleState.None);
    this.range = range;
    this.title = title;
    this._editor = editor;
    this.index = index;
  }

  get_content() {
    return this._editor.document.getText(this.range);
  }
}
