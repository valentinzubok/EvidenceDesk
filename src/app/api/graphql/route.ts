import { graphqlHandler } from "@/lib/graphql/schema";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return graphqlHandler.fetch(request);
}

export async function POST(request: Request) {
  return graphqlHandler.fetch(request);
}
