// import { cloudstate } from "freestyle-sh";
import { ALL_WORDS, ID_TO_WORD_RANGE } from "./const";

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

    console.log("words")
    console.log(words)

    return words;
}

export function generateRounds(numWords: number, numLevels: number): Round[] {
    let rounds:Round[] = [];
    for (let i = 0; i < numLevels; i ++)
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

        let answers = [];
        for (let k = 0; k < numWords; k ++)
        {
            answers.push(targets.indexOf(k) != -1);
        }

        let round = {
            answers,
        };

        rounds.push(round);
    }
    return rounds;
}

export interface Round {
  answers: boolean[];
}

export interface Level {
  id: number;
  active: boolean;
  words: string[];
  rounds: Round[];
  exampleClues: String[];
  createdAtMillis: number;
}

export type Levels = {[id: string]: Level};


// @cloudstate
// export class Level {
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
// export class LevelManager {
//     static id = "level-manager";

//     savedLevels: Level[] = [];

//     saveLevel(words: string[], rounds: Round[]): number 
//     {
//         const level = new Level();
//         level.set(words, rounds);
//         this.savedLevels.push(level);
//         return this.savedLevels.length - 1;
//     }

//     getLevel(id: number)
//     {
//         return this.savedLevels[id];
//     }
// }