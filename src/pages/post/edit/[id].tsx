import { Box, Button } from '@chakra-ui/core';
import { Formik, Form } from 'formik';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { InputField } from '../../../components/InputField';
import { Layout } from '../../../components/Layout';
import { createUrqlClient } from '../../../utils/createUrqlClient';
import { useRouter } from 'next/router';
import {
  usePostQuery,
  useUpdatePostMutation,
} from '../../../generated/graphql';
import { useGetIntId } from '../../../utils/useGetIntId';
import { withApollo } from '../../../utils/withApollo';

const EditPost = ({}) => {
  const router = useRouter();
  const intId = useGetIntId();
  //for Apollo remove array []change fetching to loading replace pause with skip
  const { data, loading } = usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
  //for Apollo remove preceding ,
  const [updatePost] = useUpdatePostMutation();
  if (loading) {
    return (
      <Layout>
        <div>...loading</div>
      </Layout>
    );
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          //add variables:
          await updatePost({ variables: { id: intId, ...values } });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

//export default withUrqlClient(createUrqlClient)(EditPost);
export default withApollo({ ssr: false })(EditPost);
