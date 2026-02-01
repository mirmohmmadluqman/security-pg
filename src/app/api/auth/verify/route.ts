import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SiweMessage } from "siwe";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(request: Request) {
    const { message, signature } = await request.json();
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    try {
        const siweMessage = new SiweMessage(message);
        const { data: fields } = await siweMessage.verify({
            signature,
            nonce: session.nonce,
        });

        if (fields.nonce !== session.nonce) {
            return new Response(JSON.stringify({ message: "Invalid nonce." }), { status: 422 });
        }

        session.siwe = fields;
        session.nonce = undefined; // clear nonce after use
        await session.save();

        return new Response(JSON.stringify({ ok: true }));
    } catch (error) {
        return new Response(JSON.stringify({ message: (error as Error).message }), { status: 422 });
    }
}
