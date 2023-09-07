import { useEffect, useState } from "react";

const maxRandonInteration = 200;

export default function useRevealCupom(duration: number = 5000) {
  const [cupomInReveal, setCupomInReveal] = useState<number>(0);
  const [number, setNumber] = useState<string>("0");
  const [startTime, setStartTime] = useState<Date>(new Date());

  useEffect(() => {
    if (cupomInReveal === Number(number))
      return;

    const stringValue = `${cupomInReveal}`.toString();
    const length = stringValue.length - 1;
    const timeForElement = duration / stringValue.length;
    const timeSorted = (new Date().getTime() - startTime.getTime());
    const positionIntSorted = Math.floor(timeSorted / timeForElement);
    const positionRtl = length - positionIntSorted;
    const intervalDuration = maxRandonInteration * positionIntSorted / stringValue.length;

    const intervalId = setInterval(() => {
      let temp: number[] = [];
      for (let index = length; index >= 0; index--) {
        const originalValue = Number(stringValue[index]);

        const positionNumber = index > positionRtl
          ? originalValue
          : randonNumber(originalValue)

        temp[index] = Number(positionNumber);
      }
      const newNumber = (temp.join(""));
      setNumber(newNumber);

    }, intervalDuration);

    return () => clearInterval(intervalId);
  }, [cupomInReveal, duration, number, startTime]);

  function randonNumber(value: number) {
    let randonNumber = Math.floor(Math.random() * (9 + 1));

    do {
      randonNumber = Math.floor(Math.random() * (9 + 1));
    }
    while (value === randonNumber)

    return randonNumber;
  }

  return {
    randomNumber: number,
    setRevealCupom: (cupom: number) => {
      setCupomInReveal(cupom);
      setStartTime(new Date())
    }
  };
}