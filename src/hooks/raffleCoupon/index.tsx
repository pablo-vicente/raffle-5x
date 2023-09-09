import { useEffect, useState } from "react";

export enum RaffleRevealNumbers {
    All = 1,
    RightToLeft = 2,
    LeftToRight = 3
}

export default function useRaffleCoupon(
    raffleReveal: RaffleRevealNumbers,
    min: number,
    max: number,
    duration: number = 5000,
    maxDurationFrameUpdate = 200
) {

    const [number, setNumber] = useState<number>(0);
    const [startTime, setStartTime] = useState<Date>(new Date(0));

    const maxCaracters = max.toString().length;
    const sorting = startTime.getTime() !== new Date(0).getTime();

    useEffect(() => {

        if (!sorting)
            return;

        const timeForElement = duration / maxCaracters;
        const timeSorted = (new Date().getTime() - startTime.getTime());
        const numbersSorted = Math.floor(timeSorted / timeForElement);
        const intervalDuration = maxDurationFrameUpdate * numbersSorted / maxCaracters;

        if (timeSorted >= duration) {
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
                        let numbers = (maxCaracters - numbersSorted);
                        leftpart = tempRandomNumber.slice(0, numbers);
                        rightPart = tempCoupon.slice(numbers);
                        break;

                    case RaffleRevealNumbers.LeftToRight:
                        leftpart = tempCoupon.slice(0, numbersSorted);
                        rightPart = tempRandomNumber.slice(numbersSorted);
                        break;
                }

                let finalNumber = [...leftpart, ...rightPart].join("")
                randomNumber = Number(finalNumber);

            }

            setNumber(randomNumber);

        }, intervalDuration);



        return () => clearInterval(intervalId);
    }, [raffleReveal, min, max, duration, maxDurationFrameUpdate, maxCaracters, startTime, number, sorting]);

    function randomFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    return {
        coupon: `${number}`.toString().padStart(maxCaracters, "0"),
        sorting: sorting,
        start: () => {
            setStartTime(new Date());
            setNumber(0);
        }
    };
}


// export default function useRevealCoupon(
//   min: number,
//   max: number,
//   duration: number = 5000,
//   maxDurationFrameUpdate = 200
// ) {
//   const maxCaracters = `${max}`.toString().length;
//   const [CouponInReveal, setCouponInReveal] = useState<number>(0);
//   const [number, setNumber] = useState<string>("0".padStart(maxCaracters, "0"));
//   const [startTime, setStartTime] = useState<Date>(new Date());

//   useEffect(() => {
//     if (CouponInReveal === Number(number))
//       return;

//     const stringValue = `${CouponInReveal}`.toString().padStart(maxCaracters, "0");
//     const length = stringValue.length - 1;
//     const timeForElement = duration / stringValue.length;
//     const timeSorted = (new Date().getTime() - startTime.getTime());
//     const positionIntSorted = Math.floor(timeSorted / timeForElement);
//     const positionRtl = length - positionIntSorted;
//     const intervalDuration = maxDurationFrameUpdate * positionIntSorted / stringValue.length;

//     const intervalId = setInterval(() => {
//       let temp: string[] = number.split("");
//       for (let index = length; index >= 0; index--) {
//         const originalValue = Number(stringValue[index]);

//         const positionNumber = index > positionRtl
//           ? originalValue
//           : randonNumber(originalValue)

//         temp[index] = String(positionNumber);
//       }
//       const newNumber = (temp.join(""));
//       setNumber(newNumber);

//     }, intervalDuration);

//     return () => clearInterval(intervalId);
//   }, [CouponInReveal, duration, maxCaracters, maxDurationFrameUpdate, number, startTime]);

//   function randonNumber(value: number) {
//     let randonNumber = Math.floor(Math.random() * (9 + 1));

//     do {
//       randonNumber = Math.floor(Math.random() * (9 + 1));
//     }
//     while (value === randonNumber)

//     return randonNumber;
//   }

//   function randomFromInterval(min: number, max: number) {
//     return Math.floor(Math.random() * (max - min + 1) + min)
//   }
//   return {
//     coupon: number,
//     sorting: CouponInReveal !== Number(number),
//     start: () => {
//       setStartTime(new Date());
//       setCouponInReveal(randomFromInterval(min, max));
//     }
//   };
// }