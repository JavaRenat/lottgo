export const useGenres = (selectedGenres) => {
  if (selectedGenres.length < 1) return "";
  const select = selectedGenres.map((g) => g.id);
  return select.reduce((pre, curr) => pre + "," + curr);
};
