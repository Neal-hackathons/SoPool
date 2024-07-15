import { readFileSync } from "fs";
import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID,createMint,createAssociatedTokenAccount,mintToChecked,transferChecked, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";



import { SoPool } from "../target/types/so_pool";

describe("so-pool", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoPool as Program<SoPool>;



  const admin = Keypair.generate(); 
  const user = Keypair.generate();

  // token
  let mintPubkey;
  let userTokenAccount: PublicKey;
  let lotteryTokenAccount: PublicKey;


  let master_pda, mb;
  let lottery_pda,lb;
  let ticket_pda,tb;

  let ticketPrice = 1e10;
  


  // TODO set deadlines


  // TODO: add token in lottery struct/PDA



  // buy tickets with token

  // register deadline reached

  // deposit to staking
    // lottery receipt NewStaker

  // wait

  // remove from staking

  // claim input + rewards

  // pick winner

  // winner can claim rewards

  // everybody can refund ticket price

  // quand tout marche, faire des schemas, ajouter des tests, revoir la securité!

  before(async () => {


    // AIRDROP SOL
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        user.publicKey,
        10 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        admin.publicKey,
        10 * LAMPORTS_PER_SOL
      ),
      "confirmed"
    );


    // create token
       mintPubkey = await createMint(
        provider.connection, // connection
        admin, // fee payer
        admin.publicKey, // mint authority
        null, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
        8 // decimals
      );


      userTokenAccount = await createAssociatedTokenAccount(
        provider.connection, // connection
        admin, // fee payer
        mintPubkey, // mint
        user.publicKey // owner,
      );
  
       // mint to user
    let txhash = await mintToChecked(
      provider.connection, // connection
      admin, // fee payer
      mintPubkey, // mint
      userTokenAccount, // receiver (should be a token account)
      admin.publicKey, // mint authority
      1e15, // amount. if your decimals is 8, you mint 10^8 for 1 token.
      8 // decimals
    );


    [master_pda, mb] = 
    await PublicKey.findProgramAddress(
      [Buffer.from("master")],
      program.programId
    );

    [lottery_pda, lb] = 
    await PublicKey.findProgramAddress(
      [Buffer.from("lottery"),new BN(1).toArrayLike(Buffer, "be", 4)],
      program.programId
    );




  });



  it("Is initialized!", async () => {
  
    // create master PDA
    const tx = await program.methods.initMaster().accounts({
      master: master_pda, 
      payer: admin.publicKey, 
      systemProgram: SystemProgram.programId,
      })
    
      .signers([admin])
      .rpc();
    console.log("Your transaction signature", tx);

  });


  it("Create lottery!", async () => {
  
   
    // create lottery
    const tx2 = await program.methods.createLottery(new anchor.BN(ticketPrice)).accounts({
      lottery: lottery_pda, 
      master:master_pda,
      authority: admin.publicKey, 
      systemProgram: SystemProgram.programId,
      })
    
      .signers([admin])
      .rpc();
    console.log("Your transaction signature", tx2);


    // create lottery ATA
    lotteryTokenAccount = await createAssociatedTokenAccount(
      provider.connection, // connection
      admin, // fee payer
      mintPubkey, // mint
      lottery_pda // owner,
    );

    

  });


  it("Buy ticket", async () => {
  


  // #[account(
  //     init,
  //     payer = buyer,
  //     space = 8 + 4 + 4 + 32,
  //     seeds = [
  //         TICKET_SEED.as_bytes(),
  //         lottery.key().as_ref(),
  //         &(lottery.last_ticket_id + 1).to_le_bytes()
  //     ],
  //     bump,
  // )]
  // pub ticket: Account<'info, Ticket>,

  // pub lottery_token_account: Account<'info, TokenAccount>,//pda 
  // pub buyer_token_account: Account<'info, TokenAccount>,//pda
  // pub token: Account<'info, Mint>,// token

  // #[account(mut)]
  // pub buyer: Signer<'info>,
  // pub token_program: Program<'info, Token>,
  // pub system_program: Program<'info, System>,

    let lotteryId = 1;
    [ticket_pda, tb] = 
    await PublicKey.findProgramAddress(
      [Buffer.from("ticket"), lottery_pda.toBuffer(),new BN(1).toArrayLike(Buffer, "be", 4)],
      program.programId
    );

    const tx = await program.methods.buyTicketWithToken(lotteryId).accounts({
      lottery: lottery_pda, 
      ticket: ticket_pda,
      buyer: user.publicKey, 
      lottery_token_account: lotteryTokenAccount,
      buyer_token_account: userTokenAccount,
      systemProgram: SystemProgram.programId,
      })
    
      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);




  });
});
