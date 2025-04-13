import { getTeams } from '@/app/lib/db/appwrite.js';
import { Suspense } from 'react';
import { Card, CardBody } from '@heroui/card';


export const dynamic = 'force-dynamic';
export default async function ID( {
    params,
  }: {
    params: Promise<{ id: string }>
  } ) {
    const { id } = await params;
    const { teams } = await getTeams(id)
    console.log(teams)
    // await all teams
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <h1 className="text-2xl">{id}</h1>
            <p className="text-lg">This is the ID page.</p>
            <p>List of all teams a user is in or is pending</p>
            
            <div>
            <Suspense>
                <div className="flex flex-col items-center">
                    {teams?.map((team: any) => (
                        <Card>
                            <CardBody>
                                <p>team</p>
                            </CardBody>
                      </Card>
                    ))}
                </div>
            </Suspense>
            </div>
                
        </div>
        
    );
}