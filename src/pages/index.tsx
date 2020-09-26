import { Box, Button, Flex, Heading, Link, Stack, Text } from '@chakra-ui/core';
import NextLink from 'next/link';
import { EditDeletePostButtons } from '../components/EditDeletePostButtons';
import { Layout } from '../components/Layout';
import { UpdootSection } from '../components/UpdootSection';
import { usePostsQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const Index = () => {
  // const [variables, setVariables] = useState({
  //   // limit: 15,
  //   // cursor: null as null | string,
  // });
  //removed array around the const for Apollo and fetching is called loading
  //also some changes above and now variables, changes moved from above and added fetchMore
  const { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  //const [, deletePost] = useDeletePostMutation({});
  //console.log(variables);

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>${error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      {loading && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            !p ? null : (
              <Flex key={p.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={p} />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text>posted by: {p.creator.username}</Text>
                  <Flex align="center">
                    <Text flex={1} mt={4}>
                      {p.textSnippet}
                    </Text>

                    <Box ml="auto">
                      <EditDeletePostButtons
                        id={p.id}
                        creatorId={p.creator.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            )
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              //With Apollo added fetchMore and variables and limit: variables add ? cuz undefined sometimes
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
                //With Apollo using the Apollo Merge Function we comment out
                // updateQuery: (
                //   previousValue,
                //   { fetchMoreResult }
                // ): PostsQuery => {
                //   if (!fetchMoreResult) {
                //     return previousValue as PostsQuery;
                //   }
                //   return {
                //     __typename: 'Query',
                //     posts: {
                //       __typename: 'PaginatedPosts',
                //       hasMore: (fetchMoreResult as PostsQuery).posts.hasMore,
                //       posts: [
                //         ...(previousValue as PostsQuery).posts.posts,
                //         ...(fetchMoreResult as PostsQuery).posts.posts,
                //       ],
                //     },
                //   };
                // },
              });
              // setVariables({
              //   limit: variables.limit,
              //   cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              // });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};
//export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
export default withApollo({ ssr: true })(Index);
