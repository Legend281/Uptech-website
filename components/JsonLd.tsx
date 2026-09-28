/**
 * Renders one schema.org JSON-LD block. The `<` escape isn't defending
 * against user input here (every caller passes our own server-generated
 * data, e.g. lib/structuredData.ts) — it's defending against a real
 * substring anywhere in that data (a job description, an FAQ answer)
 * containing a literal `</script>`, which would otherwise terminate the
 * tag early and dump the rest of the JSON as raw text on the page.
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
