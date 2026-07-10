import  { useEffect, useState } from 'react'
import { dummyAccountsData, PLATFORMS } from '../assets/assets';
import { PlusIcon } from 'lucide-react';
import AccountList from '../components/AccountList';
import PlatformPickerModel from '../components/PlatformPickerModel';



const Accounts = () => {

  const[accounts,setAccounts]=useState<any[]>([])
  const[connecting,setConnecting] = useState<string|null>(null)
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const fetchAccount = async(isSync: boolean = false ,platform?:string|null,sucessMsg?:string)=>{
    try{
      setAccounts(dummyAccountsData);
      console.log(isSync,platform,sucessMsg)
    }
    catch(error){
      console.log("Error fetching accounts :",error)
    }
  }

  useEffect(()=>{
    fetchAccount()
  },[])

  const handleConnect = async(platformId:string)=>{
    try{
      setConnecting(platformId)
      // window.location.href = `/api/auth/${platformId}`
      setTimeout(()=>{
        setConnecting(null)
        setAccounts((prev)=>[...prev,dummyAccountsData[0]])
        setShowPlatformPicker(false)
      },5000)
    }catch(err){
      console.log("Error connecting account :",err)
      alert("Failed to connect account")
    }
  }
  
  const handlDisconnect = async (accountId:string)=>{
    try{
      // await axios.delete(`/api/accounts/${accountId}`)
      setAccounts(accounts.filter((a)=>a._id!==accountId))
      alert("Account disconnected successfully")

    }catch(err){
      console.log("Error disconnecting account",err)
      alert("Failed to disconnect account")
    }
  }

  const connectedIds = accounts.map((a)=>a.platform)

  return (
    <div className='p-10 max-w-4xl mx-auto'>
      {/* header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h2 className='text-3xl font-medium text-slate-900'>Connected Accounts</h2>
          <p className='text-slate-500'> {accounts.length} of {PLATFORMS.length} social accounts connected</p>
        </div>
        <button onClick={()=>setShowPlatformPicker(true)} className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600'>
          <PlusIcon className='size-4'/> Connect Account
        </button>
       </div>

      {/* Platform Picker Model */}
       {showPlatformPicker && <PlatformPickerModel connectedIds={connectedIds} connecting={connecting} onClose={()=>setShowPlatformPicker(false)} onConnect={handleConnect}/>}
     
      {/* connected Account List */}
      <AccountList accounts={accounts} onDisconnect={handlDisconnect}/>
    </div>
  )
}

export default Accounts
