import { AppLayout } from '@/layouts/app-layout';
import { DashboardStats } from '@/components/ui/dashboard-stats';
import { RecentActivity } from '@/components/ui/recent-activity';
import { StudentTable } from '@/components/ui/student-table';
import { MongoConnection } from '@/components/ui/mongo-connection';
import { useStats } from '@/hooks/use-stats';
import { useActiveStudents } from '@/hooks/use-students';
import { useRecentActivities } from '@/hooks/use-activities';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: activeStudents, isLoading: studentsLoading } = useActiveStudents();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivities();

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome to Amiran Driving School Management System</p>
      </div>

      {/* Stats Cards */}
      <DashboardStats 
        stats={stats || { totalStudents: 0, activeStudents: 0, instructors: 0, revenue: 0 }}
        isLoading={statsLoading}
      />

      {/* Recent Activity & Students Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <RecentActivity 
            activities={activities || []}
            isLoading={activitiesLoading}
          />
        </div>

        {/* Students Table */}
        <div className="lg:col-span-2">
          <StudentTable 
            students={activeStudents || []}
            isLoading={studentsLoading}
          />
        </div>
      </div>

      {/* MongoDB Connection Status */}
      <MongoConnection />
    </AppLayout>
  );
}
