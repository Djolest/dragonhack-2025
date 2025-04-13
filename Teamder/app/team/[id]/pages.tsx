'use client';
import { useParams } from "next/navigation";

export default function Teams() {
    const params = useParams();
    const teamId = params.id;
    return (
        <div>
            <div>Team page</div>
            <div>{teamId}</div>
        </div>
    );
}