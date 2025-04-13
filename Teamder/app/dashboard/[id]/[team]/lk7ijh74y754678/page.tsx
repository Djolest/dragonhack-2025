import {Progress} from "@heroui/progress";
import {Card, CardBody, CardHeader} from "@heroui/card";

export default async function Teams({
    params,
  }: {
    params: Promise<{ id: string, team: string }>
  }) {
    const { id, team } = await params;
    
    const val = 70;
    const pros = [{title: "Higher precision", description: "Will put more thought and care into the assigned projects."}];
    const cons = [{title: "Higher empathy", description: "May be in a difficult environment because of higher empathy compared to your teammates."}];
    const recom = [{title: "Peaceful environment", description: "Assign as quality control lead for critical deliverables"}];
    const defaultContent = "Alobre";
    return (
        <div>
            {/** Prvo kaksen "progress bar", positive things, negative things */}
            <div className='w-[250px] m-[3px] my-[20px]'> 
              <h1 className="text-3xl">Compatibility</h1>
            </div>
            <Progress
                aria-label="Loading..." color="success" value={val} size="lg" className="w-2xl"
            />
            <div className='w-[250px] m-[3px] my-[20px]'> 
              <h1 className="text-3xl">Pros</h1>
            </div>
            <div className="flex flex-col items-center w-2xl">
                {pros?.map((team: any) => (
                    <Card key={team.title} className='text-xl m-[3px]' fullWidth>
                        <CardHeader>
                            <p className='w-xl text-base'>{team.title}</p>
                        </CardHeader>
                        <CardBody>
                            <p className='w-xl text-base text-gray-400'>{team.description}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className='w-[250px] m-[3px] my-[20px]'> 
              <h1 className="text-3xl">Cons</h1>
            </div>
            <div className="flex flex-col items-center w-2xl">
                {cons?.map((team: any) => (
                    <Card key={team.title} className='text-xl m-[3px]' fullWidth>
                        <CardHeader>
                            <p className='w-xl text-base'>{team.title}</p>
                        </CardHeader>
                        <CardBody>
                            <p className='w-xl text-base text-gray-400'>{team.description}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <div className='w-[250px] m-[3px] my-[20px]'> 
              <h1 className="text-3xl">Recommendations</h1>
            </div>
            <div className="flex flex-col items-center w-2xl">
                {recom?.map((team: any) => (
                    <Card key={team.title} className='text-xl m-[3px]' fullWidth>
                        <CardHeader>
                            <p className='w-xl text-base'>{team.title}</p>
                        </CardHeader>
                        <CardBody>
                            <p className='w-xl text-base text-gray-400'>{team.description}</p>
                        </CardBody>
                    </Card>
                ))}
            </div>
            
        </div>
    );
}