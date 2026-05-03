import type { Idea, GradientPreset } from "@/lib/types";
import { ButtonLink } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { SaveIdeaButton } from "./SaveIdeaButton";

const GRADIENTS: Record<GradientPreset, string> = {
  indigo: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
  sky: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
  mint: "linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)",
  peach: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
  lavender: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
};

export type IdeaCardProps = {
  idea: Idea;
  className?: string;
};

export function IdeaCard({ idea, className = "" }: IdeaCardProps) {
  return (
    <article
      className={[
        "group bg-surface rounded-xl shadow-md overflow-hidden flex flex-col",
        "transition-all duration-200 ease-smooth",
        "hover:shadow-lg hover:-translate-y-0.5",
        className,
      ].join(" ")}
    >
      <div
        className="aspect-[16/9] flex items-center justify-center"
        style={{ background: GRADIENTS[idea.gradient] }}
      >
        <span className="text-[96px] leading-none" aria-hidden="true">
          {idea.emoji}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <h3 className="font-display text-h3 text-text mb-2">{idea.title}</h3>
          <p className="text-body-sm text-text-muted line-clamp-2">{idea.description}</p>
        </div>

        {idea.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {idea.tags.map((tag) => (
              <Chip key={tag} variant="neutral">
                {tag}
              </Chip>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <ButtonLink href={`/builder?ideaId=${idea.id}`} variant="primary" size="sm">
            Build this
          </ButtonLink>
          <SaveIdeaButton ideaId={idea.id} />
        </div>
      </div>
    </article>
  );
}
