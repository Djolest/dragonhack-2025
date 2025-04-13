export default async function ID( {
    params,
  }: {
    params: Promise<{ id: string }>
  } ) {
    const { id } = await params;
    // await all teams
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <h1 className="text-2xl">{id}</h1>
            <p className="text-lg">This is the ID page.</p>
            <p>List of all teams a user is in or is pending</p>
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