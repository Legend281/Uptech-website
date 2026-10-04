/** A vertical category label running up the left edge of a post thumbnail — replaces the horizontal corner pill with the more editorial treatment from the brief's reference images. */
export function CategoryTag({ category }: { category: string }) {
  return (
    <span className="absolute inset-y-0 left-0 z-10 flex w-7 items-center justify-center bg-navy-950/75 backdrop-blur-sm sm:w-8">
      <span className="origin-center -rotate-180 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300" style={{ writingMode: "vertical-rl" }}>
        {category}
      </span>
    </span>
  );
}
