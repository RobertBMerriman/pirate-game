import clsx, { type ClassValue } from 'clsx';
import { Fragment, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const map: Record<number, string> = {
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'F',
  7: 'G',
};

function PirateGame() {
  const [array, setArray] = useState<boolean[]>(Array(7 * 7).fill(false));

  const [letter, setLetter] = useState(' ');
  const [number, setNumber] = useState(0);
  const [recent, setRecent] = useState(-1);

  const [previous, setPrevious] = useState<string[]>([]);

  function reset() {
    setArray(Array(7 * 7).fill(false));
    setLetter(' ');
    setNumber(0);
    setRecent(-1);
    setPrevious([]);
  }

  function generateButBetter() {
    const unChosen = array.map((x, i) => ({ x, i })).filter((x) => !x.x);
    const random = randomIntFromInterval(0, unChosen.length - 1);
    const index = unChosen.at(random)?.i;

    if (index === undefined) {
      return;
    }

    handleUpdate(index);
  }

  function handleUpdate(index: number, manual?: boolean) {
    const letterNum = (index % 7) + 1;
    const letter = map[letterNum];
    const number = Math.floor(index / 7) + 1;
    setLetter(letter);
    setNumber(number);
    setPrevious([...previous, `${letter}${number}`]);

    const newArray = [...array];
    newArray[index] = manual ? !newArray[index] : true;
    setRecent(manual && !newArray[index] ? -1 : index);
    setArray(newArray);
  }

  return (
    <div className="flex flex-col gap-12 h-screen mt-32">
      <div className="flex flex-row justify-center items-center gap-16">
        <div className="grid grid-cols-8 gap-1 mb-4">
          {Array.from(Array(8).keys()).map((i) => (
            <div key={i} className={cn('flex items-end h-8 justify-center text-lg', i !== 0 ? 'w-12' : 'w-8')}>
              {map[i]}
            </div>
          ))}

          {array.map((value, i) => (
            <Fragment key={i}>
              {(i === 0 || i % 7 === 0) && (
                <div className="flex justify-end pr-2 w-12 h-12 text-lg items-center">{i / 7 + 1}</div>
              )}
              <div
                className={cn(
                  'flex justify-center items-center text-gray-900 w-12 h-12 font-medium',
                  value ? 'bg-red-500' : 'bg-gray-400',
                  recent === i ? 'bg-yellow-500' : ''
                )}
                onClick={() => handleUpdate(i, true)}
              >
                {recent === i ? `${letter}${number}` : ''}
                &#8203;
              </div>
            </Fragment>
          ))}
        </div>

        <div className="flex flex-col gap-6 justify-center items-center w-1/3">
          <p style={{ fontSize: '15rem', lineHeight: 1 }}>{`${letter}${number || '-'}`}&#8203;</p>
          <button
            className="cursor-pointer text-xl py-1 px-5 rounded-xl border-2 border-gray-500 hover:opacity-90 active:opacity-100"
            onClick={generateButBetter}
          >
            Next
          </button>
        </div>
      </div>

      <button className="cursor-pointer text-lg" onClick={reset}>
        Reset
      </button>

      <div className="container flex flex-row flex-wrap self-center gap-y-1">
        &#8203;
        {previous.map((prev, i) => (
          <div className="w-14">
            <span className="text-gray-400">{i + 1}:</span> {prev}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PirateGame;
