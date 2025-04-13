export default function Questions() {
    return (
        <div>
            <h1>Questions</h1>
            <p>List of your questions</p>
            <p>List of pending questions</p>
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