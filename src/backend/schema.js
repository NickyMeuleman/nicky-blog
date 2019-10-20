import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type Query {
    hello: String
    allBlogPosts: [BlogPost]!
    blogPostBySlug(slug: String!): BlogPost
  }
  type Mutation {
    updateBlogPost(slug: String!, updates: UpdateBlogPostInput!): BlogPost
    createBlogPost(slug: String!): BlogPost
    deleteBlogPost(slug: String!): BlogPost
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
