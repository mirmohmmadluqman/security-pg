import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { generateNonce } from "siwe";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET() {
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    session.nonce = generateNonce();
    await session.save();

    return new Response(session.nonce);
}
