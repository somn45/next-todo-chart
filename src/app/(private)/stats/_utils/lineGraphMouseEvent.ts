import * as d3 from "d3";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FollowElements = d3.Selection<any, unknown, any, unknown>;

export const displayFollowElement = (followElements: FollowElements[]) => {
  followElements.forEach(element => element.style("opacity", 1));
};

export const hiddenFollowElement = (followElements: FollowElements[]) => {
  followElements.forEach(element => element.style("opacity", 0));
};
