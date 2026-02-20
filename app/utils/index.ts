export const nextSquareState = (value: string) => {
  if (value == "0") return "1";
  if (value == "1") return "X";
  if (value == "X") return "0";
  return "0";
};
