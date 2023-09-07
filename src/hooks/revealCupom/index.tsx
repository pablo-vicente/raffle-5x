import { useEffect, useState } from "react";

const duration = 5000;
const mininalDuration = 10;

export default function useRevealCupom() {
  const [cupomInReveal, setCupomInReveal] = useState<number>(0);
  const [number, setNumber] = useState<string>("0");
  const [timeSorted, setTimeSorted] = useState<number>(0);

  useEffect(() => {


    const stringValue = `${cupomInReveal}`.toString();
    const length = stringValue.length - 1;
    const timeForElement = duration / stringValue.length;
    const positionIntSorted = Math.floor(timeSorted / timeForElement);
    const positionRtl = length - positionIntSorted;

    const intervalId = setInterval(() => {

      if (cupomInReveal === Number(number))
        return;

      let temp: number[] = [];
      for (let index = length; index >= 0; index--) {
        const originalValue = Number(stringValue[index]);

        const positionNumber = index >= positionRtl
          ? originalValue
          : randonNumber(originalValue)

        temp[index] = Number(positionNumber);
      }
      const newNumber = (temp.join(""));
      setNumber(newNumber);

      const time = timeSorted >= duration
        ? 0
        : timeSorted + mininalDuration;

      // console.log("time:" + time)
      const date = new Date();
      console.log("TIME:" + date.getSeconds() + ":" + date.getMilliseconds())

      setTimeSorted(time);
    }, mininalDuration);

    return () => clearInterval(intervalId);
  }, [cupomInReveal, duration, number, timeSorted]);

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
    }
  };
}