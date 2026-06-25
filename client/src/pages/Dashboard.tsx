import {  useEffect, useState } from "react"
import { ActivityIcon, CheckCircleIcon, ClockIcon, SendIcon, Share2Icon, TrendingUpIcon } from "lucide-react"
import { dummyAccountsData, dummyActivityData, dummyPostsData } from "../assets/assets"

const Dashboard = () => {
  const [stats, setStats] = useState({ scheduled: 0, published: 0, connectedAccounts: 0 })

  const [activities, setActivities] = useState<any[]>([])

  useEffect(()=>{
    const fetchDashBoardData = async()=>{
      try {
        const[postRes,accountRes,activityRes]= [{data:dummyPostsData},{data:dummyAccountsData},{data:dummyActivityData}]
        const posts = postRes.data;
        const accounts = accountRes.data;
        const activity = activityRes.data;
        
        setStats({
          scheduled: posts.filter((p:any)=>p.status === "scheduled").length,
          published: posts.filter((p:any)=>p.status === "published").length,
          connectedAccounts: accounts.filter((a:any) => a.status === "connected").length
        }) 
        
        setActivities(activity)
      } catch (error) {
        console.log("Error fetching dashboard data :",error)
      } 
    }
    fetchDashBoardData();
  },[])

  const statCard = [
    {
      label: "Schedules Posts",
      value: stats.scheduled,
      icon: ClockIcon,
      trend: "+2 today"
    }, {
      label: "published Post",
      value: stats.published,
      icon: CheckCircleIcon,
      trend: "+2 today"
    }, {
      label: "Connected Account",
      value: stats.connectedAccounts,
      icon: Share2Icon,
      trend: "Active"
    }
  ]
  return (
    <div>
      {/* welcomeBar */}
      <div>
        <h2 className="text-2xl text-slate-900">Good Morning</h2>
        <p className="text-slate-500">Here's what's happening with your social accounts today.</p>
      </div>

      {/* status cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCard.map((card) => (
          <div key={card.label} className="bg-white hover:border-red-200 hover:shadow-lg p-5 rounded-2xl border border-slate-100 ">
            <div className="flex item-center justify-between mb-4">
              <div className=" text-3xl font-medium text-slate-900 tabular-nums">{card.value}</div>
              <div className="text-xs absoloute right-4 top-4 text-red-500 flex item-center gap-1">
                <TrendingUpIcon className="size-3" />
                {card.trend}
              </div>
            </div>
            <p className="tex-sm text-slate-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="bg-white rounded-3xl border border-slate-100 p-4 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-slate-900">Latest Activity</h2>
          <span className="text-sm text-slate-400">{activities.length > 0 ? " Recent Activity" : "No Recent Activity"}</span>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center rounded-full bg-slate-50 p-3">
              <ActivityIcon className="size-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mt-4">No Activity Yet</h3>
            <p className="text-slate-500 mt-1">Once you publish your first post, you'll see your activity here.</p>

          </div>) : (
            <div className="divide-y divide-slate-100 ">
              {activities.map((activity)=>(
                <div key={activity.id} className="flex items-start py-4 px-2 rounded-2xl hover:bg-slate-50">
                   <div className="size-9 rounded-xl flex-tem-center justify-center bg-zinc-400 text-zinc-100">
                     <SendIcon className="size-4 text-slate-400"/>
                   </div>
                   <div className="min-w-0 flex-1">
                      <div className=" flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-400">Published</span>
                        <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                      </div>
                        <p className="text-sm text-slate-600">{activity.description}</p>
                   </div>
                </div>
              ))}

            
          </div>)}

      </div>


    </div>
  )
}

export default Dashboard
