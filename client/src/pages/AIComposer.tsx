import React, { useEffect } from "react";
import { dummyGenerationData } from "../assets/assets";
import { ArrowRightIcon, HistoryIcon, Loader2Icon, SparkleIcon, XIcon } from "lucide-react";

const AIComposer = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [tone, setTone] = React.useState<string>("professional");
  const [generateImage, setGenerateImage] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [generations, setGenerations] = React.useState<any[]>([]);

  //scheduling state
  const [activeScheduler, setActiveScheduler] = React.useState(null);
  const [selectedPlatform, setSelectedPlatform] = React.useState<string[]>([]);
  const [scehduleDate, setScheduleDate] = React.useState<string>("");
  const [scehduleTime, setScheduleTime] = React.useState<string>("");
  const [scheduling, setScheduling] = React.useState<boolean>(false);

  const fetchGeneration = async () => {
    setGenerations(dummyGenerationData);
  };

  useEffect(() => {
    fetchGeneration();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGenerations(dummyGenerationData);
    }, 2000);
  }

  const tones = [
    "Professional",
    "Casual",
    "Friendly",
    "Witty",
    "Inspirational",
    "Persuasive",
    "Empathetic",
    "Humorous",
    "Creative",
    "Optimistic",
  ];
  

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Input Section */}
      <div className="space-y-6 text-center mt-20">
        <h1 className="text-3xl tracking-tight text-slate-800 mb-4">
          what should we create today?
        </h1>
        <div className="relative group mt-12">
          <textarea
            name=""
            placeholder="Share your idea..(e.g., a new product launch, a company update, etc.)."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className=" w-full px-6 py-6 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none  outline-none   transition resize-none h-40"
          />
          <div className="absolute bottom-4  right-2.5 flex items-center gap-3 text-sm">
            <button
              onClick={() => setGenerateImage(!generateImage)}
              className="flex items-center gap-3 bg-red-50 py-2 px-3 rounded-lg"
            >
              <span>AI Image</span>
              <div
                className={` relative inline-flex w-9 h-5  shrink-0 rounded-full transition-colors duration-200 ease-in-out cursor-pointer outline-none ${generateImage ? "bg-red-500 " : "bg-slate-200 "}`}
              >
                <span
                  className={`pointer-events-none size-4 transform translate-y-0.5 rounded-full bg-white transition ${generateImage ? "translate-x-4.5" : "translate-x-0.5"}`}
                />
              </div>
            </button>

                <button disabled={loading} className="bg-slate-900 hover:bg-slate-900 text-white flex items-center gap-2 px-4 py-2 rounded-lg transition-colors" onClick={handleGenerate}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4  animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  Generate
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 justify-center flex-wrap">
          {tones.map((toneOption) => (
            <button key={toneOption} onClick={() => setTone(toneOption)} className={`px-4 py-2 rounded-full text-sm transition-all ${tone === toneOption ? "bg-red-500 border-red-500 text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}>
              {toneOption}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Post */}
      <div className="space-y-6 pt-12 border-t border-slate-200">
        <div className="flex items-center justify-between text-slate-800" >
           <div className="flex items-center gap-3 mb-2">
            <HistoryIcon className="size-5" />
            <h2 className="text-xl">Recent Generations</h2>
           </div>
           <span className=" text-sm text-slate-500 bg-slate-50" >{generations.length} total</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:grid-cols-3 gap-6">
          {generations.map((generation, index) => (
            <div key={index} className="group bg-white rounded 2-xl border border-slate-100 p-5 hover:border-red-200 transition-all relative overflow-hidden">
              <div className="flex flex-col h-full space-y-3">
                 <div className="flex  items-center justify-between">
                   <span className="text-xs text-slate-400 uppercase tracking-widest">{new Date(generation.createdAt).toLocaleString()}</span>
                   <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded.md">{generation.tone}</span>
                 </div>
                 <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">{generation.content}</p>
                {generation.mediaUrl && (
                  <div>
                    <img src={generation.mediaUrl} alt="gen"  className="w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition opacity"/>
                  </div>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <button
                  onClick={()=> setActiveScheduler(generation)}
                   className="flex-1 bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 text-xs py-2.5 rounded-lg transition-all">
                    Scheduled Post
                  </button>
                </div>
              </div>
            </div>
          ))}
          {
            generations.length===0 &&( 
              <div className="col-span-full py-20 text-center space-y-2">
                <div className="size-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                  <SparkleIcon className="size-6"/>
                </div>
                <p className="col-span-full py-20 text-center space-y-2">No content generated at. try generating some content using AI.</p>
              </div>
            )
          }
        </div>
      </div>
 
      {/* Scheduler Modal */}
      {activeScheduler && (
        <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] ">

            <div className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-slate-50/30">
               <h3 className="text-slate-900">Schedule Generation</h3>
               <button onClick={()=>setActiveScheduler(null)} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                <XIcon className="size-5"/>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8  space-y-4 ">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
              <p>{activeScheduler.prompt}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
              <p>{activeScheduler.content}</p>
              {activeScheduler.mediaUrl && <img src={activeScheduler.mediaUrl} alt="preview" className="w-full aspect-video object-cover rounded-xl border border-slate-100 shadow-sm"/>}
            </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIComposer;
