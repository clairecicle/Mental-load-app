import { DailyView } from "@/components/daily-view"

export default function Home() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white p-2 text-center text-sm">
        <a href="/api/init-db" className="text-blue-600 underline">
          Initialize Database
        </a>{" "}
        (click this first!)
      </div>
      <div className="pt-10">
        <DailyView />
      </div>
    </>
  )
}
