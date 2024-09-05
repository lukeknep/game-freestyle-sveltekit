import type { Round, Game } from "./game-tools"
import { validateClue } from "./game-tools"

import { cloudstate } from "freestyle-sh";

interface ResultOfCreate {
  success: boolean,
  createdId: string, // use empty string if error, but leave as required to prevent forgetting to set it when successful
  errorMessage?: string,
}

@cloudstate
export class DataManager {
  static id = "DataManager";
  games: {[id: string]: Game } = {};
  numGames = 0;

  plays: {[id: string]: Play } = {};
  playerIdGameIdToPlayIds: {[playerId: string]: {[gameId: string]: string}} = {};

  getAllPlayerPlays(playerId: string): Play[]
  {
    return Object.values(this.playerIdGameIdToPlayIds[playerId]).map((playId) => this.plays[playId]);
  }

  getPlayerPlaysForGames(playerId: string, games: Game[]): (Play | null)[]
  {
    // TODO validate that logged in player has rights to look this up
    const gameIdToPlayIds = this.playerIdGameIdToPlayIds[playerId];

    return games.map((game) =>
    {
      const gameId = game.id;
      const playId = gameIdToPlayIds[gameId];
      if (playId)
      {
        return this.plays[playId];
      }
      return null;
    });
  }

  newPlay(playerId: string, gameId: string): ResultOfCreate
  {
    // TODO validate player has rights to save the game

    if (this.playerIdGameIdToPlayIds[playerId][gameId])
    {
      return {
        success: false,
        errorMessage: "Game already exists for that player & game IDs",
        createdId: "",
      }
    }

    const game = this.games[gameId];
    if (!game)
    {
      return {
        success: false,
        errorMessage: "No game found for that ID",
        createdId: "",
      }
    }

    // TODO adapt playerID to playerIds for real player-to-player play
    let playerIds: [string, string] = [playerId, "-1"];
    if(Math.random() < 0.5)
    {
      playerIds.reverse();
    }

    let play = new Play(playerIds, gameId, game.rounds.length);
    return {
      success: true,
      createdId: play.id,
    }
  }

  getTodaysGames(): Game[]
  {
    // TODO change the games returned depending on the day
    let todayGameIds = [];
    todayGameIds = ['g-1', 'g-2', 'g-3', 'g-4'];
    return todayGameIds.map((gameId) => this.games[gameId]);
  }

  saveGame(adminPassword: string, words: string[], rounds: Round[], exampleClues: string[]) {
    let id = "g-" + (++this.numGames);
    while (this.games[id] !== undefined)
    {
        id = "g-" + (++this.numGames);
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

  deleteGame(adminPassword: string, id: string): Game[] {
    this.games[id].deleted = true;
    return this.getGames(adminPassword);
  }

  getGame(id: string): Game {
    if (this.games[id] !== undefined)
    {
      if (this.games[id].active)
      {
        return this.games[id];
      }
      
    }
    throw new Error("No game for id " + id);
  }

  setGame(adminPassword: string, id: string, properties: Partial<Game>): Game[]
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

@cloudstate
export class Play {
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
        return "Error unimplemented";
    }

    saveGuess(): string | 1
    {
      // TODO validate that this player has rights to save this guess
      return "Error unimplemented";
    }
}