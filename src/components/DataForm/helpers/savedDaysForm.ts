import dayjs from "dayjs";
import {NullableDayJs, TimePeriod} from "../../../types/common";

export const saveToLocalStorage = ({ firstDate, leavePeriods }: { firstDate: NullableDayJs, leavePeriods: TimePeriod[] })=> JSON.stringify({
    fd: firstDate?.toString(),
    lp: leavePeriods.filter(period => period[0] && period[1]).map((period) => [period[0]?.toString(), period[1]?.toString()])
})

export const parseFromLocalStorage = (formRaw: string | null) => {
    let firstDay: NullableDayJs = null

    let leavePeriods: TimePeriod[] = []

    try {
        const form: {
            fd?: string
            lp?: [string, string][]
        } = JSON.parse(formRaw ?? '');

        if (form.fd) {
            firstDay = dayjs(form.fd)
        }

        if (form.lp) {
            leavePeriods = form.lp.map((periods) => [dayjs(periods[0]), dayjs(periods[1])])
        }
    } catch { /* empty */ }

    return {
        firstDay,
        leavePeriods,
    }
}
