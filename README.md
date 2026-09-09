# tennis-training-app

Single-file trainingsapp: maak je eigen trainingen aan (kracht, cardio, tennis),
bewaar ze en log of plan ze op een dag. Inclusief logboek, statistieken en
agenda-export (ICS, tijdzone Europe/Amsterdam).

**Live:** https://ivan-semper.github.io/tennis-training-app/

## Wat het is

Eén HTML-bestand zonder backend. Alle gegevens staan lokaal in `localStorage` van de
browser waarin je de app opent. Er wordt niets naar een server gestuurd.

- **Dashboard** — weekvoortgang, geplande trainingen, statistieken en grafieken
- **Trainingen** — je eigen bibliotheek met opgeslagen trainingen
- **Logboek** — afgeronde sessies per maand, filterbaar per soort
- **Instellingen** — weekdoel, agendatijd/herinnering, back-up en herstel

## Inspreken

De grote microfoonknop rechtsonder logt een training door hem in te spreken:

> "Ik heb net 5 kilometer hardgelopen in 25 minuten, voelde lekker."

De app haalt er soort, datum, duur, afstand, tempo, zwaarte (RPE), gevoel en
krachtoefeningen (`3 keer 10 squats met 60 kilo`) uit. Noem je de naam van een
opgeslagen training, dan wordt die herkend en worden de oefeningen en duur
overgenomen. Je ziet altijd eerst wat de app ervan begreep en kunt het aanpassen
voordat je opslaat.

Spraak-naar-tekst gebeurt via de browser (`SpeechRecognition`, nl-NL) en vereist
HTTPS; het ontleden en opslaan gebeurt volledig lokaal. Werkt de spraakherkenning
niet, dan valt de app terug op een tekstvak dat dezelfde zin verwerkt.

## Trainingen aanmaken

In het tabblad **Trainingen** maak je een training aan in één van drie soorten:

| Soort | Wat je invult |
| --- | --- |
| 🏋️ Kracht | Lijst oefeningen met sets en reps (kg vul je in bij het loggen) |
| 🏃 Cardio | Soort (hardlopen, fietsen, roeien, …), standaardafstand en duur |
| 🎾 Tennis | Duur en aandachtspunten die je tijdens het loggen kunt afvinken |

Een opgeslagen training tik je later gewoon aan en zet je op een datum:
**Nu loggen** (afgerond) of **Inplannen** (staat als gepland op je dashboard).
Via **Bewaar als training** kun je ook een losse sessie omzetten naar een sjabloon.

## Agenda-export

Elke sessie heeft een knop **📅 In agenda**; in Instellingen exporteer je alle
geplande trainingen in één keer. Op iOS opent het deelmenu, waar je direct
**Agenda** kunt kiezen. Afspraken hebben een vast ID, dus opnieuw exporteren
werkt bestaande afspraken bij in plaats van ze te dupliceren.

## Lokaal draaien

```powershell
docker build -t tennis-training-app .
docker run --rm -p 8080:8080 tennis-training-app
```

Daarna te bereiken op http://localhost:8080

## Container

De GitHub Actions workflow bouwt bij elke push naar `main` een container en publiceert
die naar GitHub Packages:

```
ghcr.io/ivan-semper/tennis-training-app:latest
```

De container draait nginx als niet-root gebruiker en luistert op poort **8080**.
Een healthcheck is beschikbaar op `/healthz`.

## Secrets

Deze app gebruikt geen secrets en geen omgevingsvariabelen.
