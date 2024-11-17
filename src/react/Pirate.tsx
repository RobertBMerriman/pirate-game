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

const gridSize = 7;
const totalSquares = gridSize * gridSize;

function PirateGame() {
  const [array, setArray] = useState<boolean[]>(Array(totalSquares).fill(false));

  const [letter, setLetter] = useState(' ');
  const [number, setNumber] = useState(0);
  const [recent, setRecent] = useState(-1);

  const [previous, setPrevious] = useState<string[]>([]);

  const [resetCheck, setResetCheck] = useState(false);

  function reset() {
    const unChosenLen = array.map((x, i) => ({ x, i })).filter((x) => !x.x).length;
    if (!resetCheck && unChosenLen !== 0) {
      setResetCheck(true);
      return;
    }

    setResetCheck(false);
    setArray(Array(totalSquares).fill(false));
    setLetter(' ');
    setNumber(0);
    setRecent(-1);
    setPrevious([]);
  }

  function nextSquare() {
    const unChosen = array.map((x, i) => ({ x, i })).filter((x) => !x.x);
    const random = randomIntFromInterval(0, unChosen.length - 1);
    const index = unChosen.at(random)?.i;

    if (index === undefined) {
      return;
    }

    handleUpdate(index);
  }

  function handleUpdate(index: number, manual?: boolean) {
    const letterNum = (index % gridSize) + 1;
    const letter = String.fromCharCode(64 + letterNum);
    const number = Math.floor(index / gridSize) + 1;
    setLetter(letter);
    setNumber(number);
    setPrevious([...previous, `${letter}${number}`]);

    const newArray = [...array];
    newArray[index] = manual ? !newArray[index] : true;
    setRecent(manual && !newArray[index] ? -1 : index);
    setArray(newArray);
  }

  return (
    <div className="flex flex-col gap-12 mt-4 sm:mt-32">
      <div className="flex flex-col sm:flex-row justify-center items-center sm:gap-16">
        <div className="grid grid-cols-8 gap-1 mb-4 -ml-4 sm:-ml-5">
          {Array.from(Array(8).keys()).map((i) => (
            <div key={i} className={cn('flex items-end h-8 justify-center text-lg', i !== 0 ? 'w-8 sm:w-12' : 'w-8')}>
              {i !== 0 ? String.fromCharCode(64 + i) : ' '}
            </div>
          ))}

          {array.map((value, i) => (
            <Fragment key={i}>
              {(i === 0 || i % gridSize === 0) && (
                <div className="flex justify-end pr-2 w-8 h-8 sm:w-12 sm:h-12 text-lg items-center">
                  {i / gridSize + 1}
                </div>
              )}
              <div
                className={cn(
                  'flex justify-center items-center text-gray-900 w-8 h-8 sm:w-12 sm:h-12 font-medium select-none',
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
          <p className="cursor-pointer select-none text-[12rem]/[1] sm:text-[15rem]/[1]" onClick={nextSquare}>
            {`${letter}${number || '-'}`}&#8203;
          </p>
          <button
            className="cursor-pointer text-xl py-1 px-5 rounded-xl border-2 border-gray-500 hover:opacity-90 active:opacity-100"
            onClick={nextSquare}
          >
            Next
          </button>
        </div>
      </div>

      <button className={cn('cursor-pointer text-lg', { 'text-yellow-500': resetCheck })} onClick={reset}>
        {resetCheck ? 'Are you sure?' : 'Reset'}
      </button>

      <div className="container flex flex-row flex-wrap self-center gap-y-1 px-2 pb-4">
        &#8203;
        {previous.map((prev, i) => (
          <div className="w-14" key={i}>
            <p>
              <span className="text-gray-400">{i + 1}:</span> {prev}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PirateGame;
