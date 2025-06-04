"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Plus, CheckCircle2, Clock, Link, Camera } from "lucide-react"
import { useRouter } from "next/navigation"
import NextLink from "next/link"

interface DomainDetailProps {
  domainId: string
}

export function DomainDetail({ domainId }: DomainDetailProps) {
  const router = useRouter()

  // Mock data - in real app, fetch based on domainId
  const domain = {
    id: domainId,
    name: "Kitchen Management",
    description: "All tasks related to kitchen cleaning, maintenance, and organization",
    owner: "Alice",
    ownerAvatar: "AJ",
    color: "bg-green-100 text-green-800 border-green-200",
    links: ["https://example.com/kitchen-cleaning-tips", "https://example.com/organization-guide"],
    screenshots: [],
    createdAt: "2 weeks ago",
    lastUpdated: "2 days ago",
  }

  const tasks = [
    {
      id: "1",
      title: "Clean refrigerator",
      isCompleted: false,
      isOverdue: true,
      dueDate: "Today",
      owner: "Alice",
      ownerAvatar: "AJ",
      subtasks: 3,
    },
    {
      id: "2",
      title: "Organize pantry",
      isCompleted: true,
      isOverdue: false,
      dueDate: "Yesterday",
      owner: "Bob",
      ownerAvatar: "BS",
      subtasks: 2,
    },
    {
      id: "3",
      title: "Deep clean oven",
      isCompleted: false,
      isOverdue: false,
      dueDate: "Tomorrow",
      owner: "Alice",
      ownerAvatar: "AJ",
      subtasks: 1,
    },
    {
      id: "4",
      title: "Replace water filter",
      isCompleted: false,
      isOverdue: false,
      dueDate: "Next week",
      owner: "Bob",
      ownerAvatar: "BS",
      subtasks: 0,
    },
  ]

  const completedTasks = tasks.filter((task) => task.isCompleted)
  const pendingTasks = tasks.filter((task) => !task.isCompleted)
  const overdueTasks = tasks.filter((task) => task.isOverdue)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge className={domain.color}>{domain.name}</Badge>
            </div>
            <p className="text-sm text-gray-500">
              {tasks.length} tasks • {domain.owner}'s domain
            </p>
          </div>
          <NextLink href={`/domains/${domainId}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          </NextLink>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Domain Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{domain.ownerAvatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{domain.owner}</h3>
                <p className="text-sm text-gray-600">Domain Owner</p>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-4">{domain.description}</p>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span> {domain.createdAt}
              </div>
              <div>
                <span className="font-medium">Last updated:</span> {domain.lastUpdated}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold text-green-600">{completedTasks.length}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold text-gray-600">{pendingTasks.length}</div>
              <div className="text-xs text-gray-500">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold text-red-600">{overdueTasks.length}</div>
              <div className="text-xs text-gray-500">Overdue</div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Domain Tasks</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>
            </div>

            {tasks.map((task) => (
              <NextLink href={`/task/${task.id}`} key={task.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className={`h-5 w-5 mt-0.5 ${
                          task.isCompleted ? "text-green-600 fill-green-100" : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={`font-medium ${
                              task.isCompleted ? "line-through text-gray-500" : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.isOverdue && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{task.dueDate}</span>
                          </div>
                          {task.subtasks > 0 && <span>{task.subtasks} subtasks</span>}
                          <div className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-xs">{task.ownerAvatar}</AvatarFallback>
                            </Avatar>
                            <span>{task.owner}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </NextLink>
            ))}
          </TabsContent>

          <TabsContent value="resources" className="space-y-3 mt-4">
            <h2 className="text-lg font-medium">Domain Resources</h2>

            {domain.links.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Link className="h-4 w-4" />
                    Reference Links
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {domain.links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <Link className="h-4 w-4 text-gray-500" />
                      <a href={link} className="flex-1 text-sm text-blue-600 hover:underline truncate">
                        {link}
                      </a>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Screenshots & Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm">No images uploaded yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-3 mt-4">
            <h2 className="text-lg font-medium">Recent Activity</h2>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">BS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Bob</span> completed{" "}
                        <span className="font-medium">"Organize pantry"</span>
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">AJ</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">Alice</span> added{" "}
                        <span className="font-medium">"Replace water filter"</span>
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
