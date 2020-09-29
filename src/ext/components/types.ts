import * as vscode from 'vscode';
import { Chapter } from './Chapter';

export interface IChapterTree<T> extends vscode.TreeDataProvider<T> {
  get_current_state(): [Chapter | null, number];
  get_next_state(index: number): [Chapter | null, number];
}

export interface INovelWebview {
  /**
   *
   * @param chapter current chapter object
   * @param total total chapters
   */
  receive_chapter(chapter: Chapter, total: number): void;
}
