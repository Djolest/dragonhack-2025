//import { getTeams } from '@/app/lib/db/appwrite.js';
import { Suspense } from 'react';
import { Card, CardBody } from '@heroui/card';
import { Link } from '@heroui/link';
import { Divider } from '@heroui/divider';

export const dynamic = 'force-dynamic';
export default async function ID( {
    params,
  }: {
    params: Promise<{ id: string , team: string}>
  } ) {
    const { id, team } = await params;
    const members = [{name: "Miha Slivnik", l:'/dashboard/67fb395c003bb54b7aa0/innovation'}, {name: "Jernej Slovak", l:'/dashboard/67fb395c003bb54b7aa0/sales'}, {name: "Development", l:'/dashboard/67fb395c003bb54b7aa0/development'}, {name: "C prevajalnik tim", l:'/dashboard/67fb395c003bb54b7aa0/cprevejalniki'}];
    const pending = [{name: "Bostjan Krmelj", l:'/dashboard/67fb395c003bb54b7aa0/innovation/0987654898765'}, {name: "Zoran Jurisic", l:'/dashboard/67fb395c003bb54b7aa0/innovation/lk7ijh74y754678'}];
    // await all teams
    return (
        <div className="flex flex-col items-center justify-left gap-4 py-8 md:py-10">
            <div className='w-[250px]'>
              <h1 className="text-3xl">{team}</h1>
            </div>
            <div className='w-[250px]'>
            <Suspense>
                <div className="flex flex-col items-center w-2xl">
                    {members?.map((team: any) => (
                        <Card key={team.name} className='text-xl m-[3px]' isPressable fullWidth>
                            <CardBody>
                                <Link className='w-2xl' href='/dashboard/67fb395c003bb54b7aa0/innovation'>{team.name}</Link>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </Suspense>
            </div>
            <div className='w-[250px]'> 
              <h1 className="text-3xl">Pending...</h1>
            </div>
            <div className='w-[250px]'>
            <Suspense>
                <div className="flex flex-col items-center w-2xl">
                    {pending?.map((team: any) => (
                        <Card key={team.name} className='text-xl m-[3px]' isPressable fullWidth>
                            <CardBody>
                                <Link className='w-xl text-base text-gray-400' href={team.l}>{team.name}</Link>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </Suspense>
            <Divider className="my-8" />
            <Card key='leave' className='text-xl m-[3px] text-red-500' isPressable fullWidth>
                <CardBody>
                    <p className='w-xl text-base'>Leave team</p>
                </CardBody>
            </Card>
            </div>
        </div>
        
    );
}