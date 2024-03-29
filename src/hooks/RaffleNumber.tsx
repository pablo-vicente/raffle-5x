import { useCallback, useEffect, useState } from "react";
import { RaffleRevealNumbers } from "../types";

type IUseRaffleNumberControll = {
    number: number,
    startTime: Date
}

export default function useRaffleNumber(
    raffleReveal: RaffleRevealNumbers,
    min: number,
    max: number,
    durationSencods: number,
    maxDurationFrameUpdate: number = 200
) {

    const duration = durationSencods * 1000;
    const [controll, setControll] = useState<IUseRaffleNumberControll>({
        number: 0,
        startTime: new Date(0)
    });

    const maxCaracters = max.toString().length;
    const inRaffle = controll.startTime.getTime() !== new Date(0).getTime();

    useEffect(() => {

        if (!inRaffle)
            return;

        const timeForElement = duration / maxCaracters;
        const timeRaffled = (new Date().getTime() - controll.startTime.getTime());
        const numbersRaffled = Math.floor(timeRaffled / timeForElement);
        const intervalDuration = maxDurationFrameUpdate * numbersRaffled / maxCaracters;

        if (timeRaffled >= duration) {
            setControll((previous) => ({
                ...previous,
                startTime: new Date(0)
            }));
        }

        const intervalId = setInterval(() => {

            let randomNumber;

            if (raffleReveal !== RaffleRevealNumbers.All) {

                let tempCoupon = controll.number
                    .toString()
                    .padStart(maxCaracters, "0")
                    .split("");

                let leftpart;
                let rightPart;

                switch (raffleReveal) {

                    case RaffleRevealNumbers.RightToLeft:
                        let numbers = (maxCaracters - numbersRaffled);
                        rightPart = tempCoupon.slice(numbers);

                        const maxRandonNumber = max - Number(rightPart.join(""));

                        leftpart = randomFromInterval(min, maxRandonNumber)
                            .toString()
                            .padStart(maxCaracters, "0")
                            .split("")
                            .slice(0, numbers);

                        break;

                    case RaffleRevealNumbers.LeftToRight:
                        leftpart = tempCoupon.slice(0, numbersRaffled);

                        const minLeft = leftpart
                            .join("")
                            .padEnd(maxCaracters, "0");

                        rightPart = randomFromInterval(Number(minLeft), max)
                            .toString()
                            .padStart(maxCaracters, "0")
                            .split("")
                            .slice(numbersRaffled);

                        break;
                }

                const finalNumber = [...leftpart, ...rightPart].join("");
                randomNumber = Number(finalNumber);

            } else {
                randomNumber = randomFromInterval(min, max);
            }
            setControll({
                ...controll,
                number: randomNumber
            });

        }, intervalDuration);

        return () => clearInterval(intervalId);
    }, [controll, duration, inRaffle, max, maxCaracters, maxDurationFrameUpdate, min, raffleReveal]);

    function randomFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const start = useCallback(() => {
        setControll({
            number: 0,
            startTime: new Date()
        })
    }, []);
    return {
        numberRaffled: `${controll.number}`.toString().padStart(maxCaracters, "0"),
        inRaffle: inRaffle,
        start: start
    };
}