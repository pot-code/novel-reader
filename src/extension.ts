import * as vscode from 'vscode';

import { ChaterDataProvider, Chapter } from './tree';
import webview from './webview';

// this method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  console.log('"novel-reader" is now active!');

  const view_cache = new Map<vscode.Uri, Chapter[]>(); // store the calculated chapter list
  const chapter_tree = new ChaterDataProvider(view_cache);

  [
    // commands
    vscode.window.registerTreeDataProvider('chapterTreeView', chapter_tree),
    vscode.commands.registerCommand('chapterTreeView.jumpTo', (chapter) => {
      chapter_tree.jump_to(chapter);
    }),
    vscode.commands.registerCommand('chapterTreeView.refresh', () => {
      chapter_tree.invalidate_cache();
      chapter_tree.build_tree();
    }),
    vscode.commands.registerCommand('chapterTreeView.webview', () => {
      webview(context);
    }),

    // events
    vscode.window.onDidChangeActiveTextEditor(() => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        chapter_tree.build_tree();
      }
    }),
  ].forEach((disposable) => {
    context.subscriptions.push(disposable);
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
