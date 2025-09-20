/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import "ojs/ojknockout";
import * as ko from "knockout";
import * as AccUtils from "../accUtils";
import { Computed, Observable, ObservableArray, Subscription } from 'knockout';
import "player-info/loader";

const WINNING_COMBINATIONS = [
  [
    { row: 0, column: 0 },
    { row: 0, column: 1 },
    { row: 0, column: 2 },
  ],
  [
    { row: 1, column: 0 },
    { row: 1, column: 1 },
    { row: 1, column: 2 },
  ],
  [
    { row: 2, column: 0 },
    { row: 2, column: 1 },
    { row: 2, column: 2 },
  ],
  [
    { row: 0, column: 0 },
    { row: 1, column: 0 },
    { row: 2, column: 0 },
  ],
  [
    { row: 0, column: 1 },
    { row: 1, column: 1 },
    { row: 2, column: 1 },
  ],
  [
    { row: 0, column: 2 },
    { row: 1, column: 2 },
    { row: 2, column: 2 },
  ],
  [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ],
  [
    { row: 0, column: 2 },
    { row: 1, column: 1 },
    { row: 2, column: 0 },
  ],
];

interface gameTurn {
  square: {row: number, col: number},
  player: 'X' | 'O';
}

class TicTacToeViewModel {
  public playerX: Observable<string> = ko.observable('Player X');
  public playerO: Observable<string> = ko.observable('Player O');
  public scoreX: Observable<number> = ko.observable(0);
  public scoreO: Observable<number> = ko.observable(0);
  public activePlayer: Observable = ko.observable('X');
  public gameOver: Observable = ko.observable(false);
  public isdraw: Observable = ko.observable(false);
  public winnerName: Observable<string> = ko.observable('');

  public gameBoard: ObservableArray =ko.observableArray();
  public gameTurns: ObservableArray<gameTurn> = ko.observableArray();

  public nameChangeAction = (event: any) => this.changeName(event);

  public readonly INITIAL_GAME_BOARD: ('X' | 'O' | null)[][] = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
  ];

  constructor() {
    this.initGameBoard();
  }

  public initGameBoard(): void {
    let newGameBoard = [...this.INITIAL_GAME_BOARD.map(innerArray => [...innerArray])];
    this.gameBoard(newGameBoard);
  }

  public selectTile(rowIndex: number, colIndex: number): void {
    // console.log(rowIndex, colIndex);
    this.setGameTurns(rowIndex, colIndex);
    this.markGameBoard(rowIndex, colIndex);
    this.checkWinner();
    this.updateActivePlayer();
  }

  public changeName(event: any): void {
    const {symbol, name} = event.detail;
    if(symbol === 'X') {
      this.playerX(name);
    } else {
      this.playerO(name);
    }
  }

  public setGameTurns(rowIndex: number, colIndex: number): void {
    // console.log(rowIndex, colIndex, this.activePlayer());
    const updatedTurns: gameTurn[] = [
      { square: { row:rowIndex, col: colIndex }, player: this.activePlayer() },
      ...this.gameTurns()
    ];
    this.gameTurns(updatedTurns);
  }

  public markGameBoard(rowIndex: number, colIndex: number): void {
    let updatedBoard = this.gameBoard();
    updatedBoard[rowIndex][colIndex] = this.activePlayer();
    this.gameBoard(updatedBoard);
  }

  public updateActivePlayer(): void {
    if (this.activePlayer() === 'X') {
      this.activePlayer('O');
    } else {
      this.activePlayer('X');
    }
  }

  public checkWinner() {
    let winner = null;
    for (const combination of WINNING_COMBINATIONS) {
      const firstSquareSymbol = this.gameBoard()[combination[0].row][combination[0].column];
      const secondSquareSymbol = this.gameBoard()[combination[1].row][combination[1].column];
      const thirdSquareSymbol = this.gameBoard()[combination[2].row][combination[2].column];

      if (firstSquareSymbol &&
        firstSquareSymbol === secondSquareSymbol &&
        firstSquareSymbol === thirdSquareSymbol
      ) {
        winner = firstSquareSymbol;
        if(winner === 'X') {
          this.winnerName(this.playerX());
          this.scoreX(this.scoreX() + 1);
        } else {
          this.winnerName(this.playerO());
          this.scoreO(this.scoreO() + 1);
        }
        this.gameOver(true);
      }
    }
    const isDraw = this.gameTurns().length === 9 && !winner;
    if (isDraw) {
      this.isdraw(true);
      this.gameOver(true);
    }
  }

  public restart = () => {
    this.gameTurns([]);
    this.initGameBoard();
    this.winnerName('');
    this.isdraw(false);
    this.gameOver(false);
  }

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Tic Tac Toe page loaded.");
    document.title = "Tic Tac Toe";
    // implement further logic if needed
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }
}

export = TicTacToeViewModel;
