import type { Round, Level, Levels } from "./game"
import { cloudstate } from "freestyle-sh";

@cloudstate
class LevelManager {
  static id = "level-manager";
  levels: Levels = {};
  numLevels = 0;

  saveLevel(words: string[], rounds: Round[], exampleClues: String[]) {
    let id = ++this.numLevels;
    while (this.levels[id] !== undefined)
    {
        id ++;
    }

    const level = {
        id,
        active: false,
        words,
        rounds,
        exampleClues,
        createdAtMillis: (new Date()).getTime(),
    };

    this.levels[id] = level;
  }

  getLevel(id: number): Level {
    return this.levels[id];
  }

  getLevels() {
    return this.levels;
  }
}
export default LevelManager;
