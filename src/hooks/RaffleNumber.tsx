import { useCallback, useEffect, useState } from "react";
import { RaffleRevealNumbers } from "../types";

export default function useRaffleNumber(
    raffleReveal: RaffleRevealNumbers,
    min: number,
    max: number,
    durationSencods: number = 5,
    maxDurationFrameUpdate: number = 200
) {

    const duration = durationSencods * 1000;
    const [number, setNumber] = useState<number>(0);
    const [startTime, setStartTime] = useState<Date>(new Date(0));

    const maxCaracters = max.toString().length;
    const inRaffle = startTime.getTime() !== new Date(0).getTime();

    useEffect(() => {

        if (!inRaffle)
            return;

        const timeForElement = duration / maxCaracters;
        const timeRaffled = (new Date().getTime() - startTime.getTime());
        const numbersRaffled = Math.floor(timeRaffled / timeForElement);
        const intervalDuration = maxDurationFrameUpdate * numbersRaffled / maxCaracters;

        if (timeRaffled >= duration) {
            setStartTime(new Date(0));
            return;
        }

        const intervalId = setInterval(() => {

            let randomNumber = randomFromInterval(min, max);

            if (raffleReveal !== RaffleRevealNumbers.All) {

                let tempRandomNumber = randomNumber
                    .toString()
                    .padStart(maxCaracters, "0")
                    .split("");
                let tempCoupon = number
                    .toString()
                    .padStart(maxCaracters, "0")
                    .split("");

                let leftpart;
                let rightPart;

                switch (raffleReveal) {

                    case RaffleRevealNumbers.RightToLeft:
                        let numbers = (maxCaracters - numbersRaffled);
                        leftpart = tempRandomNumber.slice(0, numbers);
                        rightPart = tempCoupon.slice(numbers);
                        break;

                    case RaffleRevealNumbers.LeftToRight:
                        leftpart = tempCoupon.slice(0, numbersRaffled);
                        rightPart = tempRandomNumber.slice(numbersRaffled);
                        break;
                }

                let finalNumber = [...leftpart, ...rightPart].join("")
                randomNumber = Number(finalNumber);

                if (randomNumber > max) {

                    const minRandonNumber = leftpart
                        .join()
                        .padEnd(maxCaracters, "0");
                    randomNumber = randomFromInterval(Number(minRandonNumber), max);
                }

            }
            setNumber(randomNumber);

        }, intervalDuration);



        return () => clearInterval(intervalId);
    }, [raffleReveal, min, max, duration, maxDurationFrameUpdate, maxCaracters, startTime, number, inRaffle]);

    function randomFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const start = useCallback(() => {
        setStartTime(new Date());
        setNumber(0);
    }, []);
    return {
        numberRaffled: `${number}`.toString().padStart(maxCaracters, "0"),
        inRaffle: inRaffle,
        start: start
    };
}