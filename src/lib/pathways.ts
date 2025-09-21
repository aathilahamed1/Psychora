import data from './pathways.json';

export type PathwayTask = {
    day: number;
    descriptionKey: string;
    link: string;
}

export type Pathway = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  tasks: PathwayTask[];
};

export const pathways: Pathway[] = data.pathways;
