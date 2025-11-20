// Impuls-local\scripts\log-archiv-tool.ts

import fs from "fs";
import path from "path";
import { LogArchivKernel, LogStatusEntry } from "../lib/logKernel";
import { LogClusterEngine } from "../lib/logClusterEngine";
import { PrimaryTag, CycleTag } from "../lib/logTags";

const PROJECT_ROOT = path.resolve(__dirname, "..");
const LOGS_DIR = path.join(PROJECT_ROOT, "logs");

function loadAllLogs(kernel: LogArchivKernel): LogStatusEntry[] {
    if (!fs.existsSync(LOGS_DIR)) {
        console.error(`Logs-Verzeichnis nicht gefunden: ${LOGS_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(LOGS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".txt"));

    const entries: LogStatusEntry[] = [];

    for (const file of files) {
        const absPath = path.join(LOGS_DIR, file);
        const content = fs.readFileSync(absPath, "utf-8");

        if (!kernel.isValidLogContent(content)) {
            continue;
        }

        const parsed = kernel.parseLogFile(absPath, content);
        if (parsed) {
            entries.push(parsed);
        }
    }

    return entries;
}

function printUsage() {
    console.log(`
Matize · LOG-ARCHIV · Systemtool

Verwendung:
  npx ts-node scripts/log-archiv-tool.ts list
  npx ts-node scripts/log-archiv-tool.ts summary --primaryTag #MUSIK --cycle #Zyklus-1

Befehle:
  list                       Zeigt alle geladenen LOGs mit Primär-Tag und Zyklus an.
  summary --primaryTag T     Erstellt eine Meta-Zusammenfassung für Primär-Tag T.
          [--cycle C]        Optional: Zyklus-Filter (#Zyklus-X).

Beispiel:
  npx ts-node scripts/log-archiv-tool.ts summary --primaryTag #IMPULS --cycle #Zyklus-1
`);
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0) {
        printUsage();
        process.exit(0);
    }

    const command = args[0];

    const kernel = new LogArchivKernel({ requireCompleteSchema: false });
    const engine = new LogClusterEngine(kernel);
    const entries = loadAllLogs(kernel);

    switch (command) {
        case "list": {
            console.log(`Gefundene LOGs: ${entries.length}\n`);
            for (const entry of entries) {
                const { primary, cycle } = kernel.getCoreIndices(entry);
                console.log(
                    `- [${primary}${cycle ? " · " + cycle : ""}]  ${path.basename(entry.filePath)}  (ID: ${entry.id
                    })`
                );
            }
            break;
        }

        case "summary": {
            const primaryIndex = args.indexOf("--primaryTag");
            if (primaryIndex === -1 || !args[primaryIndex + 1]) {
                console.error("Fehlender Parameter: --primaryTag");
                printUsage();
                process.exit(1);
            }

            const primaryTag = args[primaryIndex + 1] as PrimaryTag;

            const cycleIndex = args.indexOf("--cycle");
            const cycleTag =
                cycleIndex !== -1 && args[cycleIndex + 1]
                    ? (args[cycleIndex + 1] as CycleTag)
                    : undefined;

            const text = engine.summarizeCluster(entries, primaryTag, cycleTag);
            console.log(text);
            break;
        }

        default: {
            console.error(`Unbekannter Befehl: ${command}`);
            printUsage();
            process.exit(1);
        }
    }
}

main().catch((err) => {
    console.error("Fehler im Systemtool:", err);
    process.exit(1);
});
