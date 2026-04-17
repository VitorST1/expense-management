import { paraglideMiddleware } from "./paraglide/server.js"
import handler from "@tanstack/react-start/server-entry"

type SrvxRequest = Request & { _request?: Request }

export default {
  fetch(req: Request): Promise<Response> {
    // TanStack Start dev uses srvx's Request wrapper; unwrap it so Paraglide can clone a native Request.
    const request = (req as SrvxRequest)._request ?? req

    return paraglideMiddleware(request, ({ request }) => handler.fetch(request))
  },
}
