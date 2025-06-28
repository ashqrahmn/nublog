const SubscriptionTable = ({ email, mongoId, date, deleteEmail }) => {
  const emailDate = new Date(date);

  return (
    <tr className='bg-white border-b text-left hover:bg-bangladesh-green/5 transition'>
      <th scope='row' className='px-6 py-4 font-medium text-gray-700 whitespace-nowrap'>
        {email || 'No Email'}
      </th>
      <td className='px-6 py-4 hidden sm:table-cell'>{emailDate.toDateString()}</td>
      <td
        className='px-6 py-4 text-red-600 hover:underline hover:text-red-700 text-sm cursor-pointer'
        onClick={() => deleteEmail(mongoId)}
      >
        Delete
      </td>
    </tr>
  );
};

export default SubscriptionTable;