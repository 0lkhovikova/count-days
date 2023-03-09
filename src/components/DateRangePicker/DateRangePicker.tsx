import * as dayjs from "dayjs";
import {DesktopDatePicker} from "@mui/x-date-pickers/DesktopDatePicker";
import {useCallback} from "react";
import './DateRangePicker.css';
import DeleteIcon from '@mui/icons-material/Delete';
import {TimePeriod} from "../../types/common";

type DateRangePickerProps = {
    value: TimePeriod;
    onChange: (index: number, value: TimePeriod) => void;
    onDelete:  (index: number) => void;
    index: number
}

export const DateRangePicker = ({ value, onChange, onDelete, index }: DateRangePickerProps) => {
    const firstDate = value?.[0];
    const secondDate = value?.[1];

    const setFirstDate = useCallback((value: dayjs.Dayjs | null) => {
        onChange(index, [value, secondDate])
    }, [onChange, index, secondDate]);

    const setSecondDate = useCallback((value: dayjs.Dayjs | null) => {
        onChange(index, [firstDate, value])
    }, [onChange, index, firstDate]);

    const deleteRange = useCallback(() => {
        onDelete(index);
    }, [onDelete, index])

    return (<div className="dataPicker">
        <DesktopDatePicker
            value={firstDate}
            onChange={setFirstDate}
            format="DD.MM.YYYY"
        />
        <div className="dataPickerDivider">
            {'   -   '}
        </div>
        <DesktopDatePicker
            value={secondDate}
            onChange={setSecondDate}
            format="DD.MM.YYYY"
        />
        {(firstDate || secondDate) && <div className="dataPickerDelete" onClick={deleteRange}>
            <DeleteIcon/>
        </div>}
    </div>)
}
