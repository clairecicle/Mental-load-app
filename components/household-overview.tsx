"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Plus, Settings, TrendingUp, CheckCircle2, Clock } from "lucide-react"

export function HouseholdOverview() {
  const householdMembers = [
    {
      id: "1",
      name: "Alice Johnson",
      avatar: "AJ",
      tasksCompleted: 12,
      tasksTotal: 15,
      streak: 7,
      role: "admin",
    },
    {
      id: "2",
      name: "Bob Smith",
      avatar: "BS",
      tasksCompleted: 8,
      tasksTotal: 12,
      streak: 3,
      role: "member",
    },
  ]

  const domains = [
    {
      id: "1",
      name: "Kitchen Management",
      owner: "Alice",
      tasksTotal: 8,
      tasksCompleted: 6,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "2",
      name: "Pet Care",
      owner: "Bob",
      tasksTotal: 5,
      tasksCompleted: 4,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: "3",
      name: "Bills & Finance",
      owner: "Alice",
      tasksTotal: 4,
      tasksCompleted: 2,
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const recentActivity = [
    {
      id: "1",
      user: "Bob",
      avatar: "BS",
      action: "completed",
      task: "Walk Max",
      time: "2 hours ago",
    },
    {
      id: "2",
      user: "Alice",
      avatar: "AJ",
      action: "created",
      task: "Schedule dentist appointment",
      time: "4 hours ago",
    },
    {
      id: "3",
      user: "Bob",
      avatar: "BS",
      action: "snoozed",
      task: "Clean garage",
      time: "1 day ago",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-gray-600" />
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Household</h1>
              <p className="text-sm text-gray-500">The Johnson-Smith Family</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Invite
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Household Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">20</div>
                    <div className="text-sm text-gray-500">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">7</div>
                    <div className="text-sm text-gray-500">Tasks Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Members */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium">Members</h2>
              {householdMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{member.name}</h3>
                          {member.role === "admin" && (
                            <Badge variant="secondary" className="text-xs">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>
                              {member.tasksCompleted}/{member.tasksTotal} tasks
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">🔥 {member.streak} day streak</div>
                        </div>
                        <Progress value={(member.tasksCompleted / member.tasksTotal) * 100} className="mt-2 h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="domains" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Task Domains</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Domain
              </Button>
            </div>

            {domains.map((domain) => (
              <Card key={domain.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge className={domain.color}>{domain.name}</Badge>
                      <span className="text-sm text-gray-500">by {domain.owner}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {domain.tasksCompleted}/{domain.tasksTotal}
                    </span>
                  </div>
                  <Progress value={(domain.tasksCompleted / domain.tasksTotal) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="space-y-3 mt-4">
            <h2 className="text-lg font-medium">Recent Activity</h2>

            {recentActivity.map((activity) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        <span className="text-gray-600"> {activity.action} </span>
                        <span className="font-medium">"{activity.task}"</span>
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
