"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setBanana } from '@/store/slices/bananaSlice';
import { getSocket } from '@/utils/socket';
import Header from '@/components/Header';

export default function Page() {
    const bananaCount = useAppSelector((state) => state.banana);
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const router = useRouter();

    function handleBananaClick() {
        const socket = getSocket();
        if (socket) {
            socket.emit('bananaClicked', { count: 1 });
        } else {
            router.push('/');
        }

        dispatch(setBanana(bananaCount + 1));
    }

    useEffect(() => {
        const socket = getSocket();
        if (!socket || !userState.isAuthenticated || !userState.user) {
            router.push('/');
            return;
        }

        socket?.emit('qs-bananaCount');;
        socket?.on('ans-bananaCount', (data) => {
            dispatch(setBanana(data.count));
        });
    }, []);

    return (
        <main className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-col items-center justify-center p-40">
                <button className="mb-4 px-4 py-2 text-2xl bg-green-500 text-white rounded cursor-pointer" onClick={handleBananaClick}>
                    You have {bananaCount} 🍌
                </button>
            </div>
        </main>
    );
}