import React, { useEffect, useState } from "react";
import { dummyPostsData, PLATFORMS } from "../assets/assets";
import {
  CalendarIcon,
  XIcon,
  ClockIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  SendIcon,
} from "lucide-react";

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

  const scheduled = post
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
                  <button
                    type="button"
                    className="absolute top-2 right-2 size-7 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full p-1 flex items-center justify-center transiton-colors"
                    onClick={() => setMediaFile(null)}
                  >
                    <XIcon className="size-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 p-5 py-10 border-2 border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-red-300 hover:bg-red-50/30  transition-all group ">
                  <span className="text-sm text-slate-500 group-hover:text-red-600">
                    Click to upload media
                  </span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 uppercase mb-2"
                  htmlFor="scheduleDate"
                >
                  Schedule Date
                </label>
                <div className="relative">
                  <CalendarIcon className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-slate-700 uppercase mb-2"
                  htmlFor="scheduleTime"
                >
                  Schedule Time
                </label>
                <div className="relative">
                  <ClockIcon className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="time"
                    required
                    className="w-full pl-10 pr-3 py-2 text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="size-4 border-2  border-white border-t-transparent rounded-full animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  Schedule Post
                  <ArrowRightIcon className="size-4 ml-2" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Queue Panel */}
      <div className="flex-1 flex flex-col  gap-6  min-w-0 rounded-lg shadow-md p-6 overflow-y-auto">
        {/* upcoming posts */}
        <div className="bg-white rounded-lg shadow-md   border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 ">
            <CalendarDaysIcon className="size-5 text-slate-500" />
            <h2 className="text-lg font-medium text-slate-900">
              Upcoming Posts
            </h2>
            <span className="bg-blue-100 ml-auto  text-blue-800 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {scheduled.length}
            </span>
          </div>
          <div className="max-h-72  overflow-y-auto divide-y divide-slate-200">
            {scheduled.length === 0 ? (
              <p className="py-10 text-center text-slate-500">
                No Posts scheduled yet
              </p>
            ) : (
              scheduled.map((p) => (
                <div
                  key={p._id}
                  className="px-5 py-4 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between  mb-2">
                    <div className="flex gap-1.5 items-center">
                      {p.platforms.map((platformId: string) => {
                        const platform = PLATFORMS.find(
                          (p) => p.id === platformId,
                        );
                        return platform ? (
                          <platform.icon
                            key={platform.id}
                            className="size-4 text-slate-500"
                          />
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2 ">
                      {p.mediaType && (
                        <span className="text-xs text-slate-500 bg-white border border-slate-300 px-1 py-0.5 rounded-lg font-semibold capitalize">
                          {p.mediaType}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 bg-white border border-slate-300 px-1 py-0.5 rounded-lg">
                        {new Date(p.scheduledFor).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2 max-w-md text-slate-600">
                    {p.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* published Post */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-200 ">
            <SendIcon className="size-5 text-slate-500" />
            <h2 className="text-lg font-medium text-slate-900">
              Published Posts
            </h2>
            <span className="bg-blue-100 ml-auto  text-blue-800 text-sm font-bold px-2.5 py-0.5 rounded-full">
              {published.length}
            </span>
          </div>
          <div className="max-h-72  overflow-y-auto divide-y divide-slate-200">
            {published.length === 0 ? (
              <p className="py-10 text-center text-slate-500">
                No Posts published yet
              </p>
            ) : (
              published.map((p) => (
                <div
                  key={p._id}
                  className="px-5 py-4 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center justify-between  mb-2">
                    <div className="flex gap-1.5 items-center">
                      {p.platforms.map((platformId: string) => {
                        const platform = PLATFORMS.find(
                          (p) => p.id === platformId,
                        );
                        return platform ? (
                          <platform.icon
                            key={platform.id}
                            className="size-4 text-slate-500"
                          />
                        ) : null;
                      })}
                    </div>
                    <div className="flex items-center gap-2 ">
                      {p.mediaType && (
                        <span className="text-xs text-slate-500 bg-white border border-slate-300 px-1 py-0.5 rounded-lg font-semibold capitalize">
                          {p.mediaType}
                        </span>
                      )}
                      <span className="text-xs text-slate-500 bg-white border border-slate-300 px-1 py-0.5 rounded-lg">
                        {new Date(p.updatedAt).toLocaleString()}
                      </span>
                      <span className="text-xs text-green-600 bg-green-100 px-1 py-0.5 rounded-lg font-semibold">
                        Published
                      </span>
                    </div>
                  </div>
                  <p className="text-sm line-clamp-2 max-w-4/5  text-slate-600">
                    {p.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;
