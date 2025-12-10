import { defaultFetchState } from "@/constants/fetch-states";
import { findCommentsForPost, findPost, findPosts } from "@/db/queries/post.queries";
import { getErrorDetails } from "../utils";
import { RequestGenericReturn } from "@/db/types";

export const getPostWithComments = async (id: number) => {
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
  } catch (error) {
    const genericMessage = "Failed to fetch a post.";
    const details = getErrorDetails({ error, defaultMessage: genericMessage });
    return {
      data: null,
      message: genericMessage,
      details,
      error,
    };
  }
};

export const getPosts = async (cursor?: number) => {
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
