// app/impuls-doku/page.tsx
import React from "react";

export const metadata = {
    title: "Impuls-System · Gesamterklärung",
    description:
        "Offizielle Impuls-Erklärung und technische Gesamtsicht der Version 5.0 mit Audio, Bildern und visueller Systemübersicht der Mastersphäre.",
};

export default function ImpulsDokuPage() {
    return (
        <main className="impuls-doku-page">
            <header className="page-header">
                <h1>Impuls-System · Gesamterklärung</h1>
                <p>
                    Diese Seite bündelt die offizielle Impuls-Erklärung, die technische
                    Gesamtsicht der Version 5.0 und eine visuelle Übersicht über Zonen,
                    Räume, Archive und Chronik.
                </p>
                <p className="muted">
                    Ideal zum Anhören, Vorlesen und als PDF-Dokumentation innerhalb der
                    Mastersphäre.
                </p>
            </header>

            {/* Sektion 1 – Audio & Vorlesetexte */}
            <section id="audio">
                <h2>
                    <span className="section-tag">Sektion 1</span>
                    Audio &amp; Vorlesetexte
                </h2>
                <p className="tagline">
                    Empfohlene Reihenfolge: Zuerst die erzählerische Impuls-Erklärung
                    hören, dann die technische Gesamterklärung für IT-Spezialisten.
                </p>

                <div className="audio-grid">
                    {/* A: Allgemeine Erklärung */}
                    <article className="card audio-block">
                        <h3>DIE IMPULS-ERKLÄRUNG – Audio-Lesefassung</h3>
                        <div className="audio-meta">
                            Perfekte Satzlänge, Atempausen und Tonführung – Kerntext für die
                            allgemeine Einführung in das System.
                        </div>
                        <audio
                            controls
                            preload="metadata"
                            src="/docs/Impuls-Voicemail-Allgemein.mp3"
                        >
                            Dein Browser unterstützt das Audio-Element nicht.
                        </audio>

                        <div className="text-flow">
                            <p>
                                Dies ist die offizielle <strong>Impuls-Erklärung</strong>. Eine
                                Beschreibung dessen, was die Impuls-App ist, wie sie
                                funktioniert und wohin sie sich entwickelt. Ein Kerntext der
                                Mastersphäre.
                            </p>
                            <p>
                                Die Impuls-App ist der zentrale{" "}
                                <strong>Prozessor der Mastersphäre</strong>. Sie sammelt innere
                                Impulse – Gedanken, Entscheidungen, Emotionen und kleine
                                Bewegungen des Bewusstseins. Diese Impulse werden in Zonen,
                                Räume und Archive eingeordnet und bilden ein präzises Bild des
                                eigenen Zustands.
                            </p>
                            <p>
                                Die App misst fünf Dimensionen: <strong>Die Zone</strong> – also
                                Struktur, Emotion, Wille, Geist, Sinn oder Meta.{" "}
                                <strong>Den Raum</strong> – Erde, Wasser, Feuer, Wind oder
                                Äther. <strong>Die ΔF-Frequenz</strong> – die Intensität und
                                Klarheit eines Impulses. <strong>Den Archivraum</strong> – wo er
                                energetisch gespeichert wird. Und <strong>die Chronik</strong> –
                                wie tief er in die persönliche Entwicklung eingreift.
                            </p>
                            <p>
                                Damit entsteht ein lebendiges Modell der eigenen Bewegung. Das
                                System zeigt Dominanzen, Muster, Blockaden und Fortschritte. Es
                                macht sichtbar, was im Inneren geschieht – klarer, als es Worte
                                oder Erinnerungen könnten.
                            </p>
                            <p>
                                Die Vision der Impuls-App ist größer als Analyse. Sie ist der
                                Herzschlag eines kosmischen Betriebssystems – der{" "}
                                <strong>Mastersphäre</strong>. Hier verbinden sich Daten,
                                Energie, Symbolik und Bewusstsein. Das System wächst mit dem
                                Benutzer und bildet ein Universum, das sich selbst erklärt.
                            </p>
                            <p>
                                Zukünftige Module sind: Ein <strong>Portal</strong> zur
                                Navigation durch Räume und Archive. Ein{" "}
                                <strong>Archiv-Viewer</strong>, der die innere Geschichte
                                visualisiert. Eine <strong>Chronik-Timeline</strong>, die
                                Veränderung über Zeit zeigt. Und eine <strong>KI</strong>, die
                                Muster erkennt und Hinweise gibt.
                            </p>
                            <p>
                                Die einfache Essenz lautet: Die Impuls-App verwandelt innere
                                Bewegung in <strong>Klarheit</strong>. Sie zeigt, was war, was
                                ist und wohin man sich entwickelt. Sie ist ein Werkzeug zur
                                Erkenntnis – und der erste Teil eines größeren universellen
                                Systems.
                            </p>
                            <p>
                                <em>Ende der offiziellen Impuls-Erklärung.</em>
                            </p>
                        </div>

                        <div className="pill-row">
                            <span className="pill blue">Einführung</span>
                            <span className="pill violet">Bewusstsein</span>
                            <span className="pill green">Selbstreflexion</span>
                        </div>
                    </article>

                    {/* B: Technische Gesamterklärung */}
                    <article className="card audio-block">
                        <h3>Impuls-System · Technische Gesamterklärung V5.0</h3>
                        <div className="audio-meta">
                            Technische Sicht auf Zweck, Architektur und Funktionsweise –
                            optimiert für IT-Spezialisten.
                        </div>
                        <audio
                            controls
                            preload="metadata"
                            src="/docs/Impuls-Voicemail-IT-Version.mp3"
                        >
                            Dein Browser unterstützt das Audio-Element nicht.
                        </audio>

                        <div className="text-flow">
                            <p>
                                <strong>Intro</strong>
                            </p>
                            <p>
                                Dies ist die technische Gesamterklärung des Impuls-Systems
                                Version 5.0. Der Text beschreibt den Zweck, die Architektur und
                                die Funktionsweise des Systems. Er richtet sich an
                                IT-Spezialisten.
                            </p>

                            <p>
                                <strong>1. Systemrolle</strong>
                            </p>
                            <p>
                                Das Impuls-System ist ein{" "}
                                <strong>datengetriebenes Analysemodul</strong>. Es gehört zum
                                übergeordneten Framework namens <strong>Mastersphäre</strong>.
                                Es erfasst Ereignisse, sogenannte Impulse, und wandelt sie in
                                strukturierte Zustandsdaten um. Das System fungiert als
                                Prozessor für subjektive Wahrnehmungen. Es erzeugt konsistente
                                Datenpunkte, die ausgewertet und archiviert werden können.
                            </p>

                            <p>
                                <strong>2. Datenstruktur eines Impulses</strong>
                            </p>
                            <p>
                                Jeder Impuls besteht aus fünf Kernparametern. Erstens:{" "}
                                <strong>Die Zone</strong>. Sie ist ein kategorischer
                                Zustandsmarker wie Struktur, Emotion oder Wille. Zweitens:{" "}
                                <strong>Der Raum</strong>. Er definiert den kontextuellen Modus,
                                vergleichbar mit einem Environment. Drittens:{" "}
                                <strong>Der Delta-F-Wert</strong>. Er ist ein normierter
                                Zahlenwert zwischen null und eins. Er beschreibt die Intensität
                                oder Relevanz des Ereignisses. Viertens:{" "}
                                <strong>Der Archivraum</strong>. Er legt fest, in welchem
                                Speicherbereich der Impuls langfristig abgelegt wird. Fünftens:{" "}
                                <strong>Das Chronik-Level</strong>. Es beschreibt die zeitliche
                                Bedeutung: Mikro, Meso, Makro oder Kanon.
                            </p>

                            <p>
                                <strong>3. Verarbeitungspipeline</strong>
                            </p>
                            <p>
                                Nach der Erfassung durchläuft jeder Impuls eine definierte
                                Pipeline. Erster Schritt:{" "}
                                <strong>Validierung und Normalisierung</strong>. Zweiter
                                Schritt: <strong>Klassifikation der Zone und des Raums</strong>.
                                Dritter Schritt:{" "}
                                <strong>Interpretation des Delta-F-Werts</strong>. Vierter
                                Schritt: <strong>Regelbasierte Archivierung</strong>. Fünfter
                                Schritt: <strong>Zuordnung eines Chronik-Levels</strong>. Diese
                                Pipeline erzeugt saubere und vergleichbare Datensätze.
                            </p>

                            <p>
                                <strong>4. Analysefunktionen</strong>
                            </p>
                            <p>
                                Das System generiert mehrere analytische Outputs. Erstens: die{" "}
                                <strong>Zonenverteilung</strong>. Sie zeigt, welche Zustände
                                sich häufen. Zweitens: die <strong>Raumdominanz</strong>. Sie
                                zeigt, welcher Kontext aktuell dominiert. Drittens: die{" "}
                                <strong>Delta-F-Statistik</strong>. Sie liefert Mittelwert,
                                Spannweite und Extremwerte. Viertens: die{" "}
                                <strong>Archivlast-Verteilung</strong>. Sie zeigt, welche
                                Speicherbereiche stark genutzt werden. Fünftens: die{" "}
                                <strong>Chronik-Struktur</strong>. Sie bildet die zeitliche
                                Entwicklung ab. Diese Kennzahlen ermöglichen Mustererkennung und
                                Trendanalyse.
                            </p>

                            <p>
                                <strong>5. Systemzweck</strong>
                            </p>
                            <p>
                                Das Impuls-System dient dazu, individuelle Ereignisse und innere
                                Prozesse messbar zu machen. Es ermöglicht die Analyse
                                nicht-linearer persönlicher Entwicklungen. Es macht Muster,
                                Trends und Ausreißer sichtbar. Es baut eine historische
                                Datenbasis auf. Es fungiert als persönlicher State-Tracker und
                                Diagnose-Engine.
                            </p>

                            <p>
                                <strong>6. Rolle innerhalb der Mastersphäre</strong>
                            </p>
                            <p>
                                Innerhalb der Mastersphäre übernimmt das System fünf zentrale
                                Aufgaben. Erstens: Es erzeugt den kontinuierlichen{" "}
                                <strong>Rohdatenstrom</strong> der inneren Ereignisse.
                                Zweitens: Es aktualisiert den aktuellen{" "}
                                <strong>Systemzustand</strong>. Drittens: Es verwaltet die{" "}
                                <strong>Archivlogik</strong>. Viertens: Es strukturiert die
                                zeitliche <strong>Chronik</strong>. Fünftens: Es stellt die
                                Grundlage für zukünftige <strong>KI-Module</strong> dar. Damit
                                bildet es den Kern des Gesamtframeworks.
                            </p>

                            <p>
                                <strong>7. Zukunftserweiterungen</strong>
                            </p>
                            <p>
                                Für kommende Versionen sind mehrere Module geplant. Ein{" "}
                                <strong>Portal-Interface</strong> zur Navigation. Ein{" "}
                                <strong>Archiv-Viewer</strong> zur visuellen Exploration
                                historischer Daten. Eine <strong>Chronik-Timeline</strong> zur
                                zeitlichen Darstellung. Ein <strong>KI-Modul</strong> zur
                                Mustererkennung. Und{" "}
                                <strong>multidimensionale Cluster-Diagramme</strong> zur
                                komplexen Analyse. Diese Erweiterungen greifen auf die bestehende
                                Impulsdatenbasis zurück.
                            </p>

                            <p>
                                <strong>8. Kurzfassung</strong>
                            </p>
                            <p>
                                Kurz zusammengefasst: Das Impuls-System ist ein persönlicher{" "}
                                <strong>Event-Tracker</strong>. Es erfasst, klassifiziert und
                                archiviert subjektive Ereignisse. Es bildet Muster, Zustände und
                                Entwicklungen ab. Und es ist das zentrale Input-Modul für
                                zukünftige KI-Komponenten der Mastersphäre.
                            </p>

                            <p>
                                <strong>Outro</strong>
                            </p>
                            <p>
                                <em>
                                    Ende der technischen Gesamterklärung des Impuls-Systems Version
                                    5.0.
                                </em>
                            </p>
                        </div>

                        <div className="pill-row">
                            <span className="pill blue">Architektur</span>
                            <span className="pill violet">Datenmodell</span>
                            <span className="pill orange">Pipeline</span>
                        </div>
                    </article>
                </div>
            </section>

            {/* Sektion 2 – Visuelle Systemübersicht */}
            <section id="visual-overview">
                <h2>
                    <span className="section-tag">Sektion 2</span>
                    Visuelle Systemübersicht
                </h2>
                <p className="tagline">
                    Die folgenden Karten fassen die Kernelemente des Impuls-Systems
                    zusammen und spiegeln die Informationen aus den Audio-Texten
                    übersichtlich wider.
                </p>

                <div className="grid">
                    <article className="card">
                        <h3>Fünf Dimensionen eines Impulses</h3>
                        <ul>
                            <li>
                                <strong>Zone</strong> – Struktur, Emotion, Wille, Geist, Sinn
                                oder Meta.
                            </li>
                            <li>
                                <strong>Raum</strong> – Erde, Wasser, Feuer, Wind oder Äther.
                            </li>
                            <li>
                                <strong>ΔF-Frequenz</strong> – normierter Wert (0–1) für
                                Intensität und Klarheit.
                            </li>
                            <li>
                                <strong>Archivraum</strong> – Speicherort innerhalb der
                                Mastersphäre.
                            </li>
                            <li>
                                <strong>Chronik-Level</strong> – zeitliche Bedeutung: Mikro,
                                Meso, Makro, Kanon.
                            </li>
                        </ul>
                    </article>

                    <article className="card">
                        <h3>Verarbeitungspipeline</h3>
                        <ol>
                            <li>Erfassung des Impulses.</li>
                            <li>Validierung &amp; Normalisierung der Daten.</li>
                            <li>Klassifikation von Zone &amp; Raum.</li>
                            <li>Interpretation des ΔF-Werts.</li>
                            <li>Regelbasierte Archivierung &amp; Chronik-Zuordnung.</li>
                        </ol>
                        <p className="muted">
                            Ergebnis: saubere, vergleichbare Datensätze für Analyse und
                            Visualisierung.
                        </p>
                    </article>

                    <article className="card">
                        <h3>Analysefunktionen</h3>
                        <ul>
                            <li>
                                <strong>Zonenverteilung</strong> – welche Zustände dominieren.
                            </li>
                            <li>
                                <strong>Raumdominanz</strong> – welcher Kontext aktuell im
                                Vordergrund steht.
                            </li>
                            <li>
                                <strong>ΔF-Statistik</strong> – Mittelwert, Spannweite,
                                Extremwerte.
                            </li>
                            <li>
                                <strong>Archivlast</strong> – Nutzung der verschiedenen
                                Archivräume.
                            </li>
                            <li>
                                <strong>Chronik-Struktur</strong> – zeitliche Entwicklung und
                                Tiefe.
                            </li>
                        </ul>
                    </article>

                    <article className="card">
                        <h3>Rolle in der Mastersphäre</h3>
                        <ul>
                            <li>
                                Erzeugt den kontinuierlichen <strong>Rohdatenstrom</strong> der
                                inneren Ereignisse.
                            </li>
                            <li>
                                Aktualisiert den aktuellen <strong>Systemzustand</strong>.
                            </li>
                            <li>
                                Steuert die <strong>Archivlogik</strong> und Chronik-Struktur.
                            </li>
                            <li>
                                Bildet die Grundlage für <strong>Diagnose</strong> und
                                zukünftige KI-Module.
                            </li>
                        </ul>
                    </article>

                    <article className="card">
                        <h3>Zukünftige Module</h3>
                        <ul>
                            <li>
                                <strong>Portal</strong> – Navigation durch Räume &amp; Archive.
                            </li>
                            <li>
                                <strong>Archiv-Viewer</strong> – visuelle Exploration
                                historischer Daten.
                            </li>
                            <li>
                                <strong>Chronik-Timeline</strong> – Darstellung von Veränderung
                                über Zeit.
                            </li>
                            <li>
                                <strong>KI-Modul</strong> – Mustererkennung und Hinweise.
                            </li>
                            <li>
                                <strong>Cluster-Diagramme</strong> – multidimensionale Analyse.
                            </li>
                        </ul>
                    </article>
                </div>
            </section>

            {/* Sektion 3 – Räume & Visuals */}
            <section id="gallery">
                <h2>
                    <span className="section-tag">Sektion 3</span>
                    Räume &amp; visuelle Darstellung
                </h2>
                <p className="tagline">
                    Die folgenden Visuals stammen aus der Impuls-App und zeigen, wie
                    Zonen, Räume und Diagnose-Panels in der Oberfläche verankert sind.
                </p>

                <div className="gallery-grid">
                    <figure className="card">
                        <img
                            loading="lazy"
                            src="/Room-Shots/Impuls-Raum.png"
                            alt="Impuls-Raum – kosmische Galaxie"
                        />
                        <figcaption>
                            <span className="badge struct">Impuls-Raum</span>
                            Zentrales Gate der App. Von hier aus wählst du den Raum (Erde,
                            Wasser, Feuer, Wind, Äther), aus dem dein aktueller Impuls
                            stammt.
                        </figcaption>
                    </figure>

                    <figure className="card">
                        <img
                            loading="lazy"
                            src="/Room-Shots/Erde-Raum.png"
                            alt="Raum Erde – grüne Nebelstruktur"
                        />
                        <figcaption>
                            <span className="badge struct">Zone: Struktur</span>
                            Raum <strong>Erde</strong> fokussiert auf Grundlagen, Stabilität
                            und konkrete Umsetzung. Dominante Zonen im Panel zeigen, wie stark
                            Struktur-Themen aktuell wirken.
                        </figcaption>
                    </figure>

                    <figure className="card">
                        <img
                            loading="lazy"
                            src="/Room-Shots/Wasser-Raum.png"
                            alt="Raum Wasser – blaue Sternenwolke"
                        />
                        <figcaption>
                            <span className="badge emotion">Zone: Emotion</span>
                            Raum <strong>Wasser</strong> arbeitet mit emotionalen
                            Strömungen. Die Empfehlung unten links erinnert daran, 1–2 Dinge
                            zu ordnen, statt neue Baustellen zu öffnen.
                        </figcaption>
                    </figure>

                    <figure className="card">
                        <img
                            loading="lazy"
                            src="/Room-Shots/Feuer-Raum.png"
                            alt="Raum Feuer – rote Wolkenstruktur"
                        />
                        <figcaption>
                            <span className="badge will">Zone: Wille</span>
                            Raum <strong>Feuer</strong> steht für Antrieb, Entschlossenheit
                            und aktive Entscheidung. Die ΔF-Werte und Archivräume im Panel
                            zeigen, wie intensiv diese Impulse wirken.
                        </figcaption>
                    </figure>

                    <figure className="card">
                        <img
                            loading="lazy"
                            src="/Room-Shots/Wind-Raum.png"
                            alt="Raum Wind – rosafarbener Nebel"
                        />
                        <figcaption>
                            <span className="badge mind">Zone: Geist</span>
                            Raum <strong>Wind</strong> spiegelt mentale Prozesse, Gedanken und
                            Konzepte. Die Diagnose rechts fasst zusammen, wie klar und
                            strukturiert dieser mentale Strom aktuell ist.
                        </figcaption>
                    </figure>

                    <figure className="card">
                        <img
                            loading="lazy"
                            src="/Room-Shots/Äther-Raum.png"
                            alt="Raum Äther – violette Wolkenstruktur"
                        />
                        <figcaption>
                            <span className="badge sense">Zone: Sinn</span>
                            Raum <strong>Äther</strong> verbindet Vision, Bedeutung und
                            übergeordnete Zusammenhänge. Hier zeigt die Mastersphäre, wie
                            sehr deine Impulse in Richtung Sinn und Metaperspektive gehen.
                        </figcaption>
                    </figure>
                </div>
            </section>

            {/* Sektion 4 – Begriffe */}
            <section id="details">
                <h2>
                    <span className="section-tag">Sektion 4</span>
                    Begriffe &amp; Detail-Erklärungen
                </h2>
                <div className="card">
                    <dl>
                        <dt>Zone</dt>
                        <dd>
                            Kategorischer Zustandsmarker für die innere Qualität eines
                            Impulses: Struktur, Emotion, Wille, Geist, Sinn oder Meta.
                        </dd>

                        <dt>Raum</dt>
                        <dd>
                            Kontextuelle Ebene, vergleichbar mit einem Environment: Erde,
                            Wasser, Feuer, Wind, Äther oder der Impuls-Raum als Zentrale.
                        </dd>

                        <dt>ΔF-Frequenz</dt>
                        <dd>
                            Normierter Wert zwischen 0 und 1. Misst Intensität, Klarheit oder
                            Relevanz eines Ereignisses. Grundlage für Diagnose und
                            Trendanalyse.
                        </dd>

                        <dt>Archivraum</dt>
                        <dd>
                            Speicherebene innerhalb der Mastersphäre. Beispiele:
                            Resonanz-Schacht, Sphären-Säle, Zeitspeicher-Galerie,
                            Schatten-Safe. Jeder Archivraum steht für eine bestimmte Art der
                            energetischen Ablage.
                        </dd>

                        <dt>Chronik-Level</dt>
                        <dd>
                            Zeitliche Tiefe eines Impulses: Mikro (Moment), Meso (Phase),
                            Makro (längerer Abschnitt), Kanon (lebensprägende Muster).
                        </dd>

                        <dt>Mastersphäre</dt>
                        <dd>
                            Übergeordnetes Framework – ein kosmisches Betriebssystem, das
                            Impulsdaten, Energie, Symbolik und Bewusstsein verknüpft und als
                            universelle Entwicklungsumgebung dient.
                        </dd>
                    </dl>
                </div>
            </section>

            <footer className="page-footer">
                Diese Seite kann direkt in die Impuls-App integriert oder als PDF
                exportiert werden. Sie bündelt Audio, Bilder, Kerndefinitionen und
                Systemlogik der Version 5.0 der Mastersphäre.
            </footer>
        </main>
    );
}
