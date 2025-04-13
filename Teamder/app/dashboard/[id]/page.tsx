'use client';

import { useState } from "react";
import { useParams } from "next/navigation";

export default async function Dashboard() {
    const params = useParams();
    const userId = params.id;
    // const teams = await getTeams(userId);
    return (
        <div>
            <h1>Teams</h1>
            <p>List of your teams</p>
            <p>List of pending teams</p>
            <p>{userId}</p>
            {/**
             * Nesto na ovu foru ce ovde da bude:
             * /*return (
                    <div>
                    <Suspense>
                        <div className="flex flex-col items-center">
                            {vesti.map( (vest: any) => (
                                <Card key={vest.$id} vest={vest} />
                            ))}
                            <ModalButton parent={'novosti'} />
                        </div>
                    </Suspense>
                    {vesti.length === 5 ?
                        <LoadMore />
                    : null}
                    </div>
                )*
             * 
             * Treba negde dugme za "Add team"  
             *
             */}
        </div>
    );
}