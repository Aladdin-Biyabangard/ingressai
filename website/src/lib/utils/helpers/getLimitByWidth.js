import { instructorsBreakpoints } from "@/lib/constants/instructorsBreakpoints";

export const getLimitByWidth = (width) => {
  return instructorsBreakpoints.find((bp) => width <= bp.max).value;
};
