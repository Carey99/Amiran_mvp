import { AppLayout } from '@/layouts/app-layout';

export default function Reports() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-600">View and generate system reports</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <span className="material-icons text-primary">people</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Student Report</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View statistics on student registrations, completions, and dropouts.</p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <span className="material-icons text-success">monetization_on</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Financial Report</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View income, payments, outstanding balances, and revenue trends.</p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm">
            Generate Report
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <span className="material-icons text-purple-600">insert_chart</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Performance Report</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">View instructor performance, course completion rates, and feedback.</p>
          <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm">
            Generate Report
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Reports</h2>
        </div>
        
        <div className="p-5">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <span className="material-icons text-gray-400 text-2xl">description</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports generated yet</h3>
            <p className="text-sm text-gray-500">Generate your first report to view insights about your driving school</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
