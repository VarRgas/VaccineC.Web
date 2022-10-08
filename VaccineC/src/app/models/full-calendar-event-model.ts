import { DateInput } from "@fullcalendar/core";

export class FullCalendarEventModel {
    public id!: string;
    public title!: string;
    public start!: DateInput;
    public end!: DateInput;
  }
  