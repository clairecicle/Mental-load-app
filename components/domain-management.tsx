"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Plus, Search, MoreVertical, Edit, Trash2, Eye, Users, CheckCircle2, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function DomainManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const domains = [
    {
      id: "1",
      name: "Kitchen Management",
      description: "All tasks related to kitchen cleaning, maintenance, and organization",
      owner: "Alice",
      ownerAvatar: "AJ",
      ownerId: "1",
      tasksTotal: 8,
      tasksCompleted: 6,
      tasksOverdue: 1,
      color: "bg-green-100 text-green-800 border-green-200",
      lastUpdated: "2 days ago",
      hasLinks: true,
      hasScreenshots: false,
    },
    {
      id: "2",
      name: "Pet Care",
      description: "Taking care of our dog Max - walks, feeding, vet appointments",
      owner: "Bob",
      ownerAvatar: "BS",
      ownerId: "2",
      tasksTotal: 5,
      tasksCompleted: 4,
      tasksOverdue: 0,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      lastUpdated: "1 day ago",
      hasLinks: false,
      hasScreenshots: true,
    },
    {
      id: "3",
      name: "Bills & Finance",
      description: "Monthly bills, budget tracking, and financial planning",
      owner: "Alice",
      ownerAvatar: "AJ",
      ownerId: "1",
      tasksTotal: 4,
      tasksCompleted: 2,
      tasksOverdue: 1,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      lastUpdated: "5 days ago",
      hasLinks: true,
      hasScreenshots: false,
    },
    {
      id: "4",
      name: "Home Maintenance",
      description: "Repairs, seasonal maintenance, and home improvement projects",
      owner: "Bob",
      ownerAvatar: "BS",
      ownerId: "2",
      tasksTotal: 12,
      tasksCompleted: 8,
      tasksOverdue: 2,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      lastUpdated: "1 week ago",
      hasLinks: true,
      hasScreenshots: true,
    },
  ]

  const filteredDomains = domains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalTasks = domains.reduce((sum, domain) => sum + domain.tasksTotal, 0)
  const totalCompleted = domains.reduce((sum, domain) => sum + domain.tasksCompleted, 0)
  const totalOverdue = domains.reduce((sum, domain) => sum + domain.tasksOverdue, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Task Domains</h1>
            <p className="text-sm text-gray-500">
              {domains.length} domains • {totalTasks} total tasks
            </p>
          </div>
          <Link href="/domains/create">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Domain
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold text-green-600">{totalCompleted}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold text-gray-600">{totalTasks - totalCompleted}</div>
              <div className="text-xs text-gray-500">Remaining</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-lg font-semibold text-red-600">{totalOverdue}</div>
              <div className="text-xs text-gray-500">Overdue</div>
            </CardContent>
          </Card>
        </div>

        {/* Domains List */}
        <div className="space-y-3">
          {filteredDomains.map((domain) => (
            <Card key={domain.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={domain.color}>{domain.name}</Badge>
                      {domain.tasksOverdue > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {domain.tasksOverdue} overdue
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{domain.description}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>
                          {domain.tasksCompleted}/{domain.tasksTotal} tasks
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{domain.lastUpdated}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{domain.ownerAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-600">{domain.owner}</span>
                        {(domain.hasLinks || domain.hasScreenshots) && (
                          <div className="flex gap-1">
                            {domain.hasLinks && (
                              <Badge variant="outline" className="text-xs">
                                Links
                              </Badge>
                            )}
                            {domain.hasScreenshots && (
                              <Badge variant="outline" className="text-xs">
                                Photos
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <Link href={`/domains/${domain.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/domains/${domain.id}/edit`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Domain
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Change Owner
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Domain
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round((domain.tasksCompleted / domain.tasksTotal) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(domain.tasksCompleted / domain.tasksTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDomains.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p>No domains found matching "{searchQuery}"</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
