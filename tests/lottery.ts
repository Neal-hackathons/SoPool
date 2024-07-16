import { readFileSync } from "fs";
import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import {
  Keypair,
  Transaction,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Account,

} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID, createMint, createAssociatedTokenAccount, getOrCreateAssociatedTokenAccount, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress,
  mintToChecked, transferChecked, ASSOCIATED_TOKEN_PROGRAM_ID, getAccount
} from "@solana/spl-token";
import { assert } from "chai";



import { SoPool } from "../target/types/so_pool";
import { Staking } from "../target/types/staking";
describe("so-pool", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoPool as Program<SoPool>;

  const programStaking = anchor.workspace.staking as Program<Staking>;



  const admin = Keypair.generate();
  const user = Keypair.generate();
  const userB = Keypair.generate();
  // token
  let mintPubkey;
  let userTokenAccount: PublicKey;
  let userBTokenAccount: PublicKey;

  let lotteryTokenAccount: PublicKey;
  let lotteryTokenAccountX: PublicKey;

  let userTokenAccountX: PublicKey;

  let master_pda, mb;
  let lottery_pda, lb;
  let ticket_pda, tb;
  let ticket_pda2, tb2;
  let receipt_pda, rb;
  let ticketPrice = 1e10;
  let vault_x_pda, vb;
  let synth_x_pda, sb;



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
        userB.publicKey,
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


    userBTokenAccount = await createAssociatedTokenAccount(
      provider.connection, // connection
      admin, // fee payer
      mintPubkey, // mint
      userB.publicKey // owner,
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


    let txhash2 = await mintToChecked(
      provider.connection, // connection
      admin, // fee payer
      mintPubkey, // mint
      userBTokenAccount, // receiver (should be a token account)
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
        [Buffer.from("lottery"), new BN(1).toArrayLike(Buffer, "le", 4)],
        program.programId
      );

      [receipt_pda, rb] = 
      await PublicKey.findProgramAddress(
        [
          Buffer.from("receipt"), 
          mintPubkey.toBuffer(),
          lottery_pda.toBuffer(),
        ],
        programStaking.programId
      );
  
      [vault_x_pda, vb] = 
      await PublicKey.findProgramAddress(
        [Buffer.from("vault"), mintPubkey.toBuffer()],
        programStaking.programId
      );
  
  
      [synth_x_pda, sb] = 
      await PublicKey.findProgramAddress(
        [Buffer.from("synthetic"), mintPubkey.toBuffer()],
        programStaking.programId
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
      master: master_pda,
      authority: admin.publicKey,
      systemProgram: SystemProgram.programId,
    })

      .signers([admin])
      .rpc();
    console.log("Your transaction signature", tx2);



  });


  it("Buy ticket", async () => {



    // ticket pda
    let lotteryId = new anchor.BN(1);
    [ticket_pda, tb] =
      await PublicKey.findProgramAddress(
        [Buffer.from("ticket"), lottery_pda.toBuffer(), new BN(1).toArrayLike(Buffer, "le", 4)],
        program.programId
      );


     [ticket_pda2, tb2] =
      await PublicKey.findProgramAddress(
        [Buffer.from("ticket"), lottery_pda.toBuffer(), new BN(2).toArrayLike(Buffer, "le", 4)],
        program.programId
      );


    // create lottery ATA
    let allowOwnerOffCurve = true;

    lotteryTokenAccount = await getAssociatedTokenAddress(
      mintPubkey, // mint
      lottery_pda, // owner
      allowOwnerOffCurve // allow owner off curve
    );


    let tx0 = new Transaction();
    tx0.add(
      createAssociatedTokenAccountInstruction(
        admin.publicKey, // payer
        lotteryTokenAccount, // ata
        lottery_pda, // owner
        mintPubkey, // mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )

    );

    let txhash = await provider.connection.sendTransaction(tx0, [admin]);
    let latestBH = await provider.connection.getLatestBlockhash('confirmed');
    let confirmation = await provider.connection.confirmTransaction({
      blockhash: latestBH.blockhash,
      lastValidBlockHeight: latestBH.lastValidBlockHeight,
      signature: txhash
    }, 'confirmed');

    // Check if the receiver's token account exists
    let receiverTokenAccount: Account
    try {
      receiverTokenAccount = await getAccount(
        provider.connection,
        lotteryTokenAccount,
        "confirmed",
        TOKEN_PROGRAM_ID
      )
    } catch (e) {
      // If the account does not exist, add the create account instruction to the transaction
      console.log("******************** no account ****************");
    }





    // user buys 1 ticket
    const tx = await program.methods.buyTicketWithToken(lotteryId).accounts({
      lottery: lottery_pda,
      ticket: ticket_pda,
      lotteryTokenAccount: lotteryTokenAccount,
      buyerTokenAccount: userTokenAccount,
      buyer: user.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })

      .signers([user])
      .rpc();
    console.log("Your transaction signature", tx);

    // userB buys 1 ticket
    const tx2 = await program.methods.buyTicketWithToken(lotteryId).accounts({
      lottery: lottery_pda,
      ticket: ticket_pda2,
      lotteryTokenAccount: lotteryTokenAccount,
      buyerTokenAccount: userBTokenAccount,
      buyer: userB.publicKey,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    })

      .signers([userB])
      .rpc();
    console.log("Your transaction signature", tx2);


    // check balances
    let _lotteryTokenAccount = await provider.connection.getTokenAccountBalance(lotteryTokenAccount);
    assert.strictEqual(Number(_lotteryTokenAccount.value.amount), Number(ticketPrice) * 2);

    let _userTokenAccount = await provider.connection.getTokenAccountBalance(userTokenAccount);
    assert.strictEqual(Number(_userTokenAccount.value.amount), 1e15 - Number(ticketPrice));

    let _userBTokenAccount = await provider.connection.getTokenAccountBalance(userBTokenAccount);
    assert.strictEqual(Number(_userBTokenAccount.value.amount), 1e15 - Number(ticketPrice));

    // TODO check tickets exists




  });



  it("Deposit staking", async () => {
  
    // create staking vault
    const tx0 = await programStaking.methods.initialize().accounts({
      syntheticX: synth_x_pda,
      vaultX: vault_x_pda, 
      tokenX: mintPubkey,         
      payer: admin.publicKey, 
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID, 
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID, 
      //rent: SYSVAR_RENT_PUBKEY
      })
      //.signers([admin, poolInfo])
      .signers([admin])
      .rpc();


 
  console.log("Your transaction signature", tx0);

 
    let tx1 = await programStaking.methods.newStaker(lottery_pda).accounts(
      {
        tokenX: mintPubkey, 
        receipt: receipt_pda, 
        sender: user.publicKey, 
        systemProgram: SystemProgram.programId,
      }
    )
        .signers([user])
        .rpc();
    console.log("Your transaction signature", tx1);
	

    // create synth ata for lottery
    let allowOwnerOffCurve = true;

    lotteryTokenAccountX = await getAssociatedTokenAddress(
      synth_x_pda, // mint
      lottery_pda, // owner
      allowOwnerOffCurve // allow owner off curve
    );

    let tx2 = new Transaction();
    tx2.add(
      createAssociatedTokenAccountInstruction(
        admin.publicKey, // payer
        lotteryTokenAccountX, // ata
        lottery_pda, // owner
        synth_x_pda, // mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )

    );

    let txhash = await provider.connection.sendTransaction(tx2, [admin]);
    let latestBH = await provider.connection.getLatestBlockhash('confirmed');
    let confirmation = await provider.connection.confirmTransaction({
      blockhash: latestBH.blockhash,
      lastValidBlockHeight: latestBH.lastValidBlockHeight,
      signature: txhash
    }, 'confirmed');

    // Check if the receiver's token account exists
    let receiverTokenAccount: Account
    try {
      receiverTokenAccount = await getAccount(
        provider.connection,
        lotteryTokenAccountX,
        "confirmed",
        TOKEN_PROGRAM_ID
      )
    } catch (e) {
      // If the account does not exist, add the create account instruction to the transaction
      console.log("******************** no account ****************");
    }


    let tx = await program.methods.depositToStaking(new anchor.BN(2*ticketPrice),new anchor.BN(1)).accounts(
      {
        lottery: lottery_pda, 
        tokenX: mintPubkey, 
        synthXMint: synth_x_pda, 
        vaultX:vault_x_pda,
        senderTokenSynthX:lotteryTokenAccountX,
        senderTokenX:lotteryTokenAccount,
        receipt:receipt_pda,
        staking_program:programStaking,
        token_program: TOKEN_PROGRAM_ID,
      }
    )
        .signers([])
        .rpc();
    console.log("Your transaction signature", tx);

    // create ATA for x token 
    userTokenAccountX = await createAssociatedTokenAccount(
      provider.connection, // connection
      admin, // fee payer
      synth_x_pda, // mint
      user.publicKey // owner,
    );


    let _lotteryTokenAccount = await provider.connection.getTokenAccountBalance(lotteryTokenAccount);
    assert.strictEqual(Number(_lotteryTokenAccount.value.amount),0);

    let _vaultTokenAccount = await provider.connection.getTokenAccountBalance(vault_x_pda);
    assert.strictEqual(Number(_vaultTokenAccount.value.amount), Number(ticketPrice) * 2);

    // lottery should have minted x tokens
    let _userTokenAccountX = await provider.connection.getTokenAccountBalance(lotteryTokenAccountX);
    assert.strictEqual(Number(_userTokenAccountX.value.amount), Number(ticketPrice) * 2);


  });
  it("Remove staking", async () => {

  
    let tx = await program.methods.removeFromStaking(new anchor.BN(1)).accounts(
      {
        lottery: lottery_pda, 
        tokenX: mintPubkey, 
        synthXMint: synth_x_pda, 
        vaultX:vault_x_pda,
        senderTokenSynthX:lotteryTokenAccountX,       
        senderTokenX:lotteryTokenAccount,
        receipt:receipt_pda,
        staking_program:programStaking,
        token_program: TOKEN_PROGRAM_ID,
      }
    )
        .signers([])
        .rpc();
    console.log("Your transaction signature", tx);


    let _lotteryTokenAccount = await provider.connection.getTokenAccountBalance(lotteryTokenAccount);
    assert.strictEqual(Number(_lotteryTokenAccount.value.amount),Number(ticketPrice) * 2);

    let _vaultTokenAccount = await provider.connection.getTokenAccountBalance(vault_x_pda);
    assert.strictEqual(Number(_vaultTokenAccount.value.amount), 0);

    // lottery should have minted x tokens
    let _userTokenAccountX = await provider.connection.getTokenAccountBalance(lotteryTokenAccountX);
    assert.ok(Math.abs(Number(_userTokenAccountX.value.amount)) >= 1);
    


  });

  it("pick winner", async () => {

    let tx = await program.methods.pickWinner(new anchor.BN(1)).accounts(
      {
        lottery: lottery_pda, 
        authority:admin.publicKey,
     
      }
    )
        .signers([admin])
        .rpc();

    console.log("Your transaction signature", tx);

    // TODO fetch infos 
    const toto = await program.account.lottery.fetch(lottery_pda);
    console.log(toto);

  });

  it("winner claims rewards", async () => {

    let tx = await program.methods.claimPrizeToken(new anchor.BN(1),new anchor.BN(1)).accounts(
      {
        lottery: lottery_pda, 
        authority:user.publicKey,
        ticket: ticket_pda,
        senderTokenSynthX:lotteryTokenAccountX,
        receiverTokenSynthX:userTokenAccountX,
        systemProgram: SystemProgram.programId,
        token_program: TOKEN_PROGRAM_ID,
     
      }
    )
        .signers([user])
        .rpc();

    console.log("Your transaction signature", tx);

  });

  it("everybody can refund", async () => {
    

  });



});
