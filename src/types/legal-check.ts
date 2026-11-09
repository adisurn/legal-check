export type Case = {
  id: string;
  title: string;
  company: string;
  category: string;
  status: string;
  date: string;
  documents: string[];
};

export type Article = {
  category: string;
  title: string;
  description: string;
  image: string;
  body: string;
};

export type LegalCheckDraft = {
  contract: string;
  analysis: boolean;
  fileError: string;
};
