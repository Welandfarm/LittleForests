---
name: GitHub pull and preview setup
description: Replit-specific setup required after syncing the LittleForest repository from GitHub.
---

After syncing the repository from GitHub, verify that the Supabase secrets still exist and that the web preview maps the app's hardcoded port 5000 to the external web port. GitHub changes can replace the Replit workflow configuration without carrying over workspace secrets.

**Why:** The project started successfully from the shell but the Replit workflow could not detect it until the Supabase secrets were restored and the preview port mapping was corrected.

**How to apply:** After any GitHub pull, check `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` through the secure environment flow, then verify the `Start application` workflow reports port 5000 as open.