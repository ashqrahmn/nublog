const CategoryTable = ({ id, name, handleDelete }) => {
  return (
    <tr className="bg-white border-b hover:bg-bangladesh-green/5 transition">
      <td className="px-6 py-4 font-medium text-gray-700">{name}</td>
      <td
        onClick={() => handleDelete(id)}
        className="px-6 py-4 text-red-600 hover:underline hover:text-red-700 text-sm cursor-pointer"
      >
        Delete
      </td>
    </tr>
  );
};

export default CategoryTable;