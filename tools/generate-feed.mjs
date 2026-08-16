/**
 * Genereert schema.ics: de agendafeed waar je je in Apple Agenda op abonneert.
 *
 * Het script laadt de planningscode uit index.html (zodat er maar één versie van
 * het schema bestaat) en schrijft alle trainingen weg voor het aantal weken uit
 * calendar-config.json.
 *
 * Draaien:  node tools/generate-feed.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const cfg = JSON.parse(fs.readFileSync(path.join(root, 'calendar-config.json'), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const match = html.match(/<script>([\s\S]*?)<\/script>/);
if (!match) throw new Error('Geen <script>-blok gevonden in index.html');

/* Minimale omgeving: geen document, dus de app start niet op en levert
   alleen zijn planningsfuncties op via globalThis.__schedule. */
const store = new Map();
const sandbox = {
  console,
  TextEncoder,
  Date,
  Math,
  JSON,
  Set,
  Map,
  Array,
  Object,
  String,
  Number,
  isNaN,
  parseInt,
  parseFloat,
  encodeURIComponent,
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
};
sandbox.globalThis = sandbox;

const context = vm.createContext(sandbox);
new vm.Script(match[1], { filename: 'index.html' }).runInContext(context);

const api = sandbox.__schedule;
if (!api) throw new Error('Planningsfuncties niet gevonden');

/* Instellingen uit calendar-config.json toepassen */
api.DB.settings.startDate = cfg.startDate;
api.DB.settings.calTimes = Array.isArray(cfg.times) && cfg.times.length === 7 ? cfg.times : api.DEFAULT_CAL_TIMES;
api.DB.settings.calReminder = Number(cfg.reminderMinutes) || 0;
api.DB.settings.calRest = !!cfg.includeRestDays;

/* Vanaf de startdatum, of vanaf 4 weken geleden als die al ver in het verleden ligt */
const weeks = Number(cfg.weeks) || 104;
const configStart = api.parseISO(cfg.startDate);
const recent = api.addDays(api.mondayOf(new Date()), -28);
const from = configStart > recent ? configStart : recent;

const events = [];
for (let i = 0; i < weeks * 7; i++) {
  const day = api.iso(api.addDays(from, i));
  for (const ev of api.calEventsForDate(day)) {
    if (ev.rest && !cfg.includeRestDays) continue;
    events.push(ev);
  }
}

if (!events.length) throw new Error('Geen trainingen gegenereerd');

const ics = api.buildICS(events, cfg.name || 'Tennis training');
fs.writeFileSync(path.join(root, 'schema.ics'), ics, 'utf8');

console.log(`schema.ics geschreven: ${events.length} afspraken, ${weeks} weken vanaf ${api.iso(from)}`);
