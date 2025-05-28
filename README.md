# Jitok

Jitsi token generator API and UI

- [API](/api)
- [UI](/ui)

## Demo

[jitok.emrah.com](https://jitok.emrah.com/)

## API Payload

- `alg`: "HS256" | "HS512"
  \
  _default_: `HS256`
- `secret`: string
  \
  _required_
- `aud`: string
  \
  _required_
- `iss`: string
  \
  _default_: _the_ `aud` _value_
- `sub`: string
  \
  _default_: `*`
- `room`: string
  \
  _default_: `*`
- `nbf`: number | string (formatted date)
  \
  _default_: `0` _sec_
- `exp`: number | string (formatted date)
  \
  _default_: `3600` _sec_
- `cntx_user_id`: string
- `cntx_user_name`: string
- `cntx_user_email`: string
- `cntx_user_avatar`: string
  \
  _e.g. https://mydomain.com/images/myavatar.png_
- `cntx_user_affi`: "owner" | "member"
- `cntx_user_lobby_bypass`: 0 | 1
- `cntx_user_security_bypass`: 0 | 1
- `cntx_room_lobby`: 0 | 1
- `cntx_room_lobby_autostart`: 0 | 1
- `cntx_room_password`: string
- `cntx_feat_rec`: 0 | 1
- `cntx_feat_live`: 0 | 1
- `cntx_feat_screen`: 0 | 1
- `cntx_feat_transcription`: 0 | 1

#### curl example

```bash
JSON=$(cat <<EOF
{
  "alg":"HS256",
  "secret":"myappsecret",
  "aud":"myappid",
  "room":"*",
  "nbf":"2022-10-15T15:00+02:00",
  "exp":"2022-10-15T16:30+02:00",
  "cntx_user_id":"1ceb7fbc-beef-42a7-9ca1-a79a042fcba8",
  "cntx_user_name":"myname"
}
EOF
)

curl -H "Content-Type: application/json" -d "$JSON" https://jitok.emrah.com/api
```
