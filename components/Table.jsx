import React, { useState } from 'react';

const Table = ({
  headersMap,
  rows,
  actions = [],
  selectable = false,
  onSelectChange,
  selected = [],
  recordsPerPage = 20,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(rows.length / recordsPerPage);

  const currentSelected = new Set(selected);

  console.log(selected);
  console.log(currentSelected);

  const handleSelectChange = (id) => {
    const newSelected = new Set(currentSelected);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    onSelectChange(newSelected);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRows = rows.slice(startIndex, endIndex);

  const headers = Array.from(headersMap.keys());
  const rowKeys = Array.from(headersMap.values());

  return (
    <div className="p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && <th className="px-6 py-3"><input type="checkbox" /></th>}
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
            {actions.length > 0 && <th className="px-6 py-3"></th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {selectable && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={currentSelected.has(row.id)}
                    onChange={(e) => handleSelectChange(row.id)}
                  />
                </td>
              )}
              {rowKeys.map((key, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row[key]}
                </td>
              ))}
              {actions.length > 0 && <td className="px-6 py-4 whitespace-nowrap flex justify-between">
                {actions.map((action, actionIndex) => (
                  <button key={actionIndex} className="w-full bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => action.onAction(row.id)}>{action.label}</button>
                ))}
              </td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
