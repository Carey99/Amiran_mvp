import { AppLayout } from '@/layouts/app-layout';

export default function Branches() {
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
        <p className="mt-1 text-sm text-gray-600">Manage school branches and locations</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <span className="material-icons text-gray-400 text-2xl">store</span>
          </div>
          <h2 className="text-xl font-medium text-gray-900 mb-2">No branches added yet</h2>
          <p className="text-gray-500 mb-4">Add your first branch to expand your driving school</p>
          <button className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md flex items-center mx-auto">
            <span className="material-icons text-sm mr-1">add</span>
            <span>Add Branch</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
