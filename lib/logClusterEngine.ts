// Impuls-local\lib\logClusterEngine.ts

import { LogArchivKernel, LogStatusEntry } from "./logKernel";
import { PrimaryTag, CycleTag, ProcessTag } from "./logTags";

export interface ClusterIndex {
    byPrimary: Map<PrimaryTag, LogStatusEntry[]>;
    byCycle: Map<CycleTag, LogStatusEntry[]>;
    byProcess: Map<ProcessTag, LogStatusEntry[]>;
}

export class LogClusterEngine {
    private kernel: LogArchivKernel;

    constructor(kernel: LogArchivKernel) {
        this.kernel = kernel;
    }

    /** Baut den kompletten ClusterIndex aus einer Menge von LogStatusEntry-Einträgen. */
    public buildIndex(entries: LogStatusEntry[]): ClusterIndex {
        const byPrimary = new Map<PrimaryTag, LogStatusEntry[]>();
        const byCycle = new Map<CycleTag, LogStatusEntry[]>();
        const byProcess = new Map<ProcessTag, LogStatusEntry[]>();

        for (const entry of entries) {
            const { primary, cycle, process } = this.kernel.getCoreIndices(entry);

            // Primary
            if (!byPrimary.has(primary)) byPrimary.set(primary, []);
            byPrimary.get(primary)!.push(entry);

            // Cycle
            if (cycle) {
                if (!byCycle.has(cycle)) byCycle.set(cycle, []);
                byCycle.get(cycle)!.push(entry);
            }

            // Process
            for (const p of process) {
                if (!byProcess.has(p)) byProcess.set(p, []);
                byProcess.get(p)!.push(entry);
            }
        }

        return { byPrimary, byCycle, byProcess };
    }

    /** Filtert Einträge nach Primär-Tag und optional Zyklus. */
    public filterByPrimaryAndCycle(
        entries: LogStatusEntry[],
        primary: PrimaryTag,
        cycle?: CycleTag
    ): LogStatusEntry[] {
        return entries.filter((entry) => {
            const { primary: p, cycle: c } = this.kernel.getCoreIndices(entry);
            if (p !== primary) return false;
            if (cycle && c !== cycle) return false;
            return true;
        });
    }

    /** Erzeugt eine einfache Meta-Zusammenfassung für einen Primär-Tag + Zyklus. */
    public summarizeCluster(
        entries: LogStatusEntry[],
        primary: PrimaryTag,
        cycle?: CycleTag
    ): string {
        const target = this.filterByPrimaryAndCycle(entries, primary, cycle);
        if (target.length === 0) {
            return `Keine LOGs gefunden für ${primary}${cycle ? " in " + cycle : ""}.`;
        }

        const processesCount = new Map<ProcessTag, number>();

        for (const entry of target) {
            const { process } = this.kernel.getCoreIndices(entry);
            for (const p of process) {
                processesCount.set(p, (processesCount.get(p) ?? 0) + 1);
            }
        }

        // MapIterator -> Array ohne Spread-Operator
        const processEntries = Array.from(processesCount.entries());

        const processSummary = processEntries
            .sort((a, b) => b[1] - a[1])
            .map(([p, count]) => `${p}×${count}`)
            .join(", ");

        const header = `Meta-Cluster: ${primary}${cycle ? " · " + cycle : ""}`;
        const countLine = `Anzahl LOGs: ${target.length}`;
        const processLine = `Prozessverteilung: ${processSummary || "keine Prozess-Tags"}`;

        return [header, countLine, processLine].join("\n");
    }
}
