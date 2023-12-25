import { Box, Button, FormControlLabel, List, ListItem, ListItemIcon, ListSubheader, Paper, Radio, RadioGroup, Tooltip, Typography, styled } from "@mui/material";
import { Textarea } from "../components/TextArea";
import { AssignmentTurnedIn, CloudUpload, LiveHelp } from "@mui/icons-material";
import { ChangeEvent, useContext, useState } from "react";
import { ListInput, RaffleContext } from "../contexts/RaffleContext";
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

const placeholderAllCupons = `Escreva aqui os cupons e participantes, separados por vírgula e quebra de linha (Enter). 
Ex: 
    1, Nome 1
    2, Nome 2
    3, Nome 3`;

const placeholderParticipants = `Escreva aqui os participantes e sua quantidades de cupons, separados por vírgula e quebra de linha (Enter). 
Ex: 
    Nome 1, 500
    Nome 2, 600
    Nome 3, 700`

export function Coupons() {
    const { raffleInput, readRaffleInputFromText, originalInput } = useContext(RaffleContext);
    const [couponsErrors, setCouponsErrors] = useState<string[]>([]);
    const [typeInputList, setTypeInputList] = useState<ListInput>(ListInput.AllCupons);

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

    const handleInputListChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const listType = Number((event.target as HTMLInputElement).value);
        setTypeInputList(listType);
        handleTextAreaInput(originalInput, listType);
    };

    const handleTextAreaInput = (textAreaValue: string, listType: ListInput) => {
        const errors = readRaffleInputFromText(textAreaValue, listType);
        setCouponsErrors(errors);
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
                    marginTop: '2vh',
                }}
            >
                <RadioGroup
                    row
                    value={typeInputList}
                    onChange={handleInputListChange}>
                    <FormControlLabel
                        value={ListInput.AllCupons}
                        control={<Radio />}
                        label="Todos os Cupons"
                    />
                    <FormControlLabel
                        value={ListInput.Participants}
                        control={<Radio />}
                        label="Participantes"
                    />
                </RadioGroup>
                <Tooltip title={
                    <>
                        <Typography color="inherit">
                            <b>Todos os Cupons</b>: Lista com todos os cupons já definidos.
                        </Typography>
                        <Typography color="inherit">
                            <b>Participantes</b>: Lista com todos os participantes e sua quantidade de cupons, será sorteado os cupons.
                        </Typography>
                    </>

                }>
                    <LiveHelp sx={{ color: 'warning.main' }} />
                </Tooltip>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    verticalAlign: 'midle',
                }}
            >

                <Textarea
                    placeholder={typeInputList === ListInput.AllCupons
                        ? placeholderAllCupons
                        : placeholderParticipants}
                    value={originalInput}
                    onChange={(e) => handleTextAreaInput(e.target.value, typeInputList)}
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
                    Ou envie um arquivo txt
                    <VisuallyHiddenInput
                        type="file"
                        accept=".txt"
                        onChange={async (event: ChangeEvent<HTMLInputElement>) => {
                            const file = event.target.files?.[0];

                            if (file) {
                                try {
                                    const content = await readFile(file);
                                    handleTextAreaInput(content, typeInputList);
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