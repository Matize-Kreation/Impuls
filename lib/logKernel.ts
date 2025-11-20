// Impuls-local\lib\logKernel.ts

import { TagHeader, parseTagHeader, PrimaryTag, CycleTag, ProcessTag } from "./logTags";

export interface LogStatusEntry {
    filePath: string;        // absolut oder relativ
    id: string;              // aus Ⅰ. LOG-ID
    rawContent: string;      // kompletter LOG-Text
    tagHeader: TagHeader;    // geparster Tag-Header
    createdAt?: Date;        // optional (z.B. aus Dateiname)
}

export interface KernelConfig {
    requireCompleteSchema?: boolean; // Ⅰ–Ⅶ Pflicht?
}

export const DEFAULT_KERNEL_CONFIG: KernelConfig = {
    requireCompleteSchema: false
};

const LOG_ID_REGEX = /^\s*[\u2160I]\.\s*LOG-ID/i; // I. LOG-ID oder Ⅰ. LOG-ID

export class LogArchivKernel {
    readonly version = "1.0";
    readonly name = "Matize-LogArchiv-Kernel";
    private config: KernelConfig;

    constructor(config: KernelConfig = DEFAULT_KERNEL_CONFIG) {
        this.config = config;
    }

    /** Prüft, ob eine Datei potentiell einen gültigen LOG-STATUS enthält. */
    public isValidLogContent(content: string): boolean {
        const lines = content.split(/\r?\n/).map((l) => l.trim());
        if (lines.length === 0) return false;

        // erste relevante Zeile = Tag-Header
        const firstNonEmpty = lines.find((l) => l.length > 0);
        if (!firstNonEmpty || !firstNonEmpty.startsWith("#")) return false;

        const tagHeader = parseTagHeader(firstNonEmpty);
        if (!tagHeader) return false;

        // optional: Schema-Prüfung
        if (this.config.requireCompleteSchema) {
            const hasLogId = lines.some((l) => LOG_ID_REGEX.test(l));
            if (!hasLogId) return false;
        }

        return true;
    }

    /** Parst eine Log-Datei in eine strukturierte LogStatusEntry-Instanz. */
    public parseLogFile(filePath: string, content: string): LogStatusEntry | null {
        const lines = content.split(/\r?\n/);
        const firstNonEmpty = lines.find((l) => l.trim().length > 0);
        if (!firstNonEmpty) return null;

        const tagHeader = parseTagHeader(firstNonEmpty.trim());
        if (!tagHeader) return null;

        if (this.config.requireCompleteSchema && !LOG_ID_REGEX.test(content)) {
            return null;
        }

        const idLineIndex = lines.findIndex((l) => LOG_ID_REGEX.test(l));
        let id = "UNKNOWN";

        if (idLineIndex !== -1) {
            const idLine = lines[idLineIndex + 1] ?? "";
            id = idLine.trim() || "UNKNOWN";
        }

        return {
            filePath,
            id,
            rawContent: content,
            tagHeader,
            createdAt: undefined
        };
    }

    /** Extrahiert Primär-Tag, Zyklus und Prozesse kompakt. */
    public getCoreIndices(entry: LogStatusEntry): {
        primary: PrimaryTag;
        cycle?: CycleTag;
        process: ProcessTag[];
    } {
        const { primary, cycle, process } = entry.tagHeader;
        return { primary, cycle, process };
    }
}
