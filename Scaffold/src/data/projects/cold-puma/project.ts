import type { Project } from "../types";
//THIS IS AN EXAMPLE OF A MEDIA PROJECT WITH BODY TEXT,CLONE THIS FILE AND MODIFY THE CONTENT TO CREATE A NEW TEXT PROJECT
const project: Project = {
  id: "cold-puma",
  title: "Cold Archive x PUMA",
  type: "media",

  tags: ["Fashion"],
  description: `Puma and Cold Archive have been producing content together since 2024. In that time, we've created dozens of pieces of viral content for social media and run multiple in-person events around the world—from Paris Fashion Week to Seoul.

  Cold Archive uses their deep connections to global youth culture scenes to find the coolest local talent for culturally authentic branding experiences.

  My role has been to provide copy for both in-person events and media-facing content, including social media, exhibition text, and press releases.

  I have provided a selection of standout social media work in the media gallery. Browse the links below for full text examples and the project gallery for additional collaborative work.`,
  credits: [
    { role: "Author", name: "Joseph Gleasure" },
    { role: "Client", name: "Cold Archive, PUMA" },
    { role: "URL", name: "[Cold Archive x PUMA](https://about.puma.com/en/newsroom/corporate-news/2025/20-01-2025-puma-takes-over-paris-fashion-week-immersive-brand-space)" }
  ],
  media: [
    new URL("./1 (1).mp4", import.meta.url).href,
    new URL("./1 (2).mp4", import.meta.url).href,
    new URL("./1 (3).mp4", import.meta.url).href,
    new URL("./1 (1).jpg", import.meta.url).href,
    new URL("./1 (2).jpg", import.meta.url).href,
    new URL("./1 (3).jpg", import.meta.url).href,
    new URL("./1 (4).jpg", import.meta.url).href,
    new URL("./1 (5).jpg", import.meta.url).href,
    new URL("./1 (6).jpg", import.meta.url).href,
    new URL("./1 (7).jpg", import.meta.url).href,
    new URL("./1 (8).jpg", import.meta.url).href,
    new URL("./1 (9).jpg", import.meta.url).href,
  ],
  body: `
[A @coldarchive_agency Production for Puma King: Trifecta of Brazilian Youth- Hair, Footwear, and Football](https://www.instagram.com/p/DP_YY0qjFSk/?img_index=1)

["SPEED" by COLD ARCHIVE × PUMA H-STREET](https://www.instagram.com/p/DJUNyhGNKQL/)

[A Cold Archive Production for Puma Mostro: In The Mood For Afters](https://www.instagram.com/p/DHYq0AptV-O/)

[A @coldarchive_agency Production for Puma Mostro: You Don't Have to Suffer For Fashion](https://www.instagram.com/p/DHTflcAtiyo/?img_index=1)

[No Anxiety No Art](https://www.instagram.com/p/DE51WCZIcZ1/?img_index=1)

[Imperfection is the New Perfection](https://www.instagram.com/p/DFLmZxotWkj/)

[A Cold Archive Production - The Cultural Incubation of Asia's Electronic Underground](https://www.instagram.com/p/C8XCBaXNNk2/?img_index=3)

[China's Circle Culture](https://www.instagram.com/p/C5Dqq-ySHnK/?img_index=1)

[The Night is Still Young](https://www.instagram.com/p/C4dPaMxSjFy/?img_index=1)

[Virtual underground of Japans arcade scene](https://www.instagram.com/p/C4X34xHSap_/?img_index=1)

[Puma Mostro - A Northern English Perspective](https://www.instagram.com/p/C1FBsPWNyuY/?img_index=1)
  `
};

export default project;