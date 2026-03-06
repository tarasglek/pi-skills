---
name: homeassistant
description: Use when checking a local Home Assistant instance via REST API with curl and bearer token authentication from shell environment variables
---

# Home Assistant API Quick Check

Use this long-lived access token environment variable:

- `HASS_LONG_LIVED_TOKEN`

Example:

```bash
TOKEN="${HASS_LONG_LIVED_TOKEN:-}"
curl -sS \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:8123/api/
```

If auth works, response includes:

```json
{"message":"API running."}
```
