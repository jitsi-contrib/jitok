#### configuration

Update `API_URL` in [src/lib/config.ts](/ui/src/lib/config.ts) according to your
environment.

```javascript
export const API_URL = "http://127.0.0.1:9000/api";
```

#### running (dev)

```bash
npm run dev -- --host --port 3000
```

#### running (prod)

```bash
npm run build
node build/index.js
```
