import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A MEDIA PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW MEDIA PROJECT
const project: Project = {
  id: "vision-tools",
  title: "Vision Tools",
  type: "media",

  thumbnail: "/media/projects/vision-tools/thumb.jpg",
  tags: ["Fashion", "Branding"],
  description: "Eyewear as functional equipment.",

  credits: [
    { role: "Concept & Design", name: "Jo Gleasure" }
  ],

  media: [
    "/media/projects/vision-tools/1.jpg",
    "/media/projects/vision-tools/2.jpg"
  ]
};

export default project;
