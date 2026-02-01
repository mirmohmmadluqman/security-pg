import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (session.siwe) {
        return new Response(JSON.stringify({
            authenticated: true,
            address: session.siwe.address
        }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify({ authenticated: false }), {
        headers: { "Content-Type": "application/json" },
    });
}
