import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import './DataForm.css';
import dayjs from "dayjs";
import {FormControlLabel, Radio, RadioGroup, Typography, Button} from "@mui/material";
import {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from "react";
import {DateRangePicker} from "../DateRangePicker/DateRangePicker";
import {NullableDayJs, TimePeriod} from "../../types/common";
import {ResultTable} from "../ResultTable/ResultTable";
import {parseFromLocalStorage, saveToLocalStorage} from "./helpers/savedDaysForm";
import {checkPeriods} from "./helpers/validate";

const NO = 'no';
const YES = 'yes';
export const DataForm: FC = () => {
    const [firstDate, setFirstDate] = useState<NullableDayJs>(null);
    const [isLeave, setIsLeave] = useState(NO);
    const [leavePeriods, setLeavePeriods] = useState<TimePeriod[]>([[null, null]]);
    const [errorPeriodIndexes, setErrorPeriodIndexes] = useState<(boolean | undefined)[]>([])
    const [result, setResult] = useState<{ totalDays: number; totalOutside: number; resultDays: number }>()

    const currentDay = useMemo(() => dayjs(), [])

    useEffect(() => {
        const formRaw = localStorage.getItem('days-form');

        const form = parseFromLocalStorage(formRaw);

        setFirstDate(form.firstDay);

        if (form.leavePeriods.length) {
            setIsLeave(YES);

            setLeavePeriods([...form.leavePeriods, [null, null]]);
        }
    }, [])

    const onIsLeaveChange = useCallback((_: ChangeEvent<HTMLInputElement>, value: string) => setIsLeave(value), [])

    const setPeriod = useCallback((index: number, newPeriod: TimePeriod) => {
        setErrorPeriodIndexes([])

        setLeavePeriods(periods => {
            const newValue = [...periods];
            newValue[index] = newPeriod;

            if (newValue.at(-1)?.[0] && newValue.at(-1)?.[1]) {
                newValue.push([null, null]);
            }

            return newValue
        })
    }, [])

    const deletePeriod = useCallback((index: number) => {
        setErrorPeriodIndexes([])

        setLeavePeriods(periods => {
            const newValue = [...periods];
            newValue.splice(index, 1);

            if (!newValue.length) {
                newValue.push([null, null]);
            }

            return newValue
        })
    }, [])

     const calculateDays = useCallback(() => {
         const errorPeriods = checkPeriods(leavePeriods);

         if (errorPeriods.length) {
             setErrorPeriodIndexes(errorPeriods.reduce((acc, index) => {
                 acc[index] = true

                 return acc
             }, [] as (boolean | undefined)[]))
             return;
         }

         const totalOutside =  isLeave === YES ? leavePeriods.reduce((acc, [from, to]) =>
             from && to ? acc += to.diff(from, 'day') : acc, 0) : 0;

         const totalDays = currentDay.diff(firstDate, 'day') ;
         const resultDays = totalDays - totalOutside;

         setResult({ totalDays, totalOutside, resultDays })

         localStorage.setItem('days-form', saveToLocalStorage({ firstDate, leavePeriods }));
     }, [isLeave, firstDate, leavePeriods]);

    return (
        <div className="form">
            <Typography variant="h6">Первый день на острове</Typography>
            <div className="formInput">
                    <DesktopDatePicker
                        value={firstDate}
                        onChange={setFirstDate}
                        format="DD.MM.YYYY"
                        maxDate={currentDay}
                    />
            </div>
            <Typography variant="h6">Уезжали ли вы с острова? </Typography>
            <div className="formInput">
                    <RadioGroup
                        row
                        value={isLeave}
                        onChange={onIsLeaveChange}
                    >
                        <FormControlLabel value={NO} control={<Radio />} label="Нет" />
                        <FormControlLabel value={YES} control={<Radio />} label="Да" />
                    </RadioGroup>
            </div>
            {isLeave === YES && (
                <div>
                    <Typography variant="h6">Укажите периоды отсутствия</Typography>
                    <div className="formInput">
                        {leavePeriods.map((period, index) => <DateRangePicker
                            key={`${index}${period[0]?.toISOString()}`}
                            value={period}
                            id={index}
                            minDate={firstDate}
                            maxDate={currentDay}
                            onChange={setPeriod}
                            onDelete={deletePeriod}
                            isError={!!errorPeriodIndexes[index]}
                        />)}
                    </div>
                </div>
            )}

            <Button disabled={!firstDate} variant="contained" onClick={calculateDays}>Расчитать</Button>

            <ResultTable totalDays={result?.totalDays} totalOutside={result?.totalOutside} resultDays={result?.resultDays} />
        </div>
    )
}
