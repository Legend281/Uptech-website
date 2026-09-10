type MaterialIconProps = {
  name: string;
  className?: string;
};

/** Thin wrapper around the Material Symbols web font loaded in the root layout. */
export function MaterialIcon({ name, className = "" }: MaterialIconProps) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}
