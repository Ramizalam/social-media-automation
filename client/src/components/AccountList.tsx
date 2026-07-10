import { AlertCircleIcon, CheckCircleIcon, PlusIcon, UnplugIcon } from 'lucide-react';
import React from 'react'
import { PLATFORMS } from '../assets/assets';

interface AccountListProps{
    accounts: any[];
    onDisconnect: (accountId:string)=>void;
}

const AccountList = ({accounts,onDisconnect}:AccountListProps) => {
    const handleDisconnect = async(accountId:string)=>{
        try{
            const confirm = window.confirm("Are you sure you want to disconnect this account?")
            if(!confirm){
                return;
            }
           await onDisconnect(accountId)
        }
        catch(err){
            console.log("Error disconnecting account :",err)

        }
    }
    if(accounts.length === 0){
        return (
            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center py-20 px-6">
                <div className='size-14 bg-slate-400 rounded-2xl flex items-center justify-center'>
                    <PlusIcon className='size-6 text-slate-500 opacity-50'/>
                </div>
                <p className='text-lg font-medium text-slate-900 mt-4'>No accounts connected</p>
                <p className='text-slate-500'>Connect your social accounts to start scheduling posts.</p>
            </div>
        )
    }
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>{accounts.map((account,idx)=>{
        const platform = PLATFORMS.find((p)=>p.id===account.platform)
        if(!platform){
            return null;
        }
        const Icon = platform?.icon
        return (
            <div key={idx} className='group bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4  hover:border-slate-300 transition-all'>
                <div className='size-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0'>
                    <Icon className='size-5 text-slate-500'/>
                </div>
                <div className='flex-1 min-w-0'>
                    <div className='text-slate-800 truncate'>{account.handle}</div>
                    <div className='text-sm text-slate-500'>{platform.name}</div>
                </div>
                 <div className='flex items-center gap-2 shrink-0 '>
                    {account.status==='connected' ?(
                    <>
                        <CheckCircleIcon className="size-4 text-green-500"/>
                        <span className="text-sm text-slate-600">Connected</span>
                    </>):(
                        <>
                        <AlertCircleIcon className="size-4 text-yellow-500"/>
                        <span className="text-sm text-slate-600">Disconnected</span>
                        </>
                    )}
                 </div>
                 <button onClick={()=>handleDisconnect(account._id)} 
                 title='Disconnect Account'
                 className='group-hover:text-red-500  ml-2 p-1.5 text-slate-300 transition-colors'>
                    <UnplugIcon className='size-5'/>
                 </button>
                </div>
        )
    })}</div>
  ) 
}

export default AccountList