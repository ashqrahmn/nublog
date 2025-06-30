import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';
import SubscriptionTable from '../table/SubscriptionTable';

const Subscription = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.get('/email', {
          headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmails(response.data.emails);
    } catch (error) {
      toast.error('Failed to fetch emails');
    }
  };

  const deleteEmail = async (mongoId) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.delete('/email', {
        params: { id: mongoId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        toast.success(response.data.msg);
        fetchEmails();
      } else {
        toast.error('Error deleting email');
      }
    } catch (error) {
      toast.error('Request failed');
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1 className='text-xl font-semibold text-gray-700 mb-4'>All Subscriptions</h1>
      <div className='relative h-[70vh] max-w-[850px] overflow-x-auto border border-gray-300 rounded-lg shadow-sm'>
        <table className='w-full text-sm text-gray-700'>
          <thead className='text-xs text-white uppercase bg-bangladesh-green'>
            <tr>
              <th className='px-6 py-4 text-left'>Email</th>
              <th className='px-6 py-4 text-left hidden sm:table-cell'>Date</th>
              <th className='px-6 py-4 text-left'>Action</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((item) => (
              <SubscriptionTable
                key={item._id}
                mongoId={item._id}
                deleteEmail={deleteEmail}
                email={item.email}
                date={item.date}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscription;