import React, { useState } from 'react';
import { Box, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';

import {
  PostSnippetFragment,
  PostsQuery,
  useDeletePostMutation,
  useMeQuery,
  useVoteMutation
} from '../generated/graphql';

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<'updoot-loading' | 'downdoot-loading' | 'not-loading'>('not-loading');
  const [, vote] = useVoteMutation();
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();
  console.log("post", post);
  console.log("meData", meData);
  return (
    <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
      <Flex direction="column" alignItems="center" mr={4}>
        <IconButton
          aria-label='updoot post'
          colorScheme={post.voteStatus === 1 ? 'green' : ''}
          icon={<ChevronUpIcon />}
          isLoading={loadingState === 'updoot-loading'}
          onClick={async () => {
            if (post.voteStatus !== 1) {
              setLoadingState('updoot-loading');
              await vote({ postId: post.id, value: 1 });
              setLoadingState('not-loading');
            }
          }}
          size="24px"
        />
        {post.points}
        <IconButton
          aria-label='downdoot post'
          colorScheme={post.voteStatus === -1 ? 'red' : ''}
          icon={<ChevronDownIcon />}
          isLoading={loadingState === 'downdoot-loading'}
          onClick={async () => {
            if (post.voteStatus !== -1) {
              setLoadingState('downdoot-loading');
              await vote({ postId: post.id, value: -1 });
              setLoadingState('not-loading');
            }
          }}
          size="24px"
        />
      </Flex>
      <Box flex={1}>
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Link>
            <Heading fontSize="xl">{post.title}</Heading>
          </Link>
        </NextLink>
        <Text>Posted by {post.creator.username}</Text>

        <Flex align="center">
          <Text flex={1} mt={4}>{post.textSnippet}</Text>
          { meData?.me?.id === post.creator.id ? <Box ml="auto">
            <NextLink href="/post/edit/[id]" as={`/post/edit/${post.id}`}>
              <IconButton mr={4} icon={<EditIcon/>} aria-label="Delete post" />
            </NextLink>

            <IconButton icon={<DeleteIcon/>} aria-label="Edit post" onClick={() => {
              deletePost({id: post.id});
            }} colorScheme="red"/>
          </Box> : null}
        </Flex>
      </Box>
    </Flex>
  );
}
