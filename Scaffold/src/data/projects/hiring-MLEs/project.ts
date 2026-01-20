import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A TEXT PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW TEXT PROJECT
const project: Project = {
  id: "hiring-mles",
  title: "Hiring MLEs at Early Stage Companies",
  type: "text",

  thumbnail: "/media/projects/losing-my-hands/thumb.jpg",
  tags: ["AI"],
  description: "Hiring MLEs at Early Stage Companies",

  credits: [
    { role: "Author", name: "Joseph Gleasure" }
  ],

  body: `
  Hiring MLEs at Early Stage Companies
  `
};

export default project;