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

## Reload Before Restart

Never recommend restarting Home Assistant merely to load YAML changes before checking available reload actions:

```bash
curl -sS \
  -H "Authorization: Bearer $HASS_LONG_LIVED_TOKEN" \
  http://localhost:8123/api/services | jq -r \
  '.[] | .domain as $domain | .services | keys[] | "\($domain).\(.)"'
```

Call supported domain reloads with `POST /api/services/<domain>/reload`. Common examples:

```bash
for domain in input_boolean input_datetime automation; do
  curl -sS -X POST \
    -H "Authorization: Bearer $HASS_LONG_LIVED_TOKEN" \
    -H "Content-Type: application/json" \
    "http://localhost:8123/api/services/$domain/reload" \
    -d '{}'
done
```

Prefer targeted reloads to minimize disruption. Restart only when changed integration lacks reload support or reload fails, and state reason explicitly.
