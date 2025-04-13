export default async function Teams({
    params,
  }: {
    params: Promise<{ id: string, team: string }>
  }) {
    const { id, team } = await params;
    
    return (
        <div>
            <div>Team page</div>
            <div>{team}</div>
        </div>
    );
}