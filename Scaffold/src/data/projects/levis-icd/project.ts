import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A TEXT PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW TEXT PROJECT
const project: Project = {
  id: "levis-icd",
  title: "An Expanded History of Levi’s ICD+ & Philips’ Wearable Electronics Program",
  type: "text",

  thumbnail: "/media/projects/losing-my-hands/thumb.jpg",
  tags: ["AI"],
  description: "An Expanded History of Levi’s ICD+ & Philips’ Wearable Electronics Program",

  credits: [
    { role: "Author", name: "Joseph Gleasure" }
  ],

  body: `
  An Expanded History of Levi’s ICD+ & Philips’ Wearable Electronics Program
  `
};

export default project;