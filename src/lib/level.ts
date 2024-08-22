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
        deleted: false,
    };

    this.levels[id] = level;
  }

  deleteLevel(id: number): Level[] {
    this.levels[id].deleted = true;
    return this.getLevels();
  }

  getLevel(id: number): Level {
    if (this.levels[id] !== undefined)
    {
        return this.levels[id];
    }
    throw new Error("No level for id " + id);
  }

  setLevel(id: number, properties: Partial<Level>): Level[]
  {
    Object.assign(this.levels[id], properties);
    return this.getLevels();
  }

  getLevels(): Level[]
  {
    let returnVal = Object.values(this.levels)
        .filter((level) => !level.deleted)
        .sort((a,b) => {
            return a.createdAtMillis - b.createdAtMillis;
        });
    return returnVal;
  }
}
export default LevelManager;
