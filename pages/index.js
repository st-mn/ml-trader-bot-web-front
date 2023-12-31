import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import LineChart from "../components/LineChart";
import TradingViewWidget from "../components/TradingViewWidget";
import { useState, useEffect } from "react";
import data_local from '/data/data.json' assert {type: 'json'};


const inter = Inter({ subsets: ["latin"] });

const EXAMPLE_DATA = {
  orders: [
    {
      symbol: "AAPL",
      price: "147.541928",
      quantity: "89.197865521",
      date: "2023-03-03T14:30:17.975331342Z",
      side: "sell",
    },
    {
      symbol: "AAPL",
      price: "144.29",
      quantity: "89.197865521",
      date: "2023-03-02T17:47:02.447697Z",
      side: "buy",
    },
    
    {
      symbol: "TSLA",
      price: "189.171327",
      quantity: "264.007021354",
      date: "2023-03-02T17:46:47.543871Z",
      side: "buy",
    },
  
    {
      symbol: "AAPL",
      price: "144.31",
      quantity: "346.222243304",
      date: "2023-03-02T17:44:20.259983Z",
      side: "buy",
    },
    
    {
      symbol: "TSLA",
      price: "189.8",
      quantity: "5.267974414",
      date: "2023-03-02T17:40:29.583808Z",
      side: "buy",
    },
    
    {
      symbol: "AAPL",
      price: "144.44",
      quantity: "339.241276654",
      date: "2023-03-02T17:37:30.356358Z",
      side: "buy",
    },
    
    {
      symbol: "AAPL",
      price: "144.45",
      quantity: "6.922810661",
      date: "2023-03-02T17:37:12.756387Z",
      side: "buy",
    },
    
    {
      symbol: "AAPL",
      price: "144.43",
      quantity: "1",
      date: "2023-03-02T17:36:56.047726Z",
      side: "buy",
    },
  ],
  positions: [{ symbol: "NVDA", price: "235.76", quantity: "213.25856385" }],
  history: {
    timestamp: [1677718800, 1677805200, 1677868793],
    equity: [50000, 50000, 50277.83901347805],
    profit_loss: [0, 0, 181.81845530894],
    profit_loss_pct: [0, 0, 0.0036293991675011607],
    base_value: 50000,
    timeframe: "1D",
  },
};

export default function Home() {
  const [data, setData] = useState(null);
  
  async function fetchJson(
    //TODO - currently loaded from local sample data - load from AWS
    //url = "https://ml-trade-data.s3.us-east-2.amazonaws.com/data.json"    
  ) {
   
    //TODO - currently loaded from local sample data - load from AWS
    /* const res = await fetch(url);
    const jsonResponse = await res.json();
    setData(jsonResponse); */
    setData(data_local);
    
  }

  useEffect(() => {
    fetchJson();
  }, []);
  
  function getProfitString() {
    const profit =
    data_local.history.profit_loss_pct[data_local.history.profit_loss_pct.length - 1];
    const profitCash =
      data_local.history.equity[data_local.history.equity.length - 1] - 15000;
    return `${profitCash > 0 ? "+" : ""}$${profitCash.toFixed(2)} (${
      profit > 0 ? "+" : ""
    }${((profitCash / 15000) * 100).toFixed(2)}%)`;
  }
  return (
    <>
      <Head>
        <title>AI Trader Bot</title>
        <meta
          name="description"
          content="AI Trader Bot"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen min-h-screen flex justify-start items-center flex-col pt-[100px] screen-content-width-two-third">
        <picture className="pointer-events-none absolute inset-x-0 top-0 -z-10 blur-md">
          <figure className="w-screen h-[46.8vw]">
            {/* <Image src="/gradient_dark.jpg" alt="gradient dark" layout="fill" /> */}
          </figure>
          <div className="w-full h-screen bg-jacarta-900">bot</div>
        </picture>
        {/* <div className="w-full flex justify-center items-center ">
          <div className={styles.thirteen}>
            <Image
              src="/tbd.svg"
              alt="logo"
              width={40}
              height={31}
              priority
            />
          </div>
        </div> */}
        <div>
          <h1 className="text-5xl font-normal text-black">the (slightly) artificially intelligent trader bot</h1>
        </div>
      {/*   <div className="flex flex-col justify-center items-center">
          Text{" "}
          <img
            src={
              "https://...png"
            }
            width={"70%"}
          />
        </div> */}
        {data && (
          <div className="justify-start items-start w-full max-w-[1100px]">
            <div>
              <h1
                className="text-2xl font-normal text-center"
                style={{
                  color: getProfitString().includes("-")
                    ? "#D50000"
                    : "#42f563",
                }}
              >
                {getProfitString()}
              </h1>
            </div>
            <History {...data_local} />
           {/*  <Orders orders={data_local?.orders} /> 
            <History {...data} />
            <Orders orders={data?.orders} />  */}
            <TradingViewWidget />
          </div>
        )}
      </main>
    </>
  );
}


//this function returns a list of all the orders in the data object
function Orders({ orders }) {
  const [sortedOrders, setSortedOrders] = useState([]);

  useEffect(() => {
    //make a copy of the orders array, and then sort it so that newest orders are first
    console.log("STARTING");
    const ordersCopy = [...orders];
    ordersCopy.sort((a, b) => {
      console.log(a.date);
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      console.log(
        "A Date: ",
        aDate,
        "B Date: ",
        bDate,
        "B - A: ",
        bDate - aDate
      );
      return bDate - aDate;
    });
    console.log(ordersCopy);
    setSortedOrders([...ordersCopy]);
  }, [JSON.stringify(orders)]);

  function cleanDateString(recordedDate) {
    const date = new Date(recordedDate);
    return date.toISOString().split("T")[0];
  }
  //filter out the orders that are not buy orders
  orders = orders.filter((order) => order.side === "buy");

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-normal text-white"></h1>
      <div className="flex flex-col  bg-white/100 border-2 p-5 max-h-[200px] overflow-y-scroll">
        {sortedOrders.map((order, index) => (
          <div className="flex flex-row" key={index}>
            <div className="flex flex-col">
              <p className="text-black">STOCK: {order.symbol} | PRICE: ${order.price} | QUANTITY: {order.quantity} | {cleanDateString(order.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

//this function returns a list of all the orders in the data object
function History({ history }) {
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-normal text-white"></h1>
      <div className="flex flex-col  bg-white/100 border-2 p-5 max-h-[500px] overflow-y-scroll">
        <LineChart data={history} />
      </div>
    </div>
  );
}







