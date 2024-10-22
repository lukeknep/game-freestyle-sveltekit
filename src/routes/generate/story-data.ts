
import { cloudstate } from "freestyle-sh";

interface IActionResponse {
  success: boolean,
  itemId: string | number, // use empty string if error, but leave as required to prevent forgetting to set it when successful
  errorMessage?: string,
}

export interface IMetadata<T> {
    id: string,
    name: string,
    createdAtMillis: number,
    updatedAtMillis: number,
    archived: boolean,
    meta: T,
}

export type IListSummary<T> = IMetadata<T>[];

export type IPromptStatus = 'none' | 'loading' | 'success' | 'error' | 'deleted';

export interface IGeneration {
    status: IPromptStatus;
    image: string; // base64 encoded image data
    id: string;
    seed: number;
    promptUsed: string;
}

export interface ILine {
    id: string;
    imagePrompt: string;

    text: string;

    generations: IGeneration[];

    numInitialGenerations: number;
}

export interface IStoryMeta {
    style: string;
}

@cloudstate
export class Story 
{
    id = crypto.randomUUID();
    lines: ILine[] = [];
    name: string = 'Story';
    archived: boolean = false;

    meta: IStoryMeta = {
        style: '',
    };
    

    createdAtMillis: number = (new Date()).getTime();
    updatedAtMillis: number = (new Date()).getTime();

    touch()
    {
        this.updatedAtMillis = (new Date()).getTime();
    }

    getMetadata(): IMetadata<IStoryMeta>
    {
        return {
            id: this.id,
            name: this.name,
            createdAtMillis: this.createdAtMillis,
            updatedAtMillis: this.updatedAtMillis,
            meta: this.meta,
            archived: this.archived,
        }
    }

    getLines()
    {
        return this.lines;
    }

    setMetadata(metadata: IMetadata<IStoryMeta>)
    {
        // TODO validate input
        this.name = metadata.name;
        this.meta = metadata.meta;
        this.archived = metadata.archived;
        this.touch();
    }


    // setStyle(newStyle: string)
    // {
    //     // TODO validate input
    //     this.style = newStyle;
    //     this.touch();
    // }


    createLine(atIndex: number = -1): IActionResponse
    {
        if (atIndex < -1 || atIndex > this.lines.length)
        {
            return {
                success: false,
                itemId: -1,
                errorMessage: 'Incorrect index given',
            }
        }

        this.touch();

        let newLine: ILine = {
            imagePrompt: 'prompt!',
            text: 'text!',
            generations: [],
            numInitialGenerations: 5,
            id: crypto.randomUUID(),
        };

        if (atIndex === -1)
        {
            this.lines.push(newLine);
            return {
                success: true,
                itemId: this.lines.length - 1,
            }
        }
        else
        {
            this.lines.splice(atIndex, 0, newLine);
            return {
                success: true,
                itemId: atIndex,
            }
        }
    }
    
}

@cloudstate
export class Database {
  static id = "DatabaseX";
  stories: {[id: string]: Story } = {};

  getStoryList(): IListSummary<IStoryMeta>
  {
    return Object.values(this.stories)
        .map((story) => story.getMetadata())
        .filter((storyMeta) => !storyMeta.archived)
        .sort((a, b) => a.updatedAtMillis - b.updatedAtMillis);
  }

  getStory(id: string): Story
  {
    return this.stories[id];
  }

  createStory(): IActionResponse
  {
    let story = new Story();
    this.stories[story.id] = story;
    return {
        success: true,
        itemId: story.id,
    }
  }
}