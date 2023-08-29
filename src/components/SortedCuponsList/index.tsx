import * as React from 'react';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ListSubheader, Paper } from '@mui/material';

const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

export type ISortedCupon = {
    Code: number,
    Name: string
};

export function SortedCuponsList({ sotedCupons }: { sotedCupons: ISortedCupon[] }) {
    return (
        <Paper square={true} sx={{ width: '100%', height: '100vh', overflowY: 'auto', maxWidth: 360 }}>
            <Demo>
                <List
                    dense={true}
                    sx={{ width: '100%', maxWidth: 360, }}
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                                Cupons Sorteados
                            </Typography>
                        </ListSubheader>
                    }
                >
                    {
                        sotedCupons.map((cupon,index) =>

                            <ListItem key={index}>
                                <ListItemIcon>
                                    {cupon.Code}
                                </ListItemIcon>
                                <ListItemText
                                    primary={cupon.Name}
                                />
                            </ListItem>
                        )

                    }
                </List>
            </Demo>
        </Paper>
    );
}

