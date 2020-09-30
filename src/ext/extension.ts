import * as vscode from 'vscode';

import { ChaterDataProvider, has_novel_content } from './components/tree';
import { Chapter } from './components/Chapter';
import webview from './components/webview';
import WebviewToTreeBride from './components/bridge';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  const view_cache = new Map<vscode.Uri, Chapter[]>(); // store the calculated chapter list
  const bridge = new WebviewToTreeBride();
  const chapter_tree = new ChaterDataProvider(view_cache, bridge);

  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const novel_flag = has_novel_content(editor);
    vscode.commands.executeCommand('setContext', 'novel-reader:hasNovelContent', novel_flag);
  }

  [
    // commands
    vscode.window.registerTreeDataProvider('chapterTreeView', chapter_tree),
    vscode.commands.registerCommand('chapterTreeView.jumpTo', (chapter: Chapter) => {
      chapter_tree.jump_to(chapter);
    }),
    vscode.commands.registerCommand('chapterTreeView.refresh', () => {
      chapter_tree.reset();
      chapter_tree.build_tree();
    }),
    vscode.commands.registerCommand('chapterTreeView.webview', () => {
      webview(context, bridge);
    }),
    // events
    vscode.window.onDidChangeActiveTextEditor(() => {
      const new_editor = vscode.window.activeTextEditor;
      if (new_editor) {
        const novel_flag = has_novel_content(new_editor);
        vscode.commands.executeCommand('setContext', 'novel-reader:hasNovelContent', novel_flag);
        if (novel_flag) {
          chapter_tree.build_tree();
        }
      }
    })
  ].forEach((disposable) => {
    context.subscriptions.push(disposable);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
