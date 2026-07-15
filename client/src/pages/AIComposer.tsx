import React, { useEffect } from "react";
import { dummyGenerationData } from "../assets/assets";
import { ArrowRightIcon, Loader2Icon } from "lucide-react";

const AIComposer = () => {
  const [prompt, setPrompt] = React.useState<string>("");
  const [tone, setTone] = React.useState<string>("professional");
  const [generateImage, setGenerateImage] = React.useState<boolean>(true);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [generations, setGenerations] = React.useState<any[]>([]);

  //scheduling state
  const [activeScheduler, setActiveScheduler] = React.useState<any[]>(null);
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
            <button key={toneOption} onClick={() => setTone(toneOption)} className={`px-4 py-2 rounded-full text-sm transition-all ${tone === toneOption ? "bg-red-500 border-red-500 text-white" : "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200"}`}>
              {toneOption}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Post */}

      {/* Scheduler Modal */}
    </div>
  );
};

export default AIComposer;
