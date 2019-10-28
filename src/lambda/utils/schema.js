import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type Query {
    hello: String
    allBlogPosts: [BlogPost]!
    blogPostBySlug(slug: String!): BlogPost
    blogPostsBySlug(slugs: [String!]!): [BlogPost]
  }
  type Mutation {
    updateBlogPost(slug: String!, updates: UpdateBlogPostInput!): BlogPost
    createBlogPost(slug: String!): BlogPost
    deleteBlogPost(slug: String!): BlogPost
    addClaps(slug: String!, increment: Int!): BlogPost
  }
  type BlogPost {
    slug: String!
    likes: Int
  }
  input UpdateBlogPostInput {
    likes: Int
  }
`;

export default typeDefs;
