import { cloudstate } from "freestyle-sh";
import type { Turn } from "./game-tools";
import { validateClue } from "./game-tools";

@cloudstate
class Play {
    id = crypto.randomUUID();
    playerIds: [string, string];
    gameId: string;
    turns: Turn[];

    createdAtMillis: number;
    updatedAtMillis: number;

    constructor(playerIds: [string, string], gameId: string, numTurns: number) {
        this.playerIds = playerIds;
        this.gameId = gameId;

        this.turns = [];
        for (let i = 0; i < numTurns; i++)
        {
            this.turns.push({
                cluePlayerId: i % 2 == 0 ? playerIds[0] : playerIds[1],
                guessPlayerId: i % 2 == 0 ? playerIds[1] : playerIds[0],

                clue: null,
                guessAnswers: null,

                isComplete: false,
                isCorrect: null,
            })
        }

        this.createdAtMillis = (new Date()).getTime();
        this.updatedAtMillis = this.createdAtMillis;
    }

    getIsComplete(): boolean 
    {
        return this.turns.every((turn) => turn.isComplete);
    }

    getScore(): number 
    {
        return this.turns.reduce((sum, turn) => sum + (turn.isComplete && turn.isCorrect ? 1 : 0), 0);
    }

    saveClue(clue: string, turnIndex: number): string | 1
    {
        if (turnIndex > this.turns.length)
        {
            return "Error: Turn index out of range";
        }
        if (!validateClue(clue))
        {
            return "Error: Invalid clue";
        }
        
        // TODO validate that this player has rights to save this clue
        
    }

    saveGuess()
    {
      // TODO validate that this player has rights to save this guess

    }
}

@cloudstate
class PlayManager {
  static id = "play-manager";
  plays: {[id: string]: Play } = {};
  playerIdToPlayIds: {[playerId: string]: string[]} = {};

  saveGame(adminPassword: string, words: string[], rounds: Round[], exampleClues: String[]) {
    
  }

  getPlayerPlays(playerId: string): Play

  getPlay(id: number): Game {
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
