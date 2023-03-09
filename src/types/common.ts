import type { Dayjs } from "dayjs";

export type NullableDayJs = Dayjs | null;

export type TimePeriod = [NullableDayJs, NullableDayJs]
