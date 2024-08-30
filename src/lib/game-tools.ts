// import { cloudstate } from "freestyle-sh";
import { ALL_WORDS, ID_TO_WORD_RANGE } from "./const";
import english from "./english";

export interface Round {
    answers: boolean[];
}

export interface Game {
    id: string;
    active: boolean;
    words: string[];
    rounds: Round[];
    exampleClues: string[];
    createdAtMillis: number;
    deleted: boolean;
}

export interface Turn {
    cluePlayerId: string;
    guessPlayerId: string;

    clue: string | null;
    guessAnswers: boolean[] | null;

    isComplete: boolean;
    isCorrect: boolean | null;
}


export function validateClue(clue: string): boolean
{
    clue = clue.toLowerCase();
    if (!clue || english[clue] !== 1)
    {
        return false;
    }
    return true;
}



export function generateWords(id?: number): string[]
{
    if (!id)
    {
        id = Math.floor(Math.random() * ID_TO_WORD_RANGE[0].max_id);
    }
    let i = 0;
    let elem = ID_TO_WORD_RANGE[i];
    while (elem && (id > elem.max_id || id < elem.min_id ))
    {
        elem = ID_TO_WORD_RANGE[++i];
    }

    if (!elem)
    {
        throw new Error("Game ID is out of range");
    }

    const { word_range, game_word_size } = elem;

    let range_size = word_range[1] - word_range[0] + 1;
    let index =  word_range[0] + (id % range_size);
    let incr = id;
    let words: string[] = [];

    while (words.length < game_word_size)
    {
        if (words.indexOf(ALL_WORDS[index]) === -1)
        {
            words.push(ALL_WORDS[index]);
        }
        index += incr;
        incr += 1;
        index = index % range_size;
    }

    return words;
}

export function generateRounds(numWords: number, numGames: number): Round[] {
    let rounds:Round[] = [];
    for (let i = 0; i < numGames; i ++)
    {
        let targets = [];
        for (let j = 0; j < (i < 2 ? 2 : 3); j ++)
        {
            let target = Math.floor(Math.random() * numWords);
            if (targets.indexOf(target) != -1)
            {
                j -= 1;
            }
            else
            {
                targets.push(target);
            }
        }

        let answers: boolean[] = [];
        for (let k = 0; k < numWords; k ++)
        {
            answers.push(targets.indexOf(k) != -1);
        }

        let round = {
            answers,
        };

        let hasMatch = false;
        rounds.forEach((r) => {
            if (r.answers.every((b, i) => answers[i] === b))
            {
                hasMatch = true;
            }
        })

        if (hasMatch) {
            i --; 
            continue;
        }
        rounds.push(round);
    }
    return rounds;
}


// export type Games = {[id: string]: Game };


// @cloudstate
// export class Game {
//   id = Math.floor(Math.random() * 9999999999999);

//   id = crypto.randomUUID();

//   active: boolean = false;

//   words: String[] = [];
//   rounds: Round[] = [];

//   gameClues: { clues: string[], turkId: string }[] = [];
//   gameShown: number = 0;
//   gameCorrect: number = 0;
//   gameIncorrect: number = 0;

//   set(words: String[], rounds: Round[]) {
//     this.words = words;
//     this.rounds = rounds;
//   }

//   getData() {
//     return {
//         words: this.words,
//         rounds: this.rounds,
//     }
//   }

//   getWords() {
//     return this.words;
//   }

//   getRounds() {
//     return this.rounds;
//   }
// }

// @cloudstate
// export class GameManager {
//     static id = "game-manager";

//     savedGames: Game[] = [];

//     saveGame(words: string[], rounds: Round[]): number 
//     {
//         const game = new Game();
//         game.set(words, rounds);
//         this.savedGames.push(game);
//         return this.savedGames.length - 1;
//     }

//     getGame(id: number)
//     {
//         return this.savedGames[id];
//     }
// }
