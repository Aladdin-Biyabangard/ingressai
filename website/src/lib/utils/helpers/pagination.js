export const getPageable = (array, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = array.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(array.length / itemsPerPage);
  return { currentItems, totalPages };
};
