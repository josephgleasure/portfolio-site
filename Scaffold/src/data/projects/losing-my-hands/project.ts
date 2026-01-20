import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A TEXT PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW TEXT PROJECT
const project: Project = {
  id: "losing-my-hands",
  title: "Losing My Hands",
  type: "text",

  thumbnail: "/media/projects/losing-my-hands/thumb.jpg",
  tags: ["AI"],
  description: "Losing My Hands is a book about the loss of my hands.",

  credits: [
    { role: "Author", name: "Joseph Gleasure" }
  ],

  body: `
  Losing My Hands is a book about the loss of my hands.
  It is a story about my journey of losing my hands and how I coped with it.
  `
};

export default project;