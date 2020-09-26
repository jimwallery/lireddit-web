import React from 'react';
import { Box, IconButton, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  //for Apollo remove array[]
  const { data: meData } = useMeQuery();
  //for Apollo remove preceding ,
  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton as={Link} mr={4} icon="edit" aria-label="Edit Post" />
      </NextLink>
      <IconButton
        icon="delete"
        aria-label="Delete Post"
        onClick={() => {
          //for Apollo have to say variables:
          deletePost({
            variables: { id },
            update: (cache) => {
              //Apollo calls evict: Urql calls invalidate
              cache.evict({ id: 'Post:' + id });
            },
          });
          // variables: { id },
          // update: (cache) => {
          //   // Post:77
          //   cache.evict({ id: 'Post:' + id });
          // },
          //   });
        }}
      />
    </Box>
  );
};
