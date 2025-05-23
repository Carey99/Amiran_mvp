import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;
import { AppLayout } from "@/layouts/app-layout";

export default function Settings() {
  const [settings, setSettings] = useState({
    schoolName: "Amiran Driving School",
    contactEmail: "",
    contactPhone: "+254 708 538 416",
    schoolAddress: "Kahawa Sukari stage 160 (Mwihoko)",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch settings from the backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/settings");
        setSettings(response.data || {});
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Failed to load settings. Please try again later.");
      }
    };

    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  // Save settings to the backend
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/settings", settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Configure application settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                <input
                  type="text"
                  name="schoolName"
                  value={settings.schoolName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School Address</label>
                <textarea
                  rows={3}
                  name="schoolAddress"
                  value={settings.schoolAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Database Settings</h2>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <span className="material-icons text-success">check_circle</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">MongoDB Atlas Connected</h3>
                  <p className="text-xs text-gray-500 mt-1">Your application is successfully connected to MongoDB Atlas</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">MongoDB Connection URI</label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value="mongodb+srv://********@cluster0.mongodb.net/amiran_driving_db"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                  />
                  <button className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                    <span className="material-icons text-sm">visibility</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Connection string is hidden for security reasons</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                <input
                  type="text"
                  disabled
                  value="amiran_driving_db"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                />
              </div>
            </div>
            
            <div className="mt-6 flex items-center space-x-3">
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center">
                <span className="material-icons text-sm mr-1">backup</span>
                <span>Backup Database</span>
              </button>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md flex items-center">
                <span className="material-icons text-sm mr-1">restore</span>
                <span>Restore From Backup</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Management</h2>
            
            <nav className="space-y-1">
              <a href="#" className="block px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-900">
                Manage Admins
              </a>
              <a href="#" className="block px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Roles and Permissions
              </a>
              <a href="#" className="block px-3 py-2 text-sm rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                Access Control
              </a>
            </nav>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">System Information</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Database</span>
                <span className="font-medium">MongoDB Atlas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Environment</span>
                <span className="font-medium">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Update</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
