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

  const createLottery = async () => {
    // TODO 4
    // createVote est la méthode utilisé pour créer un vote à partir du formulaire rempli par l'utilisateur
    // Indice 1 : Aller voir où est appelé cette méthode et les paramètres transmis
    // Indice 2 : Générer aléatoirement une keypair pour le voteAccount
    // Indice 3 : Appeler la méthode du smart contract creerVote
    // Indice 4 : Avec les 3 paramètres + 3 accounts + signers
    // Indice 5 : Utiliser confirmTx
  };

  const stake_crypto = async () => {
    // TODO 5
    // vote est la méthode utilisé pour voter en tant qu'utilisateur
    // Indice 1 : Aller voir où est appelé cette méthode et les paramètres transmis
    // Indice 2 : Appeler la méthode du smart contract vote
    // Indice 3 : Avec 1 paramètre + 4 accounts
    // Indice 4 : Utiliser confirmTx
  };

  // TODO BONUS nouvelle fonctionnalité
  // Récupérer si l'utilisateur a déjà voté pour l'afficher à côté de l'option correspondante
  // Indice 1 : Faire un appel au smart contract pour récupérer le Voter account s'il existe (publickey généré avec la seed voteAccount + userWallet)

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