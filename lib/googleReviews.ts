import type { TestimonialCardProps } from "@/components/TestimonialCard";

/*
 * Live pull from Google's Places API (New) — Place Details, reviews field.
 * Server-only (GOOGLE_PLACES_API_KEY is a billable secret, never exposed to
 * the client). Same graceful-degradation posture as every other optional
 * integration in this project (Turnstile, Sentry, Resend): no env vars set
 * yet -> quietly returns [], nothing breaks, nothing is invented to fill
 * the gap.
 *
 * Real, documented Google limitations — not bugs in this code:
 * - Returns at most 5 reviews, and Google's own relevance algorithm picks
 *   which ones once there are more than 5. Not sortable or filterable by
 *   us. With fewer than 5 real reviews (e.g. exactly 2), it returns
 *   exactly those.
 * - Google's terms for displaying this content require attribution to
 *   Google and a link back to the listing — both built in below (the
 *   star-rating badge and the "leave a review" link), not optional extras.
 */

type PlacesApiReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
};

type PlacesApiResponse = {
  reviews?: PlacesApiReview[];
};

export type GoogleReview = TestimonialCardProps & { id: string };

function starBadge(rating: number): string {
  return `${"★".repeat(Math.round(rating))}${"☆".repeat(5 - Math.round(rating))} on Google`;
}

export async function getGoogleReviews(): Promise<GoogleReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return [];

  try {
    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
      // Google's terms require periodically refreshing cached review
      // content rather than storing it indefinitely — a day is a
      // reasonable balance against this being a billable API call.
      next: { revalidate: 86_400 },
    });

    if (!response.ok) {
      console.error("[google-reviews] Places API request failed:", response.status, await response.text());
      return [];
    }

    const data = (await response.json()) as PlacesApiResponse;
    return (data.reviews ?? [])
      .filter((review): review is PlacesApiReview & { text: { text: string } } => Boolean(review.text?.text?.trim()))
      .map((review, index) => ({
        id: `google-${index}`,
        quote: review.text.text.trim(),
        displayName: review.authorAttribution?.displayName ?? "Google user",
        photoUrl: review.authorAttribution?.photoUri,
        outcomeLine: typeof review.rating === "number" ? starBadge(review.rating) : undefined,
      }));
  } catch (error) {
    console.error("[google-reviews] Places API request failed:", error);
    return [];
  }
}

/** Google's own documented deep link for leaving a new review — needs only the Place ID, no API call. */
export function googleWriteReviewUrl(): string | undefined {
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!placeId) return undefined;
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}
