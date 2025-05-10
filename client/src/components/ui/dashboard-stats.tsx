import { Stats } from '@/types';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  change?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
}

const StatsCard = ({ title, value, icon, iconBgColor, iconColor, change, subtitle }: StatsCardProps) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center`}>
        <span className={`material-icons ${iconColor}`}>{icon}</span>
      </div>
    </div>
    {(change || subtitle) && (
      <div className="mt-4 flex items-center text-sm">
        {change && (
          <span className={`${change.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            <span className="material-icons text-sm">
              {change.isPositive ? 'arrow_upward' : 'arrow_downward'}
            </span>
            <span className="ml-1">{change.value}</span>
          </span>
        )}
        {subtitle && <span className="text-gray-500 ml-2">{subtitle}</span>}
      </div>
    )}
  </div>
);

interface DashboardStatsProps {
  stats: Stats;
  isLoading: boolean;
}

export function DashboardStats({ stats, isLoading }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-5 animate-pulse">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            </div>
            <div className="mt-4 h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="Total Students"
        value={stats.totalStudents}
        icon="people"
        iconBgColor="bg-blue-100"
        iconColor="text-primary"
        change={{ value: "12%", isPositive: true }}
        subtitle="from last month"
      />
      
      <StatsCard
        title="Active Students"
        value={stats.activeStudents}
        icon="school"
        iconBgColor="bg-green-100"
        iconColor="text-success"
        change={{ value: "5%", isPositive: true }}
        subtitle="from last week"
      />
      
      <StatsCard
        title="Instructors"
        value={stats.instructors}
        icon="supervisor_account"
        iconBgColor="bg-orange-100"
        iconColor="text-secondary"
        subtitle="No change"
      />
      
      <StatsCard
        title="Revenue (MTD)"
        value={formatCurrency(stats.revenue)}
        icon="monetization_on"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        change={{ value: "8%", isPositive: true }}
        subtitle="from previous month"
      />
    </div>
  );
}
