import data from './questionnaires.json';

export type Answer = {
  text: string;
  value: number;
};

export type Interpretation = {
    min: number;
    max: number;
    level: string;
    recommendation: string;
}

export type Questionnaire = {
  title: string;
  questions: string[];
  answers: Answer[];
  interpretation: Interpretation[];
};

export const questionnaires: { [key: string]: Questionnaire } = data.questionnaires;
