import { renderTokensJson } from "../../src/brand";
import { baseUrlFromRequest } from "../../src/base-url";

export function GET(request: Request) {
  return Response.json(renderTokensJson(baseUrlFromRequest(request)));
}
