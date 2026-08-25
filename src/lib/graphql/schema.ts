import { createSchema, createYoga } from "graphql-yoga";
import { getCase, getCaseStats, listCaseIds, listTopTemplates } from "@/lib/contracts";
import { paginateWithCursor } from "@/lib/utils";

const typeDefs = /* GraphQL */ `
  type CaseItem {
    url: String!
    content_hash: String!
    preview: String
    status: String!
  }

  type Case {
    case_id: String!
    tampered: Boolean
    items: [CaseItem!]
  }

  type CasePage {
    ids: [String!]!
    total: Int!
    nextCursor: String
  }

  type CaseSummary {
    total: Int!
    clean: Int!
    tampered: Int!
  }

  type Template {
    id: String!
    title: String!
    score: Float!
    uses: Int!
    tags: [String!]
  }

  type Query {
    cases(cursor: String, limit: Int = 20): CasePage!
    case(id: ID!): Case
    summary: CaseSummary!
    templates(limit: Int = 20): [Template!]!
  }
`;

const resolvers = {
  Query: {
    cases: async (_: unknown, args: { cursor?: string | null; limit?: number }) => {
      const all = await listCaseIds();
      const page = paginateWithCursor(all, args.cursor ?? null, args.limit ?? 20);
      return { ids: page.items, total: page.total, nextCursor: page.nextCursor };
    },
    case: async (_: unknown, args: { id: string }) => getCase(args.id),
    summary: async () => {
      const [ids, stats] = await Promise.all([listCaseIds(), getCaseStats()]);
      return {
        total: ids.length,
        clean: stats?.clean ?? 0,
        tampered: stats?.tampered ?? 0,
      };
    },
    templates: async (_: unknown, args: { limit?: number }) => {
      const res = await listTopTemplates(args.limit ?? 20);
      return res.items ?? [];
    },
  },
};

const yoga = createYoga({
  schema: createSchema({ typeDefs, resolvers }),
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

export { yoga as graphqlHandler };
