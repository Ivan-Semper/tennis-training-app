# tennis-training-app

Single-file trainingsapp voor tennis: 12-weeks periodiseringsschema, logboek en export
van de planning naar je agenda (ICS, tijdzone Europe/Amsterdam).

**Live:** https://ivan-semper.github.io/tennis-training-app/

## Wat het is

Eén HTML-bestand zonder backend. Alle gegevens staan lokaal in `localStorage` van de
browser waarin je de app opent. Er wordt niets naar een server gestuurd.

- **Dashboard** — weekvoortgang, statistieken en grafieken
- **Schema** — het 12-weeks schema met fases, deload-weken en dagblokken
- **Logboek** — afgeronde sessies per maand, filterbaar per type
- **Instellingen** — startdatum, agendatijden per dag, herinneringen, back-up/herstel

## Agenda-export

In **Instellingen** stel je per dag een starttijd in, hoeveel minuten vooraf je een
herinnering wilt en hoeveel weken vooruit geëxporteerd wordt. De knop *Exporteren*
maakt een `.ics`-bestand. Op iOS opent dat het deelmenu, waar je direct **Agenda**
kunt kiezen. Per dag of per week exporteren kan vanuit het tabblad **Schema**.

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
