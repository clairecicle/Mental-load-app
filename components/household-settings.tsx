"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Crown, UserMinus, Mail, Trash2, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export function HouseholdSettings() {
  const [householdName, setHouseholdName] = useState("The Johnson-Smith Family")
  const [inviteEmail, setInviteEmail] = useState("")

  const router = useRouter()

  const members = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      avatar: "AJ",
      role: "admin",
      joinedAt: "Owner",
      tasksCompleted: 42,
      streak: 7,
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      avatar: "BS",
      role: "member",
      joinedAt: "Joined 3 months ago",
      tasksCompleted: 38,
      streak: 5,
    },
  ]

  const pendingInvites = [
    {
      id: "1",
      email: "sarah@example.com",
      sentAt: "2 days ago",
    },
  ]

  const handleInvite = () => {
    if (inviteEmail.trim()) {
      console.log("Inviting:", inviteEmail)
      setInviteEmail("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Nunito']">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Household Settings</h1>
            <p className="text-sm text-gray-500">Manage your household</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Household Info */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">🏠</div>
                <div>
                  <h2 className="text-lg font-bold">Household Information</h2>
                  <p className="text-white/80 text-sm">Customize your household details</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="household-name" className="text-sm font-medium text-gray-700">
                  Household Name
                </Label>
                <Input
                  id="household-name"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  className="mt-1 border-gray-200 rounded-xl"
                />
              </div>
              <Button className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                💾 Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Members */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-green-400 to-teal-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">👥</div>
                <div>
                  <h2 className="text-lg font-bold">Members ({members.length})</h2>
                  <p className="text-white/80 text-sm">Manage household members</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {members.map((member, index) => (
                <div key={member.id}>
                  <Card className="border-0 bg-gray-50 overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="text-lg font-bold">{member.avatar}</AvatarFallback>
                          </Avatar>
                          {member.role === "admin" && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                              <Crown className="h-3 w-3 text-yellow-800" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            {member.role === "admin" && (
                              <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">Admin</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{member.email}</p>
                          <p className="text-xs text-gray-500">{member.joinedAt}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>🔥 {member.streak} day streak</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span>✅ {member.tasksCompleted} tasks</span>
                            </div>
                          </div>
                        </div>
                        {member.role !== "admin" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                          >
                            <UserMinus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {index < members.length - 1 && <div className="h-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invite Members */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-pink-400 to-orange-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">✉️</div>
                <div>
                  <h2 className="text-lg font-bold">Invite New Member</h2>
                  <p className="text-white/80 text-sm">Add someone to your household</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Label htmlFor="invite-email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="Enter email address"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleInvite()}
                    className="flex-1 border-gray-200 rounded-xl"
                  />
                  <Button
                    onClick={handleInvite}
                    className="rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Invite
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Invites */}
        {pendingInvites.length > 0 && (
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">⏳</div>
                  <div>
                    <h2 className="text-lg font-bold">Pending Invites</h2>
                    <p className="text-white/80 text-sm">Waiting for responses</p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {pendingInvites.map((invite) => (
                  <Card key={invite.id} className="border-0 bg-gray-50">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Mail className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{invite.email}</p>
                            <p className="text-sm text-gray-500">Sent {invite.sentAt}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="rounded-full border-gray-200">
                            Resend
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600 rounded-full">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Danger Zone */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-red-400 to-pink-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h2 className="text-lg font-bold">Danger Zone</h2>
                  <p className="text-white/80 text-sm">Irreversible actions</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <Card className="border-0 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <UserMinus className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Leave Household</h3>
                        <p className="text-sm text-gray-600">Remove yourself from this household</p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 rounded-full">
                      Leave
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Delete Household</h3>
                        <p className="text-sm text-gray-600">Permanently delete this household and all data</p>
                      </div>
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600 rounded-full">Delete</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
