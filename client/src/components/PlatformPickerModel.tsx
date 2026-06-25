import { CheckCircle, CheckCircleIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { PLATFORMS } from "../assets/assets";


interface PlatformPickerModelProps{
    connectedIds:string[];
    connecting:string|null;
    onClose:()=>void;
    onConnect:(platformId:string)=>void
}


const PlatformPickerModel = ({connectedIds,connecting,onClose,onConnect}:PlatformPickerModelProps) => {
    const [activeTab,setActiveTab] = useState('add-account')
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                {/* header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Connect Account</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900">
                        <XIcon className="size-4"/>
                    </button>
                </div>
                {/* Platform List */}
                 <div className="p-6 flex flex-col gap-3">
                    {PLATFORMS.map((p)=>{
                        const isConnected = connectedIds.includes(p.id);
                        const isConnecting = connecting === p.id
                        return(
                            <button key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 ">
                                {/* Icon */}
                               <div className="p-2">
                                 <p.icon className={`size-5 ${isConnected?"text-red-600": "text-slate-400"}`}/>
                               </div>

                               {/* label */}
                               <div className="flex-1 min-w-0">
                                 <div className={`font-medium ${isConnected?"text-red-600": "text-slate-900"} truncate`}>
                                    {p.name}
                                 </div>
                                 <div className="text-sm text-slate-500 truncate">
                                    {isConnected?"Connected":"Connect your account"}
                                 </div>
                               </div>

                               {/* status */}
                               {isConnected && <CheckCircleIcon className="size-4 text-red-500 shrink-0"/>}

                            </button>
                        )
                    })}
                 </div>

            </div>
        </div>
    )
}

export default PlatformPickerModel