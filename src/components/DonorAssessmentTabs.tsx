import React, { useState } from 'react';

const DonorAssessmentTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'register'>('available');

  const renderAvailableDonors = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Available Donors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blood Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Donation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">John Smith</td>
              <td className="px-6 py-4 whitespace-nowrap">O+</td>
              <td className="px-6 py-4 whitespace-nowrap">2023-05-15</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Eligible
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <button className="mr-2 hover:underline">View</button>
                <button className="hover:underline">Select</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Maria Garcia</td>
              <td className="px-6 py-4 whitespace-nowrap">A-</td>
              <td className="px-6 py-4 whitespace-nowrap">2023-08-22</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Eligible
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <button className="mr-2 hover:underline">View</button>
                <button className="hover:underline">Select</button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">Robert Johnson</td>
              <td className="px-6 py-4 whitespace-nowrap">B+</td>
              <td className="px-6 py-4 whitespace-nowrap">2023-01-30</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                <button className="mr-2 hover:underline">View</button>
                <button className="hover:underline">Select</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Register New Donor</h2>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter last name"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Donation Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Health Conditions</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="List any health conditions or medications"
          ></textarea>
        </div>
        
        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
            I confirm that all information provided is accurate
          </label>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Register Donor
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Donor Assessment</h1>
      
      <div className="w-full">
        <div className="grid w-full grid-cols-2 bg-gray-100 rounded-t-lg overflow-hidden">
          <button
            onClick={() => setActiveTab('available')}
            className={`py-3 px-4 text-center font-medium ${
              activeTab === 'available' 
                ? 'bg-white text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            View Available Donors
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 px-4 text-center font-medium ${
              activeTab === 'register' 
                ? 'bg-white text-blue-600' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Register New Donor
          </button>
        </div>
        
        <div className="bg-gray-50 p-1 rounded-b-lg shadow">
          {activeTab === 'available' && renderAvailableDonors()}
          {activeTab === 'register' && renderRegisterForm()}
        </div>
      </div>
    </div>
  );
};

export default DonorAssessmentTabs;