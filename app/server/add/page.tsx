'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { placeholders } from '@/components/utils/FormPlaceholders';
import { DbResponse, postData } from '@/components/utils/ApiHandler';
import { useTheme } from 'next-themes';
import { getToastStyles } from '@/components/utils/ToastStyles';
import toast from "react-hot-toast";

export default function ServerAdd() {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [name, setName] = useState<string>(placeholders.name);
  const [canNameToast, setCanNameToast] = useState<boolean>(true);
  const [pending, setPending] = useState<boolean>(false);
  const toastTimeoutMs = 3000;
  const maxNameChars = 32;

  const setNameFromInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > maxNameChars) {
      if (canNameToast) {
        toast('Cannot enter more than 32 characters.', getToastStyles('⚠️', currentTheme));
        setCanNameToast(false);
        setTimeout(() => { setCanNameToast(true); }, toastTimeoutMs);
      }
      
      e.target.value = e.target.value.slice(0, maxNameChars);
    }
    setName(e.target.value);
  };

  const postFormData = async (formData: FormData) => {
    setPending(true);
    const data: DbResponse = await postData('api/servers', formData);
    setPending(false);
    if (data.status === 'good') {
      toast('Added server!', getToastStyles('✅', currentTheme));
      return;
    }

    toast(`Error adding server: ${data.msg}`, getToastStyles('⚠️', currentTheme));
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center pb-16">
        <span className="rounded-lg px-4 py-1 bg-gray-100 dark:bg-[#18191B]">Add a Server</span>
      </h1>
      <div className="max-w-128 mx-auto">
        <form action={postFormData} className="flex flex-col">
          <div className="flex justify-between relative">
            <label htmlFor="name">Server Name</label>
            <input className="w-50 pr-12" name="name" id="name" placeholder={name} onChange={setNameFromInput} />
            <span className={`absolute bottom-1 right-2 text-xs italic opacity-25 transition ${(name.length === maxNameChars) ? 'text-red-500' : ''}`}>{name.length}/{maxNameChars}</span>
          </div>
          <div className="flex justify-between">
            <label htmlFor="host">Server Host/IP Address</label>
            <input className="w-50" name="host" id="host" placeholder={placeholders.host} />
          </div>
          <div className="flex justify-between">
            <label htmlFor="port">Server RCON Port</label>
            <input className="w-50" name="port" id="port" type="number" min="1" max="65535" placeholder={placeholders.port} />
          </div>
          <button type="submit" className="mx-auto mt-4 px-4 py-2 bg-[#98C767] rounded-lg hover:cursor-pointer hover:bg-[#7FA656] transition" disabled={pending}>
            {pending ? "Adding..." : "Add Server"}
          </button>
        </form>
      </div>
    </>
  );
};