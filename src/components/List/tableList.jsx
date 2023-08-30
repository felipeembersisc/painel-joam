import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

// project imports
import Avatar from '@/ui-component/extended/Avatar';

// ==============================|| USER LIST 1 ||============================== //

const TableList = ({ columns, rows }) => {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col, i) => (
                            <TableCell
                                align={`${columns.length - 1 === i && col === 'Ação' ? 'center' : 'left'}`}
                                key={`${col}-${i}`}
                                sx={i === 0 ? { pl: 3 } : col.length === i ? { pr: 3 } : {}}
                            >
                                {col}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows &&
                        rows.map((row, index) => (
                            <TableRow hover key={index}>
                                {row.map((item, i) => (
                                    (item?.type && item.type === 'user') ?
                                       <TableCell>
                                          <Grid container spacing={2} alignItems="center">
                                             <Grid item>
                                                <Avatar alt="User 1" src={item.foto} />
                                             </Grid>
                                             <Grid item xs zeroMinWidth>
                                                <Typography align="left" variant="subtitle1" component="div">
                                                   {item.nome}
                                                </Typography>
                                                <Typography align="left" variant="subtitle2" noWrap>
                                                   {item.email}
                                                </Typography>
                                             </Grid>
                                          </Grid>
                                       </TableCell>
                                    :
                                       <TableCell
                                          key={`${item}-${i}`}
                                          align={`${row.length === i && typeof item === 'object' ? 'center' : 'left'}`}
                                          sx={i === 0 ? { pl: 3 } : row.length === i ? { pr: 3 } : {}}
                                       >
                                          {item && item !== undefined ?  item : '-'}
                                       </TableCell>
                                ))}
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableList;
