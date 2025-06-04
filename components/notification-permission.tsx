"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function NotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [showPrompt, setShowPrompt] = useState(false)
  const [vapidKeyAvailable, setVapidKeyAvailable] = useState(false)

  useEffect(() => {
    // Check if VAPID key is available
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    setVapidKeyAvailable(!!vapidKey)

    if ("Notification" in window && vapidKey) {
      setPermission(Notification.permission)
      // Show prompt if permission is default and user hasn't dismissed it
      const dismissed = localStorage.getItem("notification-prompt-dismissed")
      if (Notification.permission === "default" && !dismissed) {
        setShowPrompt(true)
      }
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      setShowPrompt(false)

      if (result === "granted") {
        // Register service worker and subscribe to push notifications
        registerServiceWorker()
      }
    }
  }

  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js")
        console.log("Service Worker registered:", registration)

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        if (!vapidKey) {
          console.error("VAPID public key not available")
          return
        }

        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })

        // Send subscription to server
        const response = await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        })

        if (!response.ok) {
          console.error("Failed to save subscription")
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error)
      }
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    localStorage.setItem("notification-prompt-dismissed", "true")
  }

  // Helper function to convert VAPID key
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Don't show if VAPID keys aren't configured or notification API isn't available
  if (!showPrompt || !("Notification" in window) || !vapidKeyAvailable) {
    return null
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 mx-auto max-w-sm">
      <div className="flex items-start gap-3">
        <Bell className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 text-sm">Stay on top of your tasks</h3>
          <p className="text-gray-600 text-xs mt-1">Get notified when your tasks are due</p>
          <div className="flex gap-2 mt-3">
            <Button onClick={requestPermission} size="sm" className="text-xs h-7">
              Enable
            </Button>
            <Button onClick={dismissPrompt} variant="ghost" size="sm" className="text-xs h-7">
              Not now
            </Button>
          </div>
        </div>
        <button onClick={dismissPrompt} className="text-gray-400 hover:text-gray-600">
          ×
        </button>
      </div>
    </div>
  )
}
