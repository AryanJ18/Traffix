import { KNOWN_AREAS } from './constants.js';

export async function extractKnownArea(userInput) {
  const lowerInput = userInput.toLowerCase();

  const matchedArea = KNOWN_AREAS.find(area => 
    lowerInput.includes(area.toLowerCase())
  );

  return matchedArea;
}