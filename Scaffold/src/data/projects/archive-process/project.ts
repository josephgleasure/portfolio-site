import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A TEXT PROJECT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW TEXT PROJECT
const project: Project = {
  id: "archive-process",
  title: "Archive Process",
  type: "media",

  tags: ["Fashion", "Personal"],
  description: ` 
  
  archiveprocess.com is a digital library of archival fashion resources where you can read books directly on the site or download curated scans I've collected over the years. 
  
  The project started as a technical exploration of vibecoding—building something tangible beyond random prototypes. Inspired by a quasi-isometric grid layout I found on Instagram, I created a visually engaging interface reminiscent of early 2000s Flash sites but focused on information rather than commerce. The site emerged from frustration with archivists' restricting access to content they don't own, which contradicts the purpose of archiving.
  
  Later archiveprocess.com served as the prototype for this portfolio site's design and functionality.
  `,
  credits: [
    { role: "Creator", name: "Joseph Gleasure" },
    { role: "URL", name: "[archiveprocess.com](https://archiveprocess.com)" }
  ],
media: [ 
  new URL("./1 (1).mp4", import.meta.url).href,
  new URL("./1 (1).jpg", import.meta.url).href,
  new URL("./1 (2).jpg", import.meta.url).href,
  new URL("./1 (3).jpg", import.meta.url).href,
  new URL("./1 (4).jpg", import.meta.url).href,
  new URL("./1 (5).jpg", import.meta.url).href,
],

};

export default project;