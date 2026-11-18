# NitHub Talent Spotlight

Version 0.1 ·

## 1\. Scope and timeline

The PRDs plan 3days; the build window is Wed Nov 18 to Fri Nov 20.

Build only what the demo path needs: an intern builds a profile, admin approves it, a recruiter finds the intern and shortlists them, and NitHub is notified by email.

**Build now**

- Email/password auth; admin role detected from the NitHub email
- Intern profile, up to 3 projects, image upload
- Admin approval of profiles (pending list, approve and unapprove)
- Public directory with filters, proof-of-work cards, and profile page
- Shortlist cart (1–5 interns) and hiring request form
- Email alert to admin on each request, and an admin request list
- Seed 15–20 real interns

**Not building yet** (due to timeline): Hire a Squad view, Lobby TV (this could be where hackathons are virtually hosted), request status updates, CSV export, extra badges (Hackathon Winner, Shipped MVP), mentor endorsements, GitHub OAuth, WhatsApp alerts, and everything in the PRD out-of-scope list.

## 2\. Roles and permissions

| Role | Can | Cannot |
| --- | --- | --- |
| Visitor (logged out) | Browse approved profiles and projects; use the shortlist cart; submit a hiring request. | See any intern's email or phone; read hiring requests |
| Intern | Create and edit own profile; create, edit, reorder, and delete own projects (max 3); upload own images. | Change is\_verified or account\_role; see other interns' private data |
| Admin | See all profiles, including pending; approve or unapprove; read hiring requests | — |

**Admin accounts.** Admins sign up through the normal signup form with email and password. If the email domain matches the NitHub domain (OPEN: which domain) and the email is confirmed, the account gets account\_role = admin. The role is set by a database trigger, never by the client. Every admin route checks account\_role = admin and a confirmed email on the server, and row-level security enforces the same rule in the database.

**Email confirmation** is on for all accounts (the Supabase default), which is what makes the NitHub-email check meaningful.

## 3\. Data model (PostgreSQL on Supabase)

Enums: track\_enum (frontend, backend, fullstack, uiux, aiml, mobile); availability\_enum (available\_now, open\_to\_gigs, in\_cohort); request\_status\_enum (new, contacted, in\_progress, placed, closed).

### users (profiles)

| Column | Type | Rules |
| --- | --- | --- |
| id | uuid, PK | Equals auth. users.id |
| full\_name | text | Required |
| email | text | Required. Never exposed publicly |
| account\_role | text | intern or admin. Default intern. Set by trigger only |
| track | track\_enum | Required to submit the profile |
| bio | text | Required to submit. Max 280 chars |
| cohort\_year | int | Required to submit |
| availability\_status | availability\_enum | Required to submit |
| github\_url, linkedin\_url, x\_url | text | Optional. Must be https URLs |
| avatar\_url | text | Optional |
| is\_verified | boolean | Default false. Admin-only write. Means approved: it makes the profile public and shows as the NitHub Verified badge |
| consented\_at | timestamptz | Set when the intern ticks the consent box (see Open 5) |
| created\_at, updated\_at | timestamptz | Automatic |

### projects

| Column | Type | Rules |
| --- | --- | --- |
| id | uuid, PK |  |
| user\_id | uuid, FK to users | On delete cascade |
| title | text | Required. Max 80 chars |
| tagline | text | Required. Two-sentence problem/solution summary. Max 280 chars |
| tech\_stack | text\[\] | 1–8 tags, stored lowercase and trimmed |
| live\_url | text | Required. https |
| repo\_url | text | Required (OPEN 8). https |
| thumbnail\_url | text | Optional. Card shows a placeholder if empty |
| position | smallint | 1–3. Unique with user\_id. This also enforces the max of 3 projects per intern. Position 1 is the top project shown on the card; interns can reorder |

### hiring\_requests

| Column | Type | Rules |
| --- | --- | --- |
| id | uuid, PK |  |
| company\_name | text | Required |
| contact\_email | text | Required, valid email |
| contact\_phone | text | Optional |
| engagement\_type | text | Required. Free text for now (OPEN 4) |
| notes | text | Required. The brief job description |
| shortlisted\_user\_ids | uuid\[\] | 1–5 ids, all approved profiles. Snapshot at submit time |
| status | request\_status\_enum | Default new |
| notified\_at | timestamptz, nullable | Set when the admin email is sent. Null means the email failed |
| created\_at | timestamptz | Automatic |

### Visibility rule

A profile is public only when is\_verified = true AND the intern has at least one project. Anonymous access goes through a view (public\_talent) that excludes email and consented\_at. Anonymous users have no direct access to the users table.

### Database logic

- On new auth user: insert the users row; set account\_role = admin if the email matches the NitHub domain, else intern.
- Block non-admin writes to is\_verified and account\_role (row-level security plus a trigger).
- Storage buckets avatars and thumbnails: public read; write allowed only under the path {user\_id}/; jpg, png or webp, max 2 MB.

## 4\. Flows and states

**Intern.** Sign up (full name, email, password) → confirm email → sign in → complete profile (all required fields + consent box) → add 1–3 projects → profile shows as Pending → admin approves → profile becomes public.

**Profile states** are derived, with no extra column. Incomplete: required fields or consent missing. Pending: complete, at least one project, is\_verified = false. Approved: is\_verified = true.

**Recruiter (no login).** Open the directory → filter → open a profile or card links (live demo, repo) → add up to 5 interns to the shortlist → open the shortlist → fill the request form → submit → success screen. The cart lives in browser session storage: it survives refresh and navigation, and is gone when the tab closes.

**Admin.** Sign in → Pending profiles (oldest first) → open, check project links → Approve or leave pending → Requests list (newest first) → request detail with the shortlisted interns.

**Required UI states:** loading skeletons; empty results (No builders match these filters, with a clear-filters button); empty launch state; inline form validation; cart-full message at 5; request success screen; 404 for unknown or unapproved profiles.

## 5\. API contract

All JSON. Errors use { error: { code, message, fields? } } with status 400 (validation), 401 (not signed in), 403 (not admin), 404, 429 (rate limit).

### Public

- GET /api/talent — query: role (repeatable, track values), stack (repeatable, tag strings), availability (repeatable), page (default 1), page\_size (default 12). Within one filter, values are OR; across filters, AND. A profile matches a stack filter if any of its projects has that tag. Returns { data: \[{ id, full\_name, avatar\_url, track, availability\_status, cohort\_year, is\_verified, top\_project: { id, title, tagline, tech\_stack, live\_url, repo\_url, thumbnail\_url } }\], page, total }. Default sort: newest approved first (OPEN 6).
- GET /api/talent/:id — full public profile with all projects ordered by position. 404 if not public.
- GET /api/filters/stack — distinct tech-stack tags across public profiles, to populate the filter.
- POST /api/hiring-requests — body: { company\_name, contact\_email, contact\_phone?, engagement\_type, notes, shortlisted\_user\_ids\[1..5\] }. Server route only (uses the service key). Validates every id is a public profile. Returns 201 { id }. Side effects: insert the row, then send the admin email through Resend. If the email fails, the request is still saved with notified\_at null and the error is logged. Includes a honeypot field and a rate limit (default 5 per hour per IP; 429 beyond that).

### Intern (Supabase client with row-level security, no custom endpoints)

Upsert own users row; create, update, delete own projects; upload to own storage path.

### Admin (server-checked and row-level security)

- GET /api/admin/profiles?status=pending|approved
- PATCH /api/admin/profiles/:id — body { is\_verified }
- GET /api/admin/hiring-requests?page=
- GET /api/admin/hiring-requests/:id — includes resolved intern names and profile links

### Admin email content

Subject: New hiring request from {company\_name}. Body: company, contact email and phone, role type, job description, shortlisted interns with links to their profiles, and a link to the request in the admin dashboard.

## 6\. Frontend routes and components

| Route | Purpose |
| --- | --- |
| / | Directory: filter bar, grid of proof-of-work cards, shortlist button |
| /talent/\[id\] | Public profile with all projects |
| /login, /signup | Auth |
| /dashboard | Intern profile form and projects manager |
| /admin | Pending profiles and requests |

Components: FilterBar (role, stack, availability; filters mirrored in the URL query so a filtered view can be shared), TalentCard, ProjectCard, ShortlistDrawer, HiringRequestForm, ProfileForm, ProjectForm with image uploader, AdminProfileRow, AdminRequestRow.

## 7\. Acceptance criteria

1. **Auth.** A user can sign up with name, email and password, confirm the email, and sign in. A wrong password shows an error. The session persists on refresh.
2. **Admin gating.** A confirmed account with a NitHub-domain email can open /admin. Any other account gets 403 on /admin and on every admin endpoint, including direct API calls.
3. **Intern profile.** An intern can complete the profile (all required fields plus consent) and add 1–3 projects in under 5 minutes. A fourth project is blocked in the UI and in the database. Invalid URLs are rejected inline.
4. **Uploads.** A valid image (jpg, png, webp, up to 2 MB) uploads and previews. A wrong type or size shows an error. A failed upload does not lose the rest of the form.
5. **Approval gate.** A pending profile does not appear in the directory and its direct URL returns 404. After admin approval it appears with no redeploy. Unapproving hides it again.
6. **Directory.** A recruiter can filter by role, stack and availability. Each card shows the position-1 project with a thumbnail (or placeholder), live link, repo link, role tag and availability. Links open correctly.
7. **Privacy.** No public API response or page contains an intern's email or phone.
8. **Cart.** Add and remove work. A sixth add shows a cart-full message. The cart survives refresh in the same session, is cleared after a successful submit, and is empty in a new session.
9. **Request.** The form validates required fields and 1–5 interns. A successful submit shows a confirmation and creates a hiring\_requests row with status new. Ids of non-public profiles are rejected.
10. **Email alert.** Within one minute of submit, the admin address receives the email described in section 5. If the email provider fails, the request is still saved and shows as not notified in the admin list.
11. **Admin tools.** Admin sees pending profiles (oldest first) with an approve action, and requests (newest first) with a detail view.
12. **Abuse protection.** A sixth submission from one IP within an hour returns 429. A filled honeypot field is silently discarded.
13. **Responsive.** Directory, cart, request form and intern forms are usable at 360 px width.
14. **Launch.** Deployed on Vercel against production Supabase, with 15–20 real intern profiles whose project links have been checked by hand.

## 8\. Task split and plan

**Backend engineer (Olamide):** Wed: Supabase project, enums, tables, view, triggers, row-level security, storage buckets. Thu: API routes (talent list and detail, stack filter, hiring request with Resend and rate limit, admin routes), seed/import script.

**Frontend engineer (Victor):** Wed: Next.js, Tailwind and shadcn scaffold, auth pages, intern dashboard forms. Thu: directory, filters and cards, profile page, shortlist drawer and request form, admin pages, mobile pass.

**Plan.** Wed and Thu: build and integrate Thursday evening. Fri: QA, mobile fixes, production deploy, demo rehearsal.