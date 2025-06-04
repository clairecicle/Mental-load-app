"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Link, Camera, Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateEditDomainProps {
  mode: "create" | "edit"
  domainId?: string
}

export function CreateEditDomain({ mode, domainId }: CreateEditDomainProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    owner: "alice",
    color: "green",
  })

  const [links, setLinks] = useState<string[]>([])
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [newLink, setNewLink] = useState("")

  const router = useRouter()

  // Load existing domain data if editing
  useEffect(() => {
    if (mode === "edit" && domainId) {
      // In real app, fetch domain data
      const domainData = {
        "1": {
          name: "Kitchen Management",
          description: "All tasks related to kitchen cleaning, maintenance, and organization",
          owner: "alice",
          color: "green",
        },
        "2": {
          name: "Pet Care",
          description: "Taking care of our dog Max - walks, feeding, vet appointments",
          owner: "bob",
          color: "purple",
        },
        "3": {
          name: "Bills & Finance",
          description: "Monthly bills, budget tracking, and financial planning",
          owner: "alice",
          color: "orange",
        },
      }

      const data = domainData[domainId as keyof typeof domainData]
      if (data) {
        setFormData(data)
        setLinks(["https://example.com/kitchen-tips"])
        setScreenshots([])
      }
    }
  }, [mode, domainId])

  const colorOptions = [
    { value: "green", label: "Green", class: "bg-green-100 text-green-800 border-green-200" },
    { value: "purple", label: "Purple", class: "bg-purple-100 text-purple-800 border-purple-200" },
    { value: "orange", label: "Orange", class: "bg-orange-100 text-orange-800 border-orange-200" },
    { value: "blue", label: "Blue", class: "bg-blue-100 text-blue-800 border-blue-200" },
    { value: "red", label: "Red", class: "bg-red-100 text-red-800 border-red-200" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { value: "pink", label: "Pink", class: "bg-pink-100 text-pink-800 border-pink-200" },
    { value: "gray", label: "Gray", class: "bg-gray-100 text-gray-800 border-gray-200" },
  ]

  const selectedColor = colorOptions.find((color) => color.value === formData.color)

  const addLink = () => {
    if (newLink.trim() && !links.includes(newLink.trim())) {
      setLinks([...links, newLink.trim()])
      setNewLink("")
    }
  }

  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    // In real app, save domain data
    console.log("Saving domain:", { ...formData, links, screenshots })
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              {mode === "create" ? "Create Domain" : "Edit Domain"}
            </h1>
          </div>
          <Button onClick={handleSave}>{mode === "create" ? "Create" : "Save"}</Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Preview */}
        {formData.name && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge className={selectedColor?.class}>{formData.name}</Badge>
                <span className="text-sm text-gray-500">by {formData.owner === "alice" ? "Alice" : "Bob"}</span>
              </div>
              {formData.description && <p className="text-sm text-gray-600 mt-2">{formData.description}</p>}
            </CardContent>
          </Card>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Domain Name</Label>
              <Input
                id="name"
                placeholder="e.g., Kitchen Management, Pet Care"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what tasks belong in this domain..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="owner">Domain Owner</Label>
                <Select value={formData.owner} onValueChange={(value) => setFormData({ ...formData, owner: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice</SelectItem>
                    <SelectItem value="bob">Bob</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="color">Color Theme</Label>
                <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${color.class}`} />
                          {color.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Link className="h-4 w-4" />
              Reference Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Add helpful links related to this domain</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="https://example.com"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addLink()}
                  className="flex-1"
                />
                <Button onClick={addLink} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {links.length > 0 && (
              <div className="space-y-2">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <Link className="h-4 w-4 text-gray-500" />
                    <span className="flex-1 text-sm truncate">{link}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeLink(index)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Screenshots */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Screenshots & Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Add screenshots or reference images</p>
              <Button variant="outline" size="sm">
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            {mode === "create" ? "Create Domain" : "Save Changes"}
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>

        {mode === "edit" && (
          <div className="pt-4">
            <Button variant="destructive" className="w-full">
              Delete Domain
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
