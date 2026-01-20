import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A TEXT PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW TEXT PROJECT
const project: Project = {
  id: "data-flywheels",
  title: "Data Flywheel Go Brrr: Using Your Users to Build Better Products",
  type: "text",

  thumbnail: "/media/projects/losing-my-hands/thumb.jpg",
  tags: ["AI"],
  description: "Data Flywheel Go Brrr: Using Your Users to Build Better Products",

  credits: [
    { role: "Author", name: "Joseph Gleasure" }
  ],

  body: `
  Data Flywheel Go Brrr: Using Your Users to Build Better Products
  `
};

export default project;