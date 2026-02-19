export const INTEREST_TAGS = [
  "Coding",
  "Hackathon",
  "Workshop",
  "Seminar",
  "Sports",
  "Dance",
  "Music",
  "Art",
  "Photography",
  "Literature",
  "Debate",
  "Quiz",
  "Robotics",
  "AI/ML",
  "Web Development",
  "Cultural",
  "Fest",
  "Networking",
] as const;

export type InterestTag = (typeof INTEREST_TAGS)[number];

export const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
  "Chemical Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
] as const;

export type Department = (typeof DEPARTMENTS)[number];
