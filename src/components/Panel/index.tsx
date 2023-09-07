import {
    Box,
    Paper,
    Typography,
} from "@mui/material";
import { useEffect, useState } from 'react';

const duration = 5000;
const mininalDuration = 10;

export function Panel({ cupom }: { cupom: number }) {
    const [number, setNumber] = useState<string>("0");
    const [timeSorted, setTimeSorted] = useState<number>(0);

    useEffect(() => {
        console.log(cupom)
        if (cupom === Number(number))
            return;

        const intervalId = setInterval(() => {

            const stringValue = `${cupom}`.toString();
            const timeForElement = duration / stringValue.length;
            const length = stringValue.length - 1;

            const positionIntSorted = Math.floor(timeSorted / timeForElement);
            const positionRtl = length - positionIntSorted;

            let temp: number[] = [];
            for (let index = length; index >= 0; index--) {
                const originalValue = Number(stringValue[index]);

                const positionNumber = index > positionRtl
                    ? originalValue
                    : randonNumber(originalValue)

                temp[index] = Number(positionNumber);
                const newNumber = (temp.join(""));
                setNumber(newNumber);
            }

            const time = timeSorted >= duration
                ? 0
                : timeSorted + mininalDuration;

            setTimeSorted(time);
        }, mininalDuration);

        return () => clearInterval(intervalId);
    }, [cupom, number, timeSorted]);


    function randonNumber(value: number) {
        let randonNumber = Math.floor(Math.random() * (9 + 1));

        do {
            randonNumber = Math.floor(Math.random() * (9 + 1));
        }
        while (value === randonNumber)

        return randonNumber;
    }


    return (

        <Box sx={{ padding: '2vh' }}>
            <Paper elevation={3} sx={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h1" sx={{ fontFamily: 'Algerian' }}>
                    {number}
                </Typography>
            </Paper>
        </Box>
    )
}