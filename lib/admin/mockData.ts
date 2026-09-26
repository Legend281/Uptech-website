/*
 * Leads now come from Supabase for real (see LeadsProvider.tsx +
 * supabase/003_staff_auth.sql) — this file used to export mockLeads as
 * seed/fallback data for a localStorage-only store. Deleted rather than
 * left unused: it isn't this codebase's call to seed fake customer records
 * into a real production database.
 */

/*
 * Activity now comes from Supabase for real (see ActivityProvider.tsx +
 * supabase/008_activity_log.sql) — this file used to export mockActivity as
 * seed/fallback data for a localStorage-only store, complete with
 * fictional entries attributed to staff who no longer have real accounts.
 * Deleted rather than left unused, same reasoning as mockLeads above.
 */

/*
 * Job postings now come from Supabase for real (see
 * JobPostingsProvider.tsx + supabase/006_job_postings.sql) — this file
 * used to export mockJobPostings as seed/fallback data for a
 * localStorage-only store. Deleted rather than left unused, same reasoning
 * as mockLeads above.
 */

/*
 * Service pages now come from Supabase for real (see
 * ServicePagesProvider.tsx + supabase/009_service_pages.sql) — this file
 * used to export mockServicePages as seed/fallback data for a
 * localStorage-only store, including a REVIEWED_BY placeholder
 * ("Uptech Consulting Legal & Corporate Administration Desk") that was
 * never actually confirmed as a real department name. The Supabase seed
 * uses the confirmed correct value ("Uptech Consulting Management") per
 * Admin_Dashboard_Requirements.md Section 5. Deleted rather than left
 * unused, same reasoning as mockLeads above.
 */
