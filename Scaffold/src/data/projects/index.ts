import visionTools from "./vision-tools/project";
import losingMyHands from "./losing-my-hands/project";
import hiringMLEs from "./hiring-MLEs/project";
import yearOfLLMs from "./year-of-LLMs/project";
import dataFlywheels from "./data-flywheels/project";
import needsEvals from "./needs-evals/project";
import levisICD from "./levis-icd/project";
import announcingIndexify from "./announcing-Indexify/project";

export const projects = [
  visionTools,
  losingMyHands,
  hiringMLEs,
  yearOfLLMs,
  dataFlywheels,
  needsEvals,
  levisICD,
  announcingIndexify,
];

export const findProjectById = (id: string) =>
  projects.find((p) => p.id === id);
