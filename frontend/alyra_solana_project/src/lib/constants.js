import { PublicKey } from "@solana/web3.js";



export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_POOL_PROGRAM_ID ?? "3attdVJrdoB1J82iRdp3Gpo8KmKUK4R4SB5fzKRLFNpH"
);

export const STAKING_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID ?? "DQ2xiRbRvJuymAZSTj7kd7T8Auagh49NuKv6jS8kpX5c"
);