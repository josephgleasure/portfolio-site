import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A MEDIA PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW MEDIA PROJECT
const fallback = new URL("../../../assets/projects/fallback.jpg", import.meta.url).href;
const project: Project = {
  id: "vision-tools",
  title: "Vision Tools",
  type: "media",

  // Placeholder while we wire up real media paths
  thumbnail: fallback,
  tags: ["Fashion", "Branding"],
  description: "Eyewear as functional equipment.",

  credits: [
    { role: "Concept & Design", name: "Jo Gleasure" }
  ],

  media: [
    fallback
  ]
};

export default project;
