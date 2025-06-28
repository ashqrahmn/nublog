const BlogTable = ({ authorImg, title, author, date, deleteBlog, mongoId }) => {
  const BlogDate = new Date(date);

  return (
    <tr className="bg-white border-b hover:bg-bangladesh-green/5">
      <th
        scope="row"
        className="items-center gap-3 hidden sm:flex px-6 py-4 font-medium text-gray-700 whitespace-nowrap"
      >
        <img
          src={authorImg}
          alt={author || 'Author Image'}
          className="w-10 h-10 rounded-full object-cover"
        />
        <p>{author || 'No author'}</p>
      </th>
      <td className="px-6 py-4">
        {title
          ? `${title.slice(0, 15)}${title.length > 20 ? '...' : ''}`
          : 'No title'}
      </td>
      <td className="px-6 py-4">{BlogDate.toDateString()}</td>
      <td
        onClick={() => deleteBlog(mongoId)}
        className="px-6 py-4 text-red-600 hover:underline hover:text-red-700 text-sm cursor-pointer"
      >
        Delete
      </td>
    </tr>
  );
};

export default BlogTable;