import {
    Box,
    Divider,
    Paper,
    Typography,
    styled,
} from "@mui/material";


const border = '5px solid';
const widthAndHeight = '40px';
const position = '-5px';
const TicketTop = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    position: 'relative',
    float: 'left',
    border: '5px solid',

    '&:after, &:before': {
        content: "''",
        position: 'absolute',
        zIndex: 1,
        width: widthAndHeight,
        height: widthAndHeight,
        backgroundColor: theme.palette.background.paper,
        top: position,
    },
    '&::after': {
        left: position,
        borderRight: border,
        borderBottom: border,
        borderRadius: `0 0 ${widthAndHeight} 0px`,
    },

    '&:before': {
        right: position,
        borderLeft: border,
        borderBottom: border,
        borderRadius: `0 0 0 ${widthAndHeight}`,
    },
}));

const TicketBotton = styled('div')(({ theme }) => ({
    background: theme.palette.background.paper,
    '&:after, &:before': {
        content: "''",
        position: 'absolute',
        zIndex: 1,
        width: widthAndHeight,
        height: widthAndHeight,
        backgroundColor: theme.palette.background.paper,
        bottom: position,
    },
    '&::after': {
        left: position,
        borderRight: border,
        borderTop: border,
        borderRadius: `0 ${widthAndHeight} 0 0px`,
    },

    '&:before': {
        right: position,
        borderLeft: border,
        borderTop: border,
        borderRadius: `${widthAndHeight} 0 0 0`,
    },
}));
export function Ticket({
    number,
    name
}: {
    number: number | string,
    name: string
}) {
    return (

        <Box>
            <Paper>
                <TicketTop >
                    <TicketBotton>
                        <Box sx={{
                            margin: '3px',
                            border: '2px dashed',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>

                            <Typography
                                variant="h1"
                                sx={{
                                    fontFamily: 'Algerian',
                                    padding: '10px 60px',
                                    textWrap: 'nowrap'
                                }}>
                                {'Nº ' + number}
                            </Typography>

                            <Divider sx={{
                                marginTop: '-25px',
                                width: '70%',
                                border: '1px dashed'
                            }} />

                            <Typography
                                variant="h6"
                                sx={{
                                    maxWidth: '70%'
                                }}
                            >
                                {name.trim() ? name.trim().toUpperCase() : "NOME"}
                            </Typography>

                        </Box>


                    </TicketBotton>
                </TicketTop>
            </Paper>

        </Box >


    )
}