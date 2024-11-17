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

  function reset() {
    setArray(Array(7 * 7).fill(false));

    setLetter(' ');
    setNumber(0);
    setRecent(-1);
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
    const letter = (index % 7) + 1;
    const number = Math.floor(index / 7) + 1;
    setLetter(map[letter]);
    setNumber(number);

    const newArray = [...array];
    newArray[index] = manual ? !newArray[index] : true;
    setRecent(manual && !newArray[index] ? -1 : index);
    setArray(newArray);
  }

  return (
    <div className="flex flex-col gap-16 h-screen justify-center">
      <div className="flex flex-row justify-center items-center gap-16">
        <div className="grid grid-cols-8 gap-1">
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
          <button className="cursor-pointer text-xl" onClick={generateButBetter}>
            Next
          </button>
        </div>
      </div>

      <button className="cursor-pointer text-lg" onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default PirateGame;
