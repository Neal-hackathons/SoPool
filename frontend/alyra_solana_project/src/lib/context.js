"use client";

import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { SystemProgram } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Keypair } from "@solana/web3.js";

import {
  getLotteryProgram, getStakingProgram
} from "./utils.ts";
//import { confirmTx, mockWallet } from "../utils/helper";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const program_lottery = useMemo(() => {
    if (connection) {
      return getLotteryProgram(connection, wallet ?? mockWallet());
    }
  }, [connection, wallet]);

  const program_staking = useMemo(() => {
    if (connection) {
      return getStakingProgram(connection, wallet ?? mockWallet());
    }
  }, [connection, wallet]);

  useEffect(() => {
    if(lotteries.length === 0){
      viewLotteries();
    }
  }, []);

  const [lotteries, setLotteries] = useState([]);

  const viewLotteries = async () => {
   
    const lotteries = await program.account.lottery.all();
    setLotteries(lotteries);
  }

  return (
    <AppContext.Provider
      value={{
        createLottery,
        viewLotteries,
        stake_crypto,
        lotteries,
        error,
        success
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};