import type { Round, Game } from "./game-tools"
import { cloudstate } from "freestyle-sh";

@cloudstate
class GameManager {
  static id = "game-manager";
  games: {[id: string]: Game } = {};
  numGames = 0;

  saveGame(adminPassword: string, words: string[], rounds: Round[], exampleClues: String[]) {
    let id = ++this.numGames;
    while (this.games[id] !== undefined)
    {
        id ++;
    }

    const game = {
        id,
        active: false,
        words,
        rounds,
        exampleClues,
        createdAtMillis: (new Date()).getTime(),
        deleted: false,
    };

    this.games[id] = game;
  }

  deleteGame(adminPassword: string, id: number): Game[] {
    this.games[id].deleted = true;
    return this.getGames(adminPassword);
  }

  getGame(id: number): Game {
    if (this.games[id] !== undefined)
    {
      if (this.games[id].active)
      {
        return this.games[id];
      }
      
    }
    throw new Error("No game for id " + id);
  }

  setGame(adminPassword: string, id: number, properties: Partial<Game>): Game[]
  {
    Object.assign(this.games[id], properties);
    return this.getGames(adminPassword);
  }

  getGames(adminPassword: string): Game[]
  {
    if (adminPassword != "abcxyz")
    {
      console.log("Wrong admin password: " + adminPassword);
      return {
        error: "Wrong admin password",
      } as any;
    }

    let returnVal = Object.values(this.games)
        .filter((game) => !game.deleted)
        .sort((a,b) => {
            return a.createdAtMillis - b.createdAtMillis;
        });
    return returnVal;
  }
}
export default GameManager;
