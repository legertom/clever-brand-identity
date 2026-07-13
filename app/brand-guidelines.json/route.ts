import { renderJson } from "../../src/brand";
import { baseUrlFromRequest } from "../../src/base-url";

export function GET(request: Request) {
  return Response.json(renderJson(baseUrlFromRequest(request)));
}
