import { Box, Button, List, ListItem, ListItemIcon, ListSubheader, Paper, Typography } from "@mui/material";
import { Textarea } from "../components/TextArea";
import { AssignmentTurnedIn } from "@mui/icons-material";
import { useContext, useState } from "react";
import { RaffleContext } from "../contexts/RaffleContext";

export function Coupons() {
    const { raffleInput, generateFromCouponsList } = useContext(RaffleContext);
    const [couponsErrors, setCouponsErrors] = useState<string[]>([]);

    const dysplayResults = () => {

        if (couponsErrors.length === 0 && raffleInput.Max === 0)
            return <></>

        const base = (children: any, subheader: string) => <Paper
            elevation={10}
            sx={{
                marginLeft: '2vw',
                width: '100%',
                maxWidth: '40vw',
            }}>
            <List
                sx={{
                    height: '50vh',
                    overflowY: 'auto',
                }}
                dense={true}
                subheader={<ListSubheader component="div">{subheader}</ListSubheader>}
            >
                {children}
            </List>
        </Paper>

        if (couponsErrors.length !== 0)
            return base(couponsErrors
                .map((e, i) =>
                    <ListItem key={i}>
                        <ListItemIcon>
                            {e}
                        </ListItemIcon>
                    </ListItem>
                ),
                "Linhas com Atenção.");


        return base(
            <>
                <ListItem>
                    <ListItemIcon>
                        {`Total: ${raffleInput.Max}`}
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        {`Participantes: ${Object.keys(raffleInput.Participants).length}`}
                    </ListItemIcon>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        {`Distribuidos em:`}
                    </ListItemIcon>
                </ListItem>
                {
                    Object
                        .entries(raffleInput.Participants)
                        .map(([name, coupons]) => {
                            return {
                                name: name,
                                coupons: coupons
                            }
                        })
                        .sort((a, b) => (a.coupons > b.coupons) ? -1 : 1)
                        .map((p, i) =>
                            <ListItem key={i}>
                                <ListItemIcon>
                                    {`${p.coupons} para ${p.name}`}
                                </ListItemIcon>
                            </ListItem>
                        )
                }
            </>,
            "Cupons lidos com sucesso.");
    }

    return (
        <Box>
            <Typography
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    verticalAlign: 'midle',
                    paddingTop: '5vh'
                }}
                variant="h1">
                Cupons
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    verticalAlign: 'midle',
                    paddingTop: '5vh'
                }}
            >

                <Textarea
                    onChange={(e) => {

                        const textAreaValue = e.target.value;
                        const errors = generateFromCouponsList(textAreaValue);
                        setCouponsErrors(errors);
                    }}
                />

                {dysplayResults()}

            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    verticalAlign: 'midle',
                    paddingTop: '5vh'
                }}>
                <Button
                    sx={{
                        width: '100%',
                        marginLeft: '31vw',
                        marginRight: '31vw'
                    }}
                    disabled={raffleInput.Max === 0}
                    variant="outlined"
                    startIcon={<AssignmentTurnedIn />}
                // onClick={handleClick}
                >
                    Iniciar Sorteio
                </Button>
            </Box>

        </Box>
    )
}