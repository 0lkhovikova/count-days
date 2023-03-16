import React, {FC} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import './ResultTable.css'

type ResultTableProps = { totalDays?: number; totalOutside?: number; resultDays?: number }

export const ResultTable: FC<ResultTableProps> = ({ totalDays, totalOutside, resultDays }) => {
    if (totalDays === undefined || totalOutside === undefined || resultDays === undefined) {
        return null
    }

    return (
        <Table className='resultTable'>
            <TableHead>
                <TableRow>
                    <TableCell></TableCell>
                    <TableCell align="left">Колличесиво дней</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow className='resultTableRow'>
                    <TableCell component="th" scope="row">
                        Общее колличество дней
                    </TableCell>
                    <TableCell scope="row">
                        {totalDays}
                    </TableCell>
                </TableRow>
                <TableRow className='resultTableRow'>
                    <TableCell component="th" scope="row">
                        Отсутствие на острове
                    </TableCell>
                    <TableCell scope="row">
                        {totalOutside}
                    </TableCell>
                </TableRow>
                <TableRow className='resultTableRow'>
                    <TableCell component="th" scope="row">
                        На острове
                    </TableCell>
                    <TableCell scope="row">
                        {resultDays}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}
