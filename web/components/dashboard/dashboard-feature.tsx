'use client';

import React, { useState, useEffect } from 'react';
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
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

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

  const chartOptions = {
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
        mode: 'index',
        intersect: false,
      },
    },
    hover: {
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
          callback: function (value: number) {
            return '$' + value; // Add $ symbol to Y axis
          },
        },
      },
    },
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
              onClick={() => setUserVote('yes')}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
            >
              Yes
            </button>
            <button
              onClick={() => setUserVote('no')}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              No
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
