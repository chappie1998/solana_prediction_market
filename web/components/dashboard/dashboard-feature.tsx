'use client';

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { vote } from '@/app/api/vote';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import {
  PREDICTION_MARKET_PROGRAM_ID,
  PredictionMarket,
} from '@prediction-market/anchor';
import { PublicKey } from '@solana/web3.js';
import { usePredictionMarketProgram } from '../prediction-market/prediction-market-data-access';
// import { getAllPools } from '@/app/api/getAllPool';
import { createPool } from '@/app/api/createPool';
import { initialize } from '@/app/api/init';
import { declareResult } from '@/app/api/declare_result';
import { claim } from '@/app/api/claim';
import { Program } from '@coral-xyz/anchor';
// import { getPoolData } from '@/app/api/getPoolData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

interface PriceData {
  time: string;
  price: number;
}

const PRICE_UPDATE_INTERVAL = 5000; // 5 seconds in milliseconds

export default function DashboardFeature() {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [targetPrice, setTargetPrice] = useState<number>(147.5);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [userVote, setUserVote] = useState<'yes' | 'no' | null>(null);
  const [gameResult, setGameResult] = useState<boolean | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([]);
  // var predictionmarketDataadd = '8hkSePwXVRip7uBWRb8EhKziRGAgaGTPdXKw1FeeT3Yb';
  // var poolkeyadd = '8hkSePwXVRip7uBWRb8EhKziRGAgaGTPdXKw1FeeT3Yb';
  // const [pools, setPools] = useState<any[]>([]); // Adjust the type as needed
  const [predictionmarketDataadd, setPredictionmarketDataadd] =
    useState<PublicKey>('8hkSePwXVRip7uBWRb8EhKziRGAgaGTPdXKw1FeeT3Yb');
  const [poolkeyadd, setPoolkeyadd] = useState(
    '8hkSePwXVRip7uBWRb8EhKziRGAgaGTPdXKw1FeeT3Yb'
  );

  const program = usePredictionMarketProgram().program;
  const wallet = useWallet();
  const usdt_mint = new PublicKey(
    'EcifQ3Fs4CVDNTpWQBWta85ctNrHNGWncDtXcux5NULe'
  );
  const oracle = new PublicKey('8hkSePwXVRip7uBWRb8EhKziRGAgaGTPdXKw1FeeT3Yb');

  // var predictionmarketData = new PublicKey(predictionmarketDataadd);

  // var poolkey = new PublicKey(poolkeyadd);

  // 9efVpxLcVE5xXD7cWJDcBCr8N5RMXYuAWmnLYtiJmrsd
  // console.log("pools",pools);

  // useEffect(() => {
  //   // Fetch pools data
  //   const fetchPools = async () => {
  //     try {
  //       const fetchedPools = await getAllPools(program);
  //       setPools(fetchedPools);
  //     } catch (error) {
  //       console.error('Error fetching pools:', error);
  //     }
  //   };

  //   fetchPools();
  // }, [program]);

  const predictionmarketData = useMemo(() => {
    if (predictionmarketDataadd) {
      return new PublicKey(predictionmarketDataadd);
    }
    return null;
  }, [predictionmarketDataadd]);

  const poolkey = useMemo(() => {
    if (poolkeyadd) {
      return new PublicKey(poolkeyadd);
    }
    return null;
  }, [poolkeyadd]);

  useEffect(() => {
    // Fetch real-time Solana price from CoinGecko API
    const fetchPrice = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
        );
        const price = response.data.solana.usd;
        setCurrentPrice(price);

        // Update price history
        setPriceHistory((prevHistory) => [
          ...prevHistory,
          { time: new Date().toLocaleTimeString(), price },
        ]);
      } catch (error) {
        console.error('Error fetching Solana price:', error);
      }
    };

    fetchPrice();

    // Update price every 5 seconds (based on constant)
    const priceInterval = setInterval(fetchPrice, PRICE_UPDATE_INTERVAL);

    // Countdown timer (updates every second)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(priceInterval);
          clearInterval(timer);
          determineResult();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(timer);
    };
    // Removed currentPrice from dependency array
  }, []);

  const determineResult = () => {
    if (currentPrice !== null) {
      const hitTarget = currentPrice >= targetPrice;
      setGameResult(hitTarget);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Chart placeholder dataset
  const chartData = {
    labels: priceHistory.length
      ? priceHistory.map((data) => data.time)
      : ['00:00'], // Placeholder label
    datasets: [
      {
        label: 'Solana Price (USD)',
        data: priceHistory.length
          ? priceHistory.map((data) => data.price)
          : [null], // Placeholder data point
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.1, // Smoothing the line for a more polished look
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to grow with size
    plugins: {
      annotation: {
        annotations: {
          targetLine: {
            type: 'line',
            yMin: targetPrice,
            yMax: targetPrice,
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 2,
            label: {
              content: `Target Price: $${targetPrice.toFixed(2)}`,
              enabled: true,
              position: 'end',
            },
          },
        },
      },
      tooltip: {
        // Tooltip-specific options (if any)
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false, // Hide grid for a cleaner look
        },
        ticks: {
          maxTicksLimit: 10, // Limiting number of time labels
        },
      },
      y: {
        display: true,
        beginAtZero: false,
        grid: {
          color: 'rgba(200, 200, 200, 0.3)', // Light grid color
        },
        ticks: {
          callback: function (value: number | string) {
            return '$' + value; // Add $ symbol to Y axis
          },
        },
      },
    },
  };

  const callinitialize = async (
    program: any,
    wallet: any,
    usdt_mint: any,
    oracle: any
  ) => {
    const res = await initialize(program, wallet, usdt_mint, oracle);
    setPredictionmarketDataadd(res);

    console.log(predictionmarketDataadd);
  };

  const callcreatePool = async (
    program: Program<PredictionMarket>,
    wallet: WalletContextState,
    predictionmarketData: PublicKey
  ) => {
    const res = await createPool(program, wallet, predictionmarketData);
    setPoolkeyadd(res);

    console.log(poolkeyadd);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Solana Price Prediction Game
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-2xl font-semibold">
            Will Solana's price hit ${targetPrice.toFixed(2)} in the next{' '}
            {formatTime(timeLeft)}?
          </h2>
        </div>
        <div className="mb-4">
          <p className="text-lg">
            Current Solana Price: $
            {currentPrice !== null ? currentPrice.toFixed(2) : 'Loading...'}
          </p>
          <p className="text-lg">Target Price: ${targetPrice.toFixed(2)}</p>
          <p className="text-lg">Time Left: {formatTime(timeLeft)}</p>
          <p className="text-sm text-gray-500">Price updates every 5 seconds</p>
        </div>

        {/* Price Chart */}
        <div className="mb-4" style={{ height: '500px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>

        {!userVote && timeLeft > 0 && (
          <div className="space-x-4">
            <button
              onClick={() => callinitialize(program, wallet, usdt_mint, oracle)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              INIT
            </button>
            <button
              onClick={() =>
                callcreatePool(program, wallet, predictionmarketData)
              }
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              create_pool
            </button>

            <button
              onClick={() =>
                declareResult(program, wallet, predictionmarketData, poolkey, 1)
              }
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              declare result
            </button>
            <button
              onClick={() => vote(program, wallet, poolkey, 150000000, true)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              yes
            </button>
            <button
              onClick={() => vote(program, wallet, poolkey, 100000000, false)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              No
            </button>
            <button
              onClick={() => claim(program, wallet, poolkey)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              claim
            </button>
          </div>
        )}
        {userVote && (
          <p className="text-lg">
            Your prediction:{' '}
            {userVote === 'yes'
              ? 'Price will hit target'
              : 'Price will not hit target'}
          </p>
        )}
        {gameResult !== null && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Game Result:</h2>
            <p className="text-2xl font-bold">
              {gameResult
                ? 'Target price was hit!'
                : 'Target price was not hit.'}
            </p>
            {userVote && (
              <p className="text-xl">
                You{' '}
                {(gameResult && userVote === 'yes') ||
                (!gameResult && userVote === 'no')
                  ? 'won'
                  : 'lost'}
                !
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
