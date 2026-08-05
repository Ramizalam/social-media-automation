import { useEffect, useState } from 'react'
import { PLATFORMS } from '../assets/assets';
import { PlusIcon } from 'lucide-react';
import AccountList from '../components/AccountList';
import PlatformPickerModel from '../components/PlatformPickerModel';
import toast from 'react-hot-toast';
import api from '../api/axios';



const Accounts = () => {

  const [accounts, setAccounts] = useState<any[]>([])
  const [connecting, setConnecting] = useState<string | null>(null)
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);

  const fetchAccount = async (isSync: boolean = false, platform?: string | null, sucessMsg?: string) => {
    try {
      if (isSync) {
        const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media";
        toast.loading(`Syncing ${label} account ...`, { id: "sync" })
        await api.get("/api/oauth/sync")
        toast.success(sucessMsg || "Account synced!", { id: "sync" })
      }
      const { data } = await api.get("/api/accounts");
      setAccounts(data);
    }
    catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "failed to load account")
      console.log("Error fetching accounts :", error)
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connectedPlatform = params.get("connected");
    const connectedUsername = params.get("username");
    const errorMsg = params.get("error");

     if (connectedPlatform) {
      const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1)
      const handle = connectedUsername ? `(@${connectedUsername})` : "";

      if (errorMsg) {
        toast.error(`${label} connect failed: ${errorMsg}`)
        fetchAccount();
      } else {
        // sync=true or just came back from OAuth — always sync
        fetchAccount(true, connectedPlatform, `${label}${handle} account connected successfully!`)
      }
    } else {
      fetchAccount()
    }
  }, [])

  const handleConnect = async (platformId: string) => {
    try {
      const { data } = await api.get(`/api/oauth/${platformId}/url`)
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || `Failed to connect ${platformId}`)
      setConnecting(null);
      console.log("Error connecting account :", error)
    }
  }

  const handlDisconnect = async (accountId: string) => {
    try {
      await api.delete(`/api/accounts/${accountId}`)
      toast.success("Account disconnected successfully")
      await fetchAccount();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to disconnect account")
      console.log("Error disconnecting account", error)
    }
  }

  const connectedIds = accounts.map((a) => a.platform)

  return (
    <div className='p-10 max-w-4xl mx-auto'>
      {/* header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h2 className='text-3xl font-medium text-slate-900'>Connected Accounts</h2>
          <p className='text-slate-500'> {accounts.length} of {PLATFORMS.length} social accounts connected</p>
        </div>
        <button onClick={() => setShowPlatformPicker(true)} className='flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600'>
          <PlusIcon className='size-4' /> Connect Account
        </button>
      </div>

      {/* Platform Picker Model */}
      {showPlatformPicker && <PlatformPickerModel connectedIds={connectedIds} connecting={connecting} onClose={() => setShowPlatformPicker(false)} onConnect={handleConnect} />}

      {/* connected Account List */}
      <AccountList accounts={accounts} onDisconnect={handlDisconnect} />
    </div>
  )
}

export default Accounts
