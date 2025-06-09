'use client';

import { useActionState } from 'react';
import { sendMessage } from '../actions/contact';

const initialState = {
  message: '',
  error: '',
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    sendMessage,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          姓名
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          訊息
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      
      <button
        type="submit"
        disabled={isPending}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {isPending ? '傳送中...' : '傳送訊息'}
      </button>
      
      {state.error && (
        <p className="text-red-600 text-sm">{state.error}</p>
      )}
      {state.message && (
        <p className="text-green-600 text-sm">{state.message}</p>
      )}
    </form>
  );
}
