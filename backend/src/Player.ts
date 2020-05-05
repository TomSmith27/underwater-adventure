export class Player {
  constructor(id: string, name: string, isAdmin: boolean) {
    this.id = id;
    this.name = name;
    this.isAdmin = isAdmin;
  }
  public id: string;
  public name: string;
  public isAdmin: boolean;
}
