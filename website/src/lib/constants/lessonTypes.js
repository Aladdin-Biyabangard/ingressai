import { Blend, Monitor, Users } from "lucide-react";

export const lessonTypes = [
  { value: "ONLINE", label: "online" },
  { value: "IN_CLASS", label: "inClass" },
  { value: "HYBRID", label: "hybrid" },
];

export const LESSON_TYPES_ENUM = {
  IN_CLASS: "inClass",
  ONLINE: "online",
  HYBRID: "hybrid",
};


export const LESSON_TYPES_ICON = {
  IN_CLASS: <Users size={20}/>,
  ONLINE: <Monitor size={20}/>,
  HYBRID: <Blend size={20}/>,
}