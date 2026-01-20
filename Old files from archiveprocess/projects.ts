import projectsData from './books.json';

export interface Project {
  id: number;
  title: string;
  author: string;
  isbn: number | string;
  publicationYear: number;
  description: string;
  images: string;
}

export const projects: Project[] = projectsData as Project[];

export const findProjectById = (id: number): Project | undefined => {
  return (projects as Project[]).find((project: Project) => project.id === id);
};

const formatISBN = (isbn: number | string): string => {
  return isbn === 'N/A' || isbn === '' ? 'N/A' : String(isbn);
};


