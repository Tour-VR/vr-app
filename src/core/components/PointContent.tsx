import { splitParagraphs } from '../text';

interface PointContentProps {
  history: string;
}

/** Secao "Historia": texto simples dividido em paragrafos, sem HTML nem Markdown. */
export function PointContent({ history }: PointContentProps) {
  return (
    <section aria-labelledby="point-history" className="flex flex-col gap-3">
      <h2 id="point-history" className="text-xl font-semibold text-gray-900">
        História
      </h2>
      {splitParagraphs(history).map((paragraph, index) => (
        <p key={index} className="text-base leading-relaxed whitespace-pre-line text-gray-800">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
