import * as vscode from 'vscode';
import * as os from 'os';

const EXTRACT_CHAPTER_REGEXP = /^第([一二三四五零六七八九十百千万]+|\d+)[章回]|^番外/;

export class Chapter extends vscode.TreeItem {
  public range: vscode.Range; // position of title
  public title: string;

  // onclick
  command = {
    command: 'chapterTreeView.jumpTo',
    title: 'Jump To',
    arguments: [this]
  };
  // iconPath = new vscode.ThemeIcon('archive');
  private _editor: vscode.TextEditor;

  constructor(range: vscode.Range, title: string, editor: vscode.TextEditor) {
    super(title, vscode.TreeItemCollapsibleState.None);
    this.range = range;
    this.title = title;
    this._editor = editor;
  }

  get_content() {
    return this._editor.document.getText(this.range);
  }
}

/**
 * extract chapter data from given editor
 * @param editor editor contains text content for operation
 */
function extract_chapters(editor: vscode.TextEditor): Chapter[] {
  const full_text = editor.document.getText();
  const lines = full_text.split(os.EOL);

  // dummy data
  lines.push('第一章');

  let start = -1;
  let title = '';
  return lines.reduce((acc, line, idx) => {
    if (EXTRACT_CHAPTER_REGEXP.test(line)) {
      if (title !== '') {
        const start_pos = new vscode.Position(start, 0);
        const end_pos = new vscode.Position(idx, 0);
        acc.push(new Chapter(new vscode.Range(start_pos, end_pos), title, editor));
      }
      start = idx + 1;
      title = line.trim();
    }
    return acc;
  }, [] as Chapter[]);
}

export class ChaterDataProvider implements vscode.TreeDataProvider<Chapter> {
  onDidChangeTreeData: vscode.Event<Chapter | null>;

  private change_event: vscode.EventEmitter<Chapter | null> = new vscode.EventEmitter<Chapter | null>();
  private view_cache: Map<vscode.Uri, Chapter[]>;

  constructor(view_cache: Map<vscode.Uri, Chapter[]>) {
    this.onDidChangeTreeData = this.change_event.event;
    this.view_cache = view_cache;
  }

  getChildren(elem: Chapter): Thenable<Chapter[]> {
    const editor = vscode.window.activeTextEditor;
    if (elem || !editor) {
      return Promise.resolve([]);
    }

    const cache = this.view_cache;
    const uri = editor.document.uri;
    if (cache.has(uri)) {
      return Promise.resolve(cache.get(uri)!);
    }

    // re-calculate
    const items = extract_chapters(editor);
    cache.set(uri, items);
    return Promise.resolve(items);
  }

  getTreeItem(elem: Chapter): vscode.TreeItem {
    return elem;
  }

  invalidate_cache() {
    const cache = this.view_cache;
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const uri = editor.document.uri;
      cache.delete(uri);
    }
  }

  build_tree() {
    // construct the view tree if needed
    this.change_event.fire(null);
  }

  jump_to(chapter: Chapter) {
    const editor = vscode.window.activeTextEditor;
    editor?.revealRange(chapter.range, vscode.TextEditorRevealType.AtTop);
  }
}
