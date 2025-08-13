export type RelatedFile = {
  file: string;
  content: string;
  summary: string;
};

export type Answer = {
  answer: string;
  relatedFiles: RelatedFile[];
};
