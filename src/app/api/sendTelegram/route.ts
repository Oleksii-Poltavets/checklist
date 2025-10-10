import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json();
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!botToken || !chatId) {
            console.error("Missing Telegram configuration");
            return NextResponse.json(
                { error: "Telegram configuration missing" }, 
                { status: 500 }
            );
        }

        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "Markdown"
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ ok: true, data });
        } else {
            console.error("Telegram API error:", data);
            return NextResponse.json(
                { error: "Telegram API error", details: data }, 
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error in sendTelegram API:", error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}