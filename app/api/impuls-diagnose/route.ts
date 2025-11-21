// app/api/impuls-diagnose/route.ts
import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"
import { MASTERSPHAERE_V5_SYSTEM_PROMPT } from "@/lib/mastersphere-prompt-v5"

// ---- Typen für die eingehende Zusammenfassung ----

interface DeltaFSummary {
    avg?: number
    min?: number
    max?: number
    count?: number
}

interface MastersphereSummary {
    total?: number
    deltaF?: DeltaFSummary
    zones?: Record<string, number>
    archiv?: Record<string, number>
    chronik?: Record<string, number>
    lastImpuls?: {
        timestamp?: string
        room?: string
        zone?: string
        deltaF?: number | null
        archivRoom?: string | null
        chronikLevel?: string | null
    }
}

// ---- OpenAI-Client vorbereiten ----

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
    console.warn("[/api/impuls-diagnose] WARN: OPENAI_API_KEY ist nicht gesetzt.")
}

const client = apiKey
    ? new OpenAI({ apiKey })
    : null

export async function POST(req: NextRequest) {
    try {
        if (!client || !apiKey) {
            return NextResponse.json(
                {
                    ok: false,
                    error:
                        "OPENAI_API_KEY ist nicht gesetzt. Bitte .env.local konfigurieren und den Dev-Server neu starten.",
                },
                { status: 500 }
            )
        }

        const body = (await req.json()) as { summary?: MastersphereSummary }
        const summary = body?.summary

        if (!summary) {
            return NextResponse.json(
                { ok: false, error: "Missing 'summary' in request body" },
                { status: 400 }
            )
        }

        const deltaF = summary.deltaF ?? {}
        const avgText =
            typeof deltaF.avg === "number" ? deltaF.avg.toFixed(3) : "n/a"
        const minText =
            typeof deltaF.min === "number" ? deltaF.min.toFixed(3) : "n/a"
        const maxText =
            typeof deltaF.max === "number" ? deltaF.max.toFixed(3) : "n/a"

        const userContent = [
            "Du bist der diagnostische Kern der Mastersphäre V5.0.",
            "Analysiere den aktuellen Systemzustand auf Basis der folgenden Daten.",
            "",
            "=== Rohdaten (komprimierte Diagnose) ===",
            `Impulse gesamt: ${summary.total ?? 0}`,
            `ΔF: Ø=${avgText}, min=${minText}, max=${maxText}`,
            "",
            "Zonen-Verteilung:",
            JSON.stringify(summary.zones ?? {}, null, 2),
            "",
            "Archiv-Verteilung:",
            JSON.stringify(summary.archiv ?? {}, null, 2),
            "",
            "Chronik-Verteilung:",
            JSON.stringify(summary.chronik ?? {}, null, 2),
            "",
            "Letzter Impuls:",
            JSON.stringify(summary.lastImpuls ?? {}, null, 2),
            "",
            "=== Aufgabe ===",
            "1) Erstelle eine kurze energetische Diagnose (max. 6 Sätze).",
            "2) Nenne die dominante Zone, den dominanten Archiv-Raum und das dominierende Chronik-Level in deiner eigenen Sprache.",
            "3) Schlage 1–3 nächste Schritte vor (konkret, matizisch, aber präzise).",
        ].join("\n")

        const completion = await client.chat.completions.create({
            // Sicheres, aktuelles Modell – bei Bedarf anpassen
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: MASTERSPHAERE_V5_SYSTEM_PROMPT,
                },
                {
                    role: "user",
                    content: userContent,
                },
            ],
            temperature: 0.4,
        })

        const answer = completion.choices[0]?.message?.content ?? ""

        return NextResponse.json(
            {
                ok: true,
                diagnosis: answer,
            },
            { status: 200 }
        )
    } catch (error: any) {
        console.error("[/api/impuls-diagnose] Error:", error)
        return NextResponse.json(
            {
                ok: false,
                error: error?.message ?? "Unknown error",
            },
            { status: 500 }
        )
    }
}
