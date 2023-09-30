// blog.ts

export interface BlogData {
  title: string;
  content: string[];
  subheadings: string[];
  conclusion: string;
  qna: QnA[];
  resources: string[];
}

export interface QnA {
  question: string;
  answer: string;
}
