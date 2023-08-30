import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Grid, InputAdornment, Menu, MenuItem, OutlinedInput, Pagination, Typography } from '@mui/material';

// project imports
import UserList from './tableList';
import MainCard from '@/ui-component/cards/MainCard';
import { gridSpacing } from '@/store/constant';

// assets
import { IconSearch } from '@tabler/icons';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

// ==============================|| USER LIST STYLE 1 ||============================== //

export const List = ({ name, columns, rows }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <MainCard
            title={
                <Grid container alignItems="center" justifyContent="space-between" spacing={gridSpacing}>
                    <Grid item>
                        <Typography variant="h3">{name}</Typography>
                    </Grid>
                    <Grid item>
                        <OutlinedInput
                            id="input-search-list-style1"
                            placeholder="Search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="16px" />
                                </InputAdornment>
                            }
                            size="small"
                        />
                    </Grid>
                </Grid>
            }
            content={false}
        >
            <UserList columns={columns} rows={rows} />
            <Grid item xs={12} sx={{ p: 3 }}>
                <Grid container justifyContent="end" spacing={gridSpacing}>
                  {/* <Grid item>
                     <Button
                           size="large"
                           sx={{ color: theme.palette.grey[900] }}
                           color="secondary"
                           endIcon={<ExpandMoreRoundedIcon />}
                           onClick={handleClick}
                     >
                           10 Rows
                     </Button>
                     {anchorEl && (
                           <Menu
                              id="menu-user-list-style1"
                              anchorEl={anchorEl}
                              keepMounted
                              open={Boolean(anchorEl)}
                              onClose={handleClose}
                              variant="selectedMenu"
                              anchorOrigin={{
                                 vertical: 'top',
                                 horizontal: 'right'
                              }}
                              transformOrigin={{
                                 vertical: 'bottom',
                                 horizontal: 'right'
                              }}
                           >
                              <MenuItem onClick={handleClose}> 10 Rows</MenuItem>
                              <MenuItem onClick={handleClose}> 20 Rows</MenuItem>
                              <MenuItem onClick={handleClose}> 30 Rows </MenuItem>
                           </Menu>
                     )}
                  </Grid> */}
                  <Grid item>
                     <Pagination count={10} color="primary" />
                  </Grid>
                </Grid>
            </Grid>
        </MainCard>
    );
};
