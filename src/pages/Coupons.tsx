import { Alert, Box, Button, List, ListItem, ListItemIcon, ListSubheader, Paper, Typography, styled } from "@mui/material";
import { Textarea } from "../components/TextArea";
import { AssignmentTurnedIn, CloudUpload } from "@mui/icons-material";
import { ChangeEvent, useContext, useState } from "react";
import { RaffleContext } from "../contexts/RaffleContext";
import { Link } from "react-router-dom";
import { Page } from "../App";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export function Coupons() {
    const { raffleInput, generateFromCouponsList, originalInput } = useContext(RaffleContext);
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

    const readFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                resolve(event?.target?.result?.toString() ?? "Não foi possível ler o arquivo.");
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsText(file);
        });
    };

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
                    value={originalInput}
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
                    flexFlow: 'column',
                    justifyContent: 'center',
                    verticalAlign: 'midle',
                    marginTop: '2vh',
                    marginLeft: '31vw',
                    marginRight: '31vw'
                }}>
                <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUpload />}
                >
                    Ou envie um arquivo csv/txt
                    <VisuallyHiddenInput
                        type="file"
                        accept=".txt"
                        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                try {
                                    const content = await readFile(file);
                                    const errors = generateFromCouponsList(content);
                                    setCouponsErrors(errors);
                                } catch (error) {
                                    console.error('Error reading file:', error);
                                }
                            }
                        }}
                    />
                </Button>

                <Button
                    component={Link}
                    to={"/" + Page.Dashboard}
                    sx={{
                        marginTop: '2vh',
                    }}
                    disabled={raffleInput.Max === 0}
                    variant="outlined"
                    startIcon={<AssignmentTurnedIn />}
                >
                    Iniciar Sorteio
                </Button>
            </Box>

        </Box>
    )
}