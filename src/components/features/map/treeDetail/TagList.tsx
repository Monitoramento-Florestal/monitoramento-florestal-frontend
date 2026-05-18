interface TagListProps {
  items: string[];
}

export function TagList({ items }: TagListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs text-burgundy/88"
        >
          {item}
        </span>
      ))}
    </div>
  );
}
