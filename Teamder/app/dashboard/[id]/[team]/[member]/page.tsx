export default async function Teams({
    params,
  }: {
    params: Promise<{ id: string, team: string, member: string }>
  }) {
    const { id, team, member } = await params;
    
    return (
        <div>
            <div>Team page</div>
            <div>{team}</div>
        </div>
    );
}