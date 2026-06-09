import { PostState } from "../types";

export const buildPostStateCondition = ({
  state,
  conditionsLength = 0,
  tableColumnName = "posts.state",
}: {
  state: PostState;
  conditionsLength?: number;
  tableColumnName?: string;
}) => {
  if (state === PostState.all) {
    return `${tableColumnName} IN ('published', 'draft')`;
  }
  return `${tableColumnName} = $${conditionsLength + 1}`;
};
