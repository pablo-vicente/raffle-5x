import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Box, Button, FormControlLabel, FormLabel, List, ListItem, ListItemIcon, ListSubheader, Paper, Radio, RadioGroup, TextField, Tooltip, Typography, styled } from "@mui/material";
import { Textarea } from "../components/TextArea";
import { AssignmentTurnedIn, CloudUpload, ExpandMore, LiveHelp } from "@mui/icons-material";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Page } from "../App";
import { ListInput, RaffleRevealNumbers, RankDisplay } from "../types";
import useRaffleNumber from "../hooks/RaffleNumber";
import { RaffleContext } from "../contexts/RaffleContext";
import { renderParticipant } from "../components/Rank";

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

function RaffleNumberExemple({
    raffleReveal,
    duration,
}: {
    raffleReveal: RaffleRevealNumbers,
    duration: number,
}) {
    const [raffleRevealSelected, setRaffleRevealSelected] = useState<RaffleRevealNumbers>(0 as RaffleRevealNumbers);
    const [raffleDuration, setRaffleDuration] = useState<number>(0);
    const { numberRaffled, inRaffle, start } = useRaffleNumber(
        raffleReveal,
        1,
        99999,
        duration);

    useEffect(() => {

        if (raffleRevealSelected === raffleReveal && raffleDuration === duration)
            return;

        if (raffleRevealSelected !== raffleReveal)
            setRaffleRevealSelected(raffleReveal);

        if (raffleDuration !== duration)
            setRaffleDuration(duration);


        if (inRaffle)
            return;
        start();

    }, [duration, inRaffle, raffleDuration, raffleReveal, raffleRevealSelected, start])

    return (<Box sx={{
        backgroundColor: 'goldenrod',
        color: 'white'
    }}
    >
        Ex: {numberRaffled}
    </Box >);
}

export function Coupons() {
    const {
        raffleInput,
        readRaffleInputFromText,
        originalInput,
        raffleSettings,
        updateRaffleSettings
    } = useContext(RaffleContext);
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

    const handleRaffleRevealNumbers = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRaffleSettings({
            ...raffleSettings,
            RaffleReveal: Number((event.target as HTMLInputElement).value)
        })
    };

    const handleTimeRaffleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRaffleSettings({
            ...raffleSettings,
            DurationSencods: Number((event.target as HTMLInputElement).value)
        })
    };

    const handleCouponsWinnerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRaffleSettings({
            ...raffleSettings,
            MaxCouponsRaffle: Number((event.target as HTMLInputElement).value)
        })
    };

    const handleRankDisplayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        updateRaffleSettings({
            ...raffleSettings,
            RankDisplay: Number((event.target as HTMLInputElement).value)
        })
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
                    marginTop: '2vh',
                }}
            >
                <RadioGroup
                    row
                    value={typeInputList}
                    onChange={handleInputListChange}>
                    <FormControlLabel
                        value={ListInput.AllCupons}
                        control={<Radio size="small" />}
                        label="Todos os Cupons"
                    />
                    <FormControlLabel
                        value={ListInput.Participants}
                        control={<Radio size="small" />}
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

                <Paper
                    elevation={3}
                    sx={{
                        marginTop: '2vh',
                    }}
                >
                    <Accordion
                        defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<ExpandMore />}
                        >
                            <Typography>Configurações Sorteio</Typography>
                        </AccordionSummary>
                        <AccordionDetails>

                            <Box
                                component="form"
                                sx={{
                                    '& .MuiTextField-root': { mb: 1 },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <FormLabel>Tempo (s) de sorteio de cada cupom</FormLabel>
                                <TextField
                                    className="teste"
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    defaultValue={raffleSettings.DurationSencods}
                                    InputProps={
                                        {
                                            inputProps: {
                                                min: 1,
                                                max: 10
                                            }
                                        }}
                                    onChange={handleTimeRaffleChange}
                                />
                                <FormLabel sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                                >
                                    Formato Revelação Cupom&nbsp;
                                    <RaffleNumberExemple
                                        raffleReveal={raffleSettings.RaffleReveal}
                                        duration={raffleSettings.DurationSencods}
                                    />
                                </FormLabel>
                                <RadioGroup
                                    value={raffleSettings.RaffleReveal}
                                    onChange={handleRaffleRevealNumbers}
                                >
                                    <FormControlLabel value={RaffleRevealNumbers.All} control={<Radio size="small" />} label="Todos ao Mesmo Tempo" />
                                    <FormControlLabel value={RaffleRevealNumbers.RightToLeft} control={<Radio size="small" />} label="Direita para Esquerda" />
                                    <FormControlLabel value={RaffleRevealNumbers.LeftToRight} control={<Radio size="small" />} label="Esquera para Direita" />
                                </RadioGroup>
                                <FormLabel>Quantidade de cupons que um participante deve ter para ganhar</FormLabel>
                                <TextField
                                    size="small"
                                    fullWidth
                                    variant="standard"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    defaultValue={raffleSettings.MaxCouponsRaffle}
                                    InputProps={
                                        {
                                            inputProps: {
                                                min: 1,
                                                max: 10
                                            }
                                        }}
                                    onChange={handleCouponsWinnerChange}
                                />
                                <FormLabel sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap'
                                }}
                                >
                                    Formato Exibição Rank&nbsp;
                                    {renderParticipant(raffleSettings.RankDisplay, raffleSettings.MaxCouponsRaffle, Math.ceil(raffleSettings.MaxCouponsRaffle / 2))}
                                </FormLabel>
                                <RadioGroup
                                    value={raffleSettings.RankDisplay}
                                    onChange={handleRankDisplayChange}
                                >
                                    <FormControlLabel
                                        value={RankDisplay.MultipleIcons}
                                        control={<Radio size="small" />}
                                        label="Marcação"
                                    />
                                    <FormControlLabel
                                        value={RankDisplay.SingleIcon}
                                        control={<Radio size="small" />}
                                        label="Contador"
                                    />
                                </RadioGroup>
                            </Box>


                        </AccordionDetails>
                        <AccordionActions>

                        </AccordionActions>
                    </Accordion>
                </Paper>

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