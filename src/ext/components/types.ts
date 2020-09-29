import * as vscode from 'vscode';
import { Chapter } from './Chapter';

export interface IChapterTree<T> extends vscode.TreeDataProvider<T> {
  push_current_state(): void;
  push_next_state(index: number): void;
}

export interface INovelWebview {
  /**
   *
   * @param chapter current chapter object
   * @param total total chapters
   */
  receive_chapter(chapter: Chapter, total: number): void;
}
