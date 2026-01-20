import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A TEXT PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW TEXT PROJECT
const project: Project = {
  id: "year-of-LLMs",
  title: "What We Learned from a Year of Building with LLMs",
  type: "text",

  thumbnail: "/media/projects/losing-my-hands/thumb.jpg",
  tags: ["AI"],
  description: "What We Learned from a Year of Building with LLMs",

  credits: [
    { role: "Author", name: "Joseph Gleasure" }
  ],

  body: `
  What We Learned from a Year of Building with LLMs
  `
};

export default project;