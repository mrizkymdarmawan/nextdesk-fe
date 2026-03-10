import {
  Users,
  MapPin,
  CalendarCheck,
  Wallet,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AttendanceChart } from './_components/attendance-chart'

const stats = [
  {
    label: 'Total Employees',
    value: '48',
    change: '+3 this month',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Active Projects',
    value: '7',
    change: '+1 this month',
    trend: 'up',
    icon: MapPin,
  },
  {
    label: 'Attendance Rate',
    value: '94.2%',
    change: '-1.3% vs last month',
    trend: 'down',
    icon: CalendarCheck,
  },
  {
    label: 'Payroll This Month',
    value: 'Rp 124.5jt',
    change: '+Rp 3.2jt vs last month',
    trend: 'up',
    icon: Wallet,
  },
]

const recentEmployees = [
  { name: 'Budi Santoso', role: 'hr_admin', project: 'Kantor Pusat', status: 'active' },
  { name: 'Siti Rahayu', role: 'employee', project: 'Cabang Bandung', status: 'active' },
  { name: 'Andi Wijaya', role: 'project_manager', project: 'Cabang Surabaya', status: 'active' },
  { name: 'Dewi Kusuma', role: 'hr_staff', project: 'Kantor Pusat', status: 'active' },
  { name: 'Rudi Hermawan', role: 'employee', project: 'Cabang Bandung', status: 'inactive' },
]

const recentAttendance = [
  { name: 'Budi Santoso', checkIn: '07:52', checkOut: '17:05', status: 'present', project: 'Kantor Pusat' },
  { name: 'Siti Rahayu', checkIn: '08:10', checkOut: '17:00', status: 'present', project: 'Cabang Bandung' },
  { name: 'Andi Wijaya', checkIn: '09:15', checkOut: '—', status: 'late', project: 'Cabang Surabaya' },
  { name: 'Dewi Kusuma', checkIn: '—', checkOut: '—', status: 'absent', project: 'Kantor Pusat' },
  { name: 'Rudi Hermawan', checkIn: '07:45', checkOut: '17:00', status: 'present', project: 'Cabang Bandung' },
]

const statusBadge: Record<string, string> = {
  present: 'bg-green-500/10 text-green-700 dark:text-green-400',
  late: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  absent: 'bg-red-500/10 text-red-700 dark:text-red-400',
  active: 'bg-green-500/10 text-green-700 dark:text-green-400',
  inactive: 'bg-muted text-muted-foreground',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your office operations today.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`mt-1 flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {stat.trend === 'up'
                  ? <TrendingUp className="h-3 w-3" />
                  : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Tables */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Attendance Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Daily attendance rate for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Today&apos;s Summary</CardTitle>
            <CardDescription>Attendance breakdown for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Present', value: 38, color: 'bg-green-500' },
              { label: 'Late', value: 5, color: 'bg-yellow-500' },
              { label: 'Absent', value: 5, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${item.color}`} />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">{item.value} employees</span>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Total</span>
                <span>48 employees</span>
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-secondary">
                <div className="bg-green-500" style={{ width: '79%' }} />
                <div className="bg-yellow-500" style={{ width: '10%' }} />
                <div className="bg-red-500" style={{ width: '11%' }} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Employees / Attendance */}
      <Tabs defaultValue="attendance">
        <TabsList>
          <TabsTrigger value="attendance">Recent Attendance</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Recent Attendance</CardTitle>
              <CardDescription>Today&apos;s check-in records across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttendance.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.project}</TableCell>
                      <TableCell>{row.checkIn}</TableCell>
                      <TableCell>{row.checkOut}</TableCell>
                      <TableCell>
                        <Badge className={`${statusBadge[row.status]} border-0 capitalize`} variant="outline">
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader>
              <CardTitle>Employees</CardTitle>
              <CardDescription>Recently added team members</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmployees.map((row) => (
                    <TableRow key={row.name}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground capitalize">{row.role.replace('_', ' ')}</TableCell>
                      <TableCell className="text-muted-foreground">{row.project}</TableCell>
                      <TableCell>
                        <Badge className={`${statusBadge[row.status]} border-0 capitalize`} variant="outline">
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
