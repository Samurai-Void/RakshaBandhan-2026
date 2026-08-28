# Raksha Bandhan 2026 — Version 2 Master Dashboard

This version keeps the festive interactive experience but replaces `content.js` editing with a real online dashboard backed by Supabase.

## What Version 2 does

- One public Raksha Bandhan link
- Visitors choose their sister/cousin
- Personalized memories, letters, rewards and Sister Level
- Animated Rakhi tying + confetti
- Festive background/decorations
- Private Master Panel login
- Add/edit/delete sisters/cousins from the browser
- Upload photos from the browser
- Edit photo captions
- Edit letters and rewards
- Edit Sister Level stats
- Data persists online in Supabase

## 1. Create a Supabase project

Go to the official Supabase website and create a free project.

## 2. Create the database

Open your Supabase project → SQL Editor → New query.

Copy the entire contents of `supabase.sql` into the SQL editor and run it.

## 3. Create your Master login

In Supabase → Authentication → Users, create a user with an email and password.

Copy that user's UUID.

Back in SQL Editor run:

```sql
insert into public.admins(user_id)
values ('PASTE-ADMIN-USER-UUID-HERE')
on conflict do nothing;
```

Do not share this password.

## 4. Connect this website

In Supabase → Project Settings → API, copy:

- Project URL
- anon/publishable key

Open `config.js` and replace:

```js
supabaseUrl: "YOUR_SUPABASE_URL",
supabaseAnonKey: "YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY",
```

Never put the `service_role` or secret key in the website.

## 5. Test it

Upload the folder to a static host or run it with a local web server.

Open the site and confirm the people list loads.

Click 👑 → log in → Add Person.

Then use 📸 Photos to upload memories.

## 6. Put it on GitHub Pages

Upload all files in this folder to your `raksha-bandhan-2026` repository, including:

- `index.html`
- `app.js`
- `styles.css`
- `config.js`
- `supabase.sql`
- `README.md`

Then enable GitHub Pages from repository Settings → Pages.

Your website will be available at the GitHub Pages address shown there.

## Important photo privacy note

The included setup makes the photo bucket publicly readable so the family photos can load on the public website. Uploading/deleting is restricted to your admin account, but anyone who obtains a photo's public URL may be able to view it. Do not upload sensitive/private material.

## If you want stronger privacy later

The next upgrade can switch the photo bucket to private and use short-lived signed URLs.


## Initial names/folders in this customized copy

Durva, Devangi, Khushi, Brinda.

The Sister Level has been simplified to Memories and Bond only.


## Fixed build note
This build safely handles a missing Supabase CDN library so the Master button remains usable instead of the page appearing stuck. The Sister Level editor now keeps only Memories and Bond; Chaos and Arguments were removed.
