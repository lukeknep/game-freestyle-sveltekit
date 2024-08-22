import type { Round, Game } from "./game-tools"
import { cloudstate } from "freestyle-sh";

@cloudstate
class GameManager {
  static id = "game-manager";
  games: {[id: string]: Game } = {};
  numGames = 0;

  saveGame(words: string[], rounds: Round[], exampleClues: String[]) {
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

  deleteGame(id: number): Game[] {
    this.games[id].deleted = true;
    return this.getGames();
  }

  getGame(id: number): Game {
    if (this.games[id] !== undefined)
    {
        return this.games[id];
    }
    throw new Error("No game for id " + id);
  }

  setGame(id: number, properties: Partial<Game>): Game[]
  {
    Object.assign(this.games[id], properties);
    return this.getGames();
  }

  getGames(): Game[]
  {
    let returnVal = Object.values(this.games)
        .filter((game) => !game.deleted)
        .sort((a,b) => {
            return a.createdAtMillis - b.createdAtMillis;
        });
    return returnVal;
  }
}
export default GameManager;
