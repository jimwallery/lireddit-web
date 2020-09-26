import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { ColorModeProvider, CSSReset, ThemeProvider } from '@chakra-ui/core';
import { PaginatedPosts } from '../generated/graphql';
import theme from '../theme';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL as string,
  credentials: 'include',
  //with Apollo Merge Function we add to our InMemoryCache
  // https://www.apollographql.com/docs/react/caching/cache-field-behavior/#the-merge-function
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              console.log(existing, incoming);
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
});

function MyApp({ Component, pageProps }: any) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <ColorModeProvider>
          <CSSReset />
          <Component {...pageProps} />
        </ColorModeProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
