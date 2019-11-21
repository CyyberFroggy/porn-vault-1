import Label from "./types/label";
import Actor from "./types/actor";

// Returns IDs of extracted labels
export async function extractLabels(str: string) {
  str = str.toLowerCase();
  const foundLabels = [] as string[];

  const allLabels = await Label.getAll();

  allLabels.forEach(label => {
    if (str.includes(label.name.toLowerCase())) {
      foundLabels.push(label._id);
    } else if (label.aliases.some(alias => str.includes(alias.toLowerCase()))) {
      foundLabels.push(label._id);
    }
  });
  return foundLabels;
}

// Returns IDs of extracted actors
export async function extractActors(str: string) {
  str = str.toLowerCase();
  const foundActors = [] as string[];

  const allActors = await Actor.getAll();

  allActors.forEach(actor => {
    if (str.includes(actor.name.toLowerCase())) {
      foundActors.push(actor._id);
    } else if (actor.aliases.some(alias => str.includes(alias.toLowerCase()))) {
      foundActors.push(actor._id);
    }
  });
  return foundActors;
}
