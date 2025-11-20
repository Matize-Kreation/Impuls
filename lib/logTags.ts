// Impuls-local\lib\logTags.ts

export type PrimaryTag =
    | "#MUSIK"
    | "#IMPULS"
    | "#MASTERSPHÄRE"
    | "#ENERGETIK"
    | "#SCHACH"
    | "#BERUF"
    | "#SYSTEM/TECHNIK";

export type ProcessTag =
    | "#Analyse"
    | "#Entwurf"
    | "#Implementierung"
    | "#Test"
    | "#Refaktorierung"
    | "#Meta"
    | "#Korrektur"
    | "#Evaluation";

export type CycleTag = `#Zyklus-${number}`;

export type IntensityTag = "#hoch" | "#mittel" | "#niedrig";

export type EmotionTag =
    | "#Resonanz"
    | "#Kohärenz"
    | "#Klarheit"
    | "#Wachstum"
    | "#Umbruch";

export type StructureTag =
    | "#Archiv"
    | "#Dokument"
    | "#Master"
    | "#Blueprint"
    | "#Regeln"
    | "#Betriebssystem";

export type MetaSystemTag =
    | "#OS"
    | "#Kernel"
    | "#Protokoll"
    | "#Architektur"
    | "#Interface"
    | "#Datenstruktur";

// Generischer Tag-Typ (für flexible Erweiterungen)
export type AnyTag =
    | PrimaryTag
    | ProcessTag
    | CycleTag
    | IntensityTag
    | EmotionTag
    | StructureTag
    | MetaSystemTag
    | `#${string}`;

// Interne Struktur für einen geparsten Tag-Header
export interface TagHeader {
    rawLine: string;
    primary: PrimaryTag;
    cycle?: CycleTag;
    process: ProcessTag[];
    intensity?: IntensityTag;
    emotion: EmotionTag[];
    structure: StructureTag[];
    metaSystem: MetaSystemTag[];
    other: string[]; // alle nicht explizit typisierten Tags
}

export function parseTagHeader(line: string): TagHeader | null {
    const trimmed = line.trim();

    if (!trimmed.startsWith("#")) return null;

    const parts = trimmed.split(/\s+/).filter(Boolean) as AnyTag[];

    if (parts.length === 0) return null;

    // Primär-Tag = erstes bekannte PrimaryTag
    const primary = parts.find((p) =>
        [
            "#MUSIK",
            "#IMPULS",
            "#MASTERSPHÄRE",
            "#ENERGETIK",
            "#SCHACH",
            "#BERUF",
            "#SYSTEM/TECHNIK"
        ].includes(p)
    ) as PrimaryTag | undefined;

    if (!primary) {
        return null;
    }

    const process: ProcessTag[] = [];
    const emotion: EmotionTag[] = [];
    const structure: StructureTag[] = [];
    const metaSystem: MetaSystemTag[] = [];
    const other: string[] = [];
    let cycle: CycleTag | undefined;
    let intensity: IntensityTag | undefined;

    for (const token of parts) {
        if (token === primary) continue;

        if (/^#Zyklus-\d+$/.test(token)) {
            cycle = token as CycleTag;
            continue;
        }

        if (["#hoch", "#mittel", "#niedrig"].includes(token)) {
            intensity = token as IntensityTag;
            continue;
        }

        if (
            [
                "#Analyse",
                "#Entwurf",
                "#Implementierung",
                "#Test",
                "#Refaktorierung",
                "#Meta",
                "#Korrektur",
                "#Evaluation"
            ].includes(token)
        ) {
            process.push(token as ProcessTag);
            continue;
        }

        if (["#Resonanz", "#Kohärenz", "#Klarheit", "#Wachstum", "#Umbruch"].includes(token)) {
            emotion.push(token as EmotionTag);
            continue;
        }

        if (
            ["#Archiv", "#Dokument", "#Master", "#Blueprint", "#Regeln", "#Betriebssystem"].includes(
                token
            )
        ) {
            structure.push(token as StructureTag);
            continue;
        }

        if (
            ["#OS", "#Kernel", "#Protokoll", "#Architektur", "#Interface", "#Datenstruktur"].includes(
                token
            )
        ) {
            metaSystem.push(token as MetaSystemTag);
            continue;
        }

        other.push(token);
    }

    // Default-Prozess, falls keiner gesetzt
    if (process.length === 0) {
        process.push("#Analyse");
    }

    const header: TagHeader = {
        rawLine: trimmed,
        primary,
        cycle,
        process,
        intensity,
        emotion,
        structure,
        metaSystem,
        other
    };

    return header;
}
