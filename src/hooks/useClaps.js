import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

function useClaps(slugArray) {
  const result = useQuery(
    gql`
      query getClaps($slugs: [String!]!) {
        blogPostsBySlug(slugs: $slugs) {
          slug
          likes
        }
      }
    `,
    { variables: { slugs: slugArray } }
  );
  return result;
}

export default useClaps;
