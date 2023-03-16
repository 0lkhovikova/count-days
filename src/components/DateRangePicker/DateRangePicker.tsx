import * as dayjs from "dayjs";
import {FC, useCallback} from "react";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import './DateRangePicker.css';
import DeleteIcon from '@mui/icons-material/Delete';
import {NullableDayJs, TimePeriod} from "../../types/common";

type DateRangePickerProps = {
    value: TimePeriod;
    id: number
    minDate: NullableDayJs
    maxDate: NullableDayJs
    isError: boolean
    onChange: (id: number, value: TimePeriod) => void;
    onDelete:  (id: number) => void;
}

export const DateRangePicker: FC<DateRangePickerProps> = ({ value, id, minDate, maxDate, isError, onChange, onDelete }) => {
    const firstDate = value?.[0];
    const secondDate = value?.[1];

    const setFirstDate = useCallback((value: dayjs.Dayjs | null) => {
        onChange(id,[value, secondDate], )
    }, [onChange, id, secondDate]);

    const setSecondDate = useCallback((value: dayjs.Dayjs | null) => {
        onChange(id,[firstDate, value])
    }, [onChange, id, firstDate]);

    const deleteRange = useCallback(() => {
        onDelete(id);
    }, [onDelete, id])

    return (
        <>
            <div className={`dataPicker ${isError ? 'dataPickerError' : ''}`}>
                <DesktopDatePicker
                    value={firstDate}
                    onChange={setFirstDate}
                    minDate={minDate || undefined}
                    maxDate={secondDate || maxDate || undefined}
                    format="DD.MM.YYYY"
                />
                <div className="dataPickerDivider">
                    {'   -   '}
                </div>
                <DesktopDatePicker
                    value={secondDate}
                    onChange={setSecondDate}
                    minDate={firstDate || minDate || undefined}
                    maxDate={maxDate || undefined}
                    format="DD.MM.YYYY"
                />
                {(firstDate || secondDate) && <div className="dataPickerDelete" onClick={deleteRange}>
                    <DeleteIcon/>
                </div>}
            </div>
            {isError && <div className="dataPickerErrorMessage">Проверьте корректность этих периодов</div>}
        </>
    )
}
