import { EventInput } from '@fullcalendar/web-component';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: createEventId(),
    title: 'Evento Exemplo',
    start: TODAY_STR + 'T12:00:00',
    end: TODAY_STR + 'T12:10:00'
  }
];

export function createEventId() {
  return String(eventGuid++);
}
