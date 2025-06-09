self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icon-192x192.png",
      badge: "/icon-72x72.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || "1",
      },
      actions: [
        {
          action: "explore",
          title: "View Task",
          icon: "/icon-192x192.png",
        },
        {
          action: "close",
          title: "Close",
          icon: "/icon-192x192.png",
        },
      ],
    }

    event.waitUntil(self.registration.showNotification(data.title, options))
  }
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    // Open the app when notification is clicked
    event.waitUntil(clients.openWindow("/"))
  }
})
