import { defaultFetchState } from "@/constants/fetch-states";
import { findCommentsForPost, findPost, findPosts } from "@/db/queries/post.queries";
import { getErrorDetails } from "../utils";
import { RequestGenericReturn } from "@/db/types";

export const getPostWithComments = async (id: string) => {
  try {
    const postWithAuth = await findPost(id);
    const comments = await findCommentsForPost(id);

    return {
      data: {
        post: postWithAuth,
        comments,
      },
      ...defaultFetchState,
    } satisfies RequestGenericReturn;
  } catch (err) {
    const genericMessage = "Failed to fetch a post.";
    const details = err instanceof Error ? err.message : genericMessage;
    return {
      post: null,
      comments: null,
      message: genericMessage,
      details,
      error: err,
    };
  }
};

export const getPosts = async (cursor: string) => {
  try {
    const data = await findPosts(cursor);
    return {
      data,
      ...defaultFetchState,
    };
  } catch (error) {
    const genericMessage = "Failed to fetch posts.";
    const details = getErrorDetails({ error, defaultMessage: genericMessage });
    return {
      data: null,
      error,
      details,
      message: genericMessage,
    } satisfies RequestGenericReturn;
  }
};
