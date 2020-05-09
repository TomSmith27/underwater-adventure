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
  public roll() {
    this.round1.move();
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
    squares.push(new Tile(i + 4, 'Square'));
    squares.push(new Tile(i + 4, 'Square'));
  }
  for (let i = 0; i < 4; i++) {
    pentagons.push(new Tile(i + 8, 'Pentagon'));
    pentagons.push(new Tile(i + 8, 'Pentagon'));
  }
  for (let i = 0; i < 4; i++) {
    hexagons.push(new Tile(i + 12, 'Hexagon'));
    hexagons.push(new Tile(i + 12, 'Hexagon'));
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
  public tiles: Tile[] = [];
  public get currentPlayer() {
    return this.playersInRound[this.currentPlayerIndex];
  }
  public beginTurn() {
    this.air -= this.currentPlayer.tiles.length;
  }
  private roll() {
    return (Math.random() * (3 - 0 + 1)) << 0;
  }
  public move() {
    const roll = this.roll() + this.roll();
    console.log('Tim rolled a ', roll);
    const moveSpaces = Math.max(roll - this.currentPlayer.tiles.length, 0);
    console.log(`${this.currentPlayer.player.name} but had ${this.currentPlayer.tiles.length} so ended up with a  ${moveSpaces}`);
    this.currentPlayer.position = this.currentPlayer.position + (this.currentPlayer.goingUp ? -moveSpaces : moveSpaces);
    this.takeTile();

    this.currentPlayerIndex++;
    if (this.currentPlayerIndex >= this.playersInRound.length) {
      this.currentPlayerIndex = 0;
    }
    this.beginTurn();
  }
  public takeTile() {
    if (this.tiles[this.currentPlayer.position].type != 'Blank') {
      this.currentPlayer.tiles.push(...this.tiles.splice(this.currentPlayer.position, 1, ...[new Tile(0, 'Blank')]));
    }
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

export type TileType = 'Triangle' | 'Square' | 'Pentagon' | 'Hexagon' | 'Blank';
