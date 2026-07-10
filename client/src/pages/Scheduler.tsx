import React, { useEffect, useState } from "react";
import { dummyPostsData, PLATFORMS } from "../assets/assets";
import { CalendarIcon, XIcon ,ClockIcon} from "lucide-react";

const Scheduler = () => {
  const [post, setPost] = useState<any[]>([]);
  const [content, setContent] = useState<string>("");
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPosts = async () => {
    setPost(dummyPostsData);
  };
  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 60000); // Fetch posts every 60 seconds
    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  const schedule = post
    .filter((p: any) => p.status === "scheduled")
    .sort(
      (a: any, b: any) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
    );
  const published = post
    .filter((p: any) => p.status === "published")
    .sort(
      (a: any, b: any) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  const handleSchedulePost = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPost((prev) => [...prev, dummyPostsData[0]]);
    }, 2000);
    if (
      !content ||
      selectedPlatforms.length === 0 ||
      !scheduleDate ||
      !scheduleTime
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  };

  const togglePlatformSelection = (platformId: string) =>
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((p) => p !== platformId)
        : [...prev, platformId],
    );
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full ">
      {/* Compose panel */}
      <div className="w-full lg:w-[460px] shrink-0">
        <div className="bg-white rounded-lg shadow-md p-6  ">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-lg font-medium text-slate-900">Compose Post</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSchedulePost}>
            {/* Platform Selection */}
            <div>
              <label
                className="block text-xs text-slate-500 uppercase mb-2"
                htmlFor="Platforms"
              >
                platforms
              </label>
              <div>
                <div className="flex items-center gap-2">
                  {PLATFORMS.map((platform) => (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatformSelection(platform.id)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-full border ${selectedPlatforms.includes(platform.id) ? "bg-red-500 text-white border-red-500" : "bg-white text-slate-900 border-slate-300"} hover:bg-red-500 hover:text-white transition-colors duration-300`}
                    >
                      <platform.icon className="size-4.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label
                className="block text-sm font-medium text-slate-700 uppercase mb-2"
                htmlFor="content"
              >
                Content
              </label>
              <textarea
                required
                rows={4}
                value={content}
                placeholder="Write your post here..."
                onChange={(e) => setContent(e.target.value)}
                className=" w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div
                className={` text-right text-xs mt-1 ${content.length > 280 ? "text-red-500" : "text-slate-500"}`}
              >
                {content.length}/280
              </div>
            </div>

            {/* Media Upload */}
            <div>
              <label
                className="block text-sm font-medium text-slate-700 uppercase mb-2"
                htmlFor="media"
              >
                Media (optional)
              </label>
              {mediaFile ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 p-2">
                  {mediaFile.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(mediaFile)}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(mediaFile)}
                      controls
                      className="max-h-40 max-w-full h-40 object-cover"
                    />
                  )}
                  <button type="button"  className="absolute top-2 right-2 size-7 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1 flex items-center justify-center transiton-colors" onClick={() => setMediaFile(null)}>
                    <XIcon className="size-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-red-300 hover:bg-red-50/30  transition-all group ">
                  <span className="text-sm text-slate-500 group-hover:text-red-600">Click to upload media</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setMediaFile(e.target.files[0]);
                      }
                    }}
                     className="hidden"
                   />
                </label>
              )}
            </div>

            {/* Schedule Date and Time */}
            < div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label  className="block text-sm font-medium text-slate-700 uppercase mb-2" htmlFor="scheduleDate">
                   Schedule Date
                  </label>
                 <div className="relative">
                  <CalendarIcon className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input type="date"  required className="w-full pl-10 pr-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
                 </div>
               </div>
               <div>
                 <label  className="block text-sm font-medium text-slate-700 uppercase mb-2" htmlFor="scheduleTime">
                    Schedule Time
                  </label>
                 <div className="relative">
                  <ClockIcon className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                  <input type="time"  required className="w-full pl-10 pr-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                 </div>
               </div>
              
            </div>
          </form>
        </div>
      </div>

      {/* Queue Panel */}
    </div>
  );
};

export default Scheduler;
