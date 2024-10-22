import type { ILine, IGeneration } from './story-data';

// export function newILine(): ILine {
//     return {
//         imagePrompt: '',
//         text: '',
//         generations: [],
//         numInitialGenerations: 5,
//         id: crypto.randomUUID(),
//     };
// }

export function newIGeneration(line: ILine, style: string, seed = -1): IGeneration {
    let promptUsed = line.imagePrompt;
    promptUsed += ' Use this style: ' + style;

    if (seed !== -1)
    {
        promptUsed += '. Use seed: ' + seed;
    }

    return {
        status: 'none',
        image: '',
        id: crypto.randomUUID(),
        seed,
        promptUsed,
    }
}
