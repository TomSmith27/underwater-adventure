import { Player } from './Player';

export class Room {
  constructor(code: string) {
    this.code = code;
    this.players = [];
  }
  public code: string;
  public players: Player[];
  public round1: Round;
  public startGame() {
    this.round1 = new Round(this.players, generateRound1());
  }
  public startRound2() {}
}

function generateRound1() {
  let triangles = [];
  let squares = [];
  let pentagons = [];
  let hexagons = [];
  for (let i = 0; i < 4; i++) {
    triangles.push(new Tile(i, 'Triangle'));
    triangles.push(new Tile(i, 'Triangle'));
  }
  for (let i = 0; i < 4; i++) {
    squares.push(new Tile(i, 'Square'));
    squares.push(new Tile(i, 'Square'));
  }
  for (let i = 0; i < 4; i++) {
    pentagons.push(new Tile(i, 'Pentagon'));
    pentagons.push(new Tile(i, 'Pentagon'));
  }
  for (let i = 0; i < 4; i++) {
    hexagons.push(new Tile(i, 'Hexagon'));
    hexagons.push(new Tile(i, 'Hexagon'));
  }
  return [...shuffle(triangles), ...shuffle(squares), ...shuffle(pentagons), ...shuffle(hexagons)];

  //return [new Tile(0, 'Triangle'), new Tile(0, 'Triangle'), new Tile(1, 'Triangle'), new Tile(1, 'Triangle'), new Tile(2, 'Triangle'), new Tile(2, 'Triangle'), new Tile()];
}

function shuffle(array: any[]) {
  return array.sort(() => Math.random() - 0.5);
}

export class Round {
  constructor(players: Player[], tiles: Tile[]) {
    this.playersInRound = players.map((p) => ({
      player: p,
      goingUp: false,
      tiles: [],
      position: 0,
    }));
    this.tiles = tiles;
  }
  public air: number = 25;
  public currentPlayerIndex: number = 0;
  public playersInRound: PlayerRound[];
  public tiles: Tile[];
  public get currentPlayer() {
    return this.playersInRound[this.currentPlayerIndex];
  }
  public beginTurn() {
    this.air -= this.currentPlayer.tiles.length;
  }
  public move() {
    const moveSpaces = 3 - this.currentPlayer.tiles.length;

    this.currentPlayer.position = this.currentPlayer.goingUp ? -moveSpaces : moveSpaces;
  }
}

export class PlayerRound {
  public position: number;
  public player: Player;
  public tiles: Tile[];
  public goingUp: boolean;
}

export class Tile {
  constructor(value: number, type: TileType) {
    this.value = value;
    this.type = type;
  }
  public type: TileType;
  public value: number;
}

export type TileType = 'Triangle' | 'Square' | 'Pentagon' | 'Hexagon';
