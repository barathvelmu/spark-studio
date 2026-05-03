import type { Concept } from "@/lib/types";
import { Chip, type ChipVariant } from "./ui/Chip";

const CONCEPT_VARIANT: Record<Concept, ChipVariant> = {
  variables: "primary",
  loops: "accent",
  events: "highlight",
  conditionals: "success",
  collision: "mauve",
  score: "peach",
  branching: "mint",
  state: "primary",
  arrays: "accent",
};

const CONCEPT_LABEL: Record<Concept, string> = {
  variables: "Variables",
  loops: "Loops",
  events: "Events",
  conditionals: "Conditionals",
  collision: "Collision",
  score: "Score",
  branching: "Branching",
  state: "State",
  arrays: "Arrays",
};

export type ConceptChipProps = {
  concept: Concept;
  className?: string;
};

export function ConceptChip({ concept, className }: ConceptChipProps) {
  return (
    <Chip variant={CONCEPT_VARIANT[concept]} className={className}>
      {CONCEPT_LABEL[concept]}
    </Chip>
  );
}
