import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import './DataForm.css';
import dayjs from "dayjs";
import {FormControlLabel, Radio, RadioGroup, Typography, Button} from "@mui/material";
import {ChangeEvent, useCallback, useState} from "react";
import {DateRangePicker} from "../DateRangePicker/DateRangePicker";
import {NullableDayJs, TimePeriod} from "../../types/common";

const NO = 'no';
const YES = 'yes';
export const DataForm = () => {
    const [firstDate, setFirstDate] = useState<NullableDayJs>(null);
    const [isLeave, setIsLeave] = useState(NO);
    const [leavePeriods, setLeavePeriods] = useState<TimePeriod[]>([[null, null]]);

    const onIsLeaveChange = useCallback((_: ChangeEvent<HTMLInputElement>, value: string) => setIsLeave(value), [])

    const setPeriod = useCallback((index: number, newPeriod: TimePeriod) => {
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
         const totalOutside =  leavePeriods.reduce((acc, [from, to]) =>
             from && to ? acc += to.diff(from, 'day') : acc, 0);

         const totalDays = dayjs().diff(firstDate, 'day') ;
         const daysOnCyprus = totalDays - totalOutside;

         console.log({
             totalDays,
             totalOutside,
             daysOnCyprus
         })
     }, [firstDate, leavePeriods]);

    return (
        <div className="form">
            <Typography variant="h6">Первый день на острове</Typography>
            <div className="formInput">
                    <DesktopDatePicker
                        value={firstDate}
                        onChange={setFirstDate}
                        format="DD.MM.YYYY"
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
            {isLeave === 'yes' && (
                <div>
                    <Typography variant="h6">Укажите периоды отсутствия</Typography>
                    <div className="formInput">
                        {leavePeriods.map((period, index) => <DateRangePicker
                            key={`${index}${period[0]?.toISOString()}`}
                            value={period}
                            index={index}
                            onChange={setPeriod}
                            onDelete={deletePeriod}
                        />)}
                    </div>
                </div>
            )}

            <Button disabled={!firstDate} variant="contained" onClick={calculateDays}>Расчитать</Button>
        </div>
    )
}
