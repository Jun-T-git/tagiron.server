export interface Action {
  senderId: string;
  content: string;
}

export interface Question {
  senderId: string;
  questionId: string;
}

export interface Challenge {
  senderId: string;
  tiles: string;
}
