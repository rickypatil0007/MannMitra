export type QuoteCategory =
  | "rest"
  | "selfCompassion"
  | "academicPressure"
  | "uncertainty"
  | "resilience"
  | "selfWorth"
  | "growth"
  | "connection";

export type Quote = {
  id: string;
  text: string;
  category: QuoteCategory;
  minimumDuration?: number;
  maximumDuration?: number;
};

export const environmentalQuotes: Quote[] = [
  { id: "q_1", text: "You do not have to solve everything tonight.", category: "rest" },
  { id: "q_2", text: "Small progress is still progress.", category: "growth" },
  { id: "q_3", text: "Exhale. Let the weight fall away.", category: "selfCompassion" },
  { id: "q_4", text: "It is okay to pause.", category: "rest" },
  { id: "q_5", text: "You are more than your grades or your productivity.", category: "selfWorth" },
  { id: "q_6", text: "This chaos will pass. The mind will quiet.", category: "uncertainty" },
  { id: "q_7", text: "Your best changes from day to day.", category: "selfCompassion" },
  { id: "q_8", text: "Breathe in the quiet. Let go of the noise.", category: "rest" },
  { id: "q_9", text: "The pressure you feel is temporary.", category: "academicPressure" },
  { id: "q_10", text: "Even the darkest night will end and the sun will rise.", category: "resilience" },
  { id: "q_11", text: "You are allowed to rest before you are exhausted.", category: "rest" },
  { id: "q_12", text: "Sometimes the bravest thing you can do is ask for help.", category: "connection" },
  { id: "q_13", text: "Give yourself the same grace you give others.", category: "selfCompassion" },
  { id: "q_14", text: "Uncertainty is just an unwritten chapter.", category: "uncertainty" }
];
