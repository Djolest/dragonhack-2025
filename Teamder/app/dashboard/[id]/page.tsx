//import { getTeams } from '@/app/lib/db/appwrite.js';
import { Suspense } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';


export const dynamic = 'force-dynamic';
export default async function ID( {
    params,
  }: {
    params: Promise<{ id: string }>
  } ) {
    const { id } = await params;
    const teams = [{name: "Innovation team", l:'/dashboard/67fb395c003bb54b7aa0/Innovation'}, {name: "Sales", l:'/dashboard/67fb395c003bb54b7aa0/sales'}, {name: "Development", l:'/dashboard/67fb395c003bb54b7aa0/development'}, {name: "C prevajalnik tim", l:'/dashboard/67fb395c003bb54b7aa0/cprevejalniki'}];
    const pending = [{name: "DragonHack 2026"}];
    // await all teams
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <h1 className="text-5xl">My Teams</h1>
            <div className='w-[250px]'>
            <Suspense>
                <div className="flex flex-col items-center w-2xl">
                    {teams?.map((team: any) => (
                        <Card key={team.name} className='text-xl m-[3px]' isPressable fullWidth>
                            <CardBody>
                                <Link className='w-2xl' href={team.l}>{team.name}</Link>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </Suspense>
            </div>
            <h1 className="text-5xl">Pending...</h1>
            <div className='w-[250px]'>
            <Suspense>
                <div className="flex flex-col items-center w-2xl">
                    {pending?.map((team: any) => (
                        <Card key={team.name} className='text-xl m-[3px]' isPressable fullWidth>
                            <CardBody>
                                <p className='w-2xl'>{team.name}</p>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </Suspense>
            </div>
        </div>
        
    );
}