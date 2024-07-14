
import { join } from "path";
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



import { Staking } from "../target/types/staking";


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


// https://solanacookbook.com/references/token.html#how-to-create-a-token-account
describe("alyra-staking", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.staking as Program<Staking>;


  //
  const admin = Keypair.generate(); 
  // const WALLET_PATH = join(process.env["HOME"]!, ".config/solana/id.json");
  // const admin = Keypair.fromSecretKey(
  //   Buffer.from(JSON.parse(readFileSync(WALLET_PATH, { encoding: "utf-8" })))
  // );

  const user = Keypair.generate();
  const userInfo = Keypair.generate();
  
  // token
  let mintPubkey;

  // ATA
  let adminTokenAccount: PublicKey;
  let userTokenAccount: PublicKey;
  let wallet_synth_x: PublicKey;

  const poolInfo = Keypair.generate();

  let userAmount = 1e12;
  let Blocktime;

  let vault_x_pda, vb;
  let receipt_pda, rb;
  let synth_x_pda, sb;

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

    [vault_x_pda, vb] = 
    await PublicKey.findProgramAddress(
      [Buffer.from("vault"), mintPubkey.toBuffer()],
      program.programId
    );

    [receipt_pda, rb] = 
    await PublicKey.findProgramAddress(
      [
        Buffer.from("receipt"), 
        mintPubkey.toBuffer(),
        user.publicKey.toBuffer(),
      ],
      program.programId
    );

    [synth_x_pda, sb] = 
    await PublicKey.findProgramAddress(
      [Buffer.from("synthetic"), mintPubkey.toBuffer()],
      program.programId
    );

    

    // create ATA
    adminTokenAccount = await createAssociatedTokenAccount(
      provider.connection, // connection
      admin, // fee payer
      mintPubkey, // mint
      admin.publicKey // owner,
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
      userAmount, // amount. if your decimals is 8, you mint 10^8 for 1 token.
      8 // decimals
    );
    const currentSlot = await program.provider.connection.getSlot();
    Blocktime = await program.provider.connection.getBlockTime(currentSlot);
    //console.log(Blocktime);

  });


  it("Initialize", async () => {
    let tokenAmount = await provider.connection.getTokenAccountBalance(adminTokenAccount);
    assert.strictEqual(tokenAmount.value.amount, "0");



    const tx = await program.methods.initialize().accounts({
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


   
    console.log("Your transaction signature", tx);


  });

  it("Stake", async () => {

  



  // create a new staker account for tokenX 
  let tx0 = await program.methods.newStaker().accounts(
    {
      tokenX: mintPubkey, 
      receipt: receipt_pda, 
      sender: user.publicKey, 
      systemProgram: SystemProgram.programId,
    }
  )
      .signers([user])
      .rpc();

  // new synthetic account 
  wallet_synth_x = await createAssociatedTokenAccount(provider.connection, admin, synth_x_pda, user.publicKey);

  // new synthetic account 
 //let wallet_synth_x = await token.createAssociatedTokenAccount(connection, wallet, synth_x_pda, provider.wallet.publicKey, null, token.TOKEN_PROGRAM_ID, token.ASSOCIATED_TOKEN_PROGRAM_ID)


  let operation_accounts = { 
    tokenX: mintPubkey,  
    syntheticX: synth_x_pda, 
    vaultX: vault_x_pda, 
    sender: user.publicKey, 
    senderTokenX: userTokenAccount,
    senderTokenSynthX: wallet_synth_x, 
    tokenProgram: TOKEN_PROGRAM_ID,
    // clock: web3.SYSVAR_CLOCK_PUBKEY,
    receipt: receipt_pda,
  }

  // transfer X into program and get X synthetic tokens back 
  
  const tx = await program.methods
      .add(new anchor.BN(userAmount))
      .accounts(operation_accounts)
      .signers([user])
      .rpc();



    console.log("Your transaction signature", tx);

    // TODO
    // let _adminTokenAccount = await provider.connection.getTokenAccountBalance(adminTokenAccount);
    // assert.strictEqual(Number(_adminTokenAccount.value.amount), userAmount);

    let _vaultTokenAccount = await provider.connection.getTokenAccountBalance(vault_x_pda);
    assert.strictEqual(Number(_vaultTokenAccount.value.amount), userAmount);
    let _userTokenAccount = await provider.connection.getTokenAccountBalance(userTokenAccount);
    assert.strictEqual(Number(_userTokenAccount.value.amount), 0);
    // should have minted x tokens
    let _userTokenAccountX = await provider.connection.getTokenAccountBalance(wallet_synth_x);
    assert.strictEqual(Number(_userTokenAccountX.value.amount), userAmount);


  });

  it("Claim Reward", async () => {
  


    //  // stake 3 sec
    //  let t = 3000;
    //  let t_s = t/1000;
    //  while (true) {
    //    const currentSlot = await program.provider.connection.getSlot()
    //    const currentBlocktime = await program.provider.connection.getBlockTime(currentSlot)
    //    console.log(Blocktime);
    //    console.log(currentBlocktime);
    //    if (currentBlocktime >= (Blocktime + t_s)) {
    //       break;
    //    }
    //    sleep(t) // sleep 3000ms before checking again
    // }


    // const tx = await program.methods
    //   .claimReward()
    //   .accounts({
    //     user: user.publicKey,
    //     admin: admin.publicKey,
    //     userInfo: userInfo.publicKey,
    //     userStakingWallet: userTokenAccount,
    //     adminStakingWallet: adminTokenAccount,
    //     stakingToken: mintPubkey,
    //     tokenProgram: TOKEN_PROGRAM_ID,
    //   }).signers([user,admin])
    //   .rpc();
    // console.log("Your transaction signature", tx);

    // let _userTokenAccount = await provider.connection.getTokenAccountBalance(userTokenAccount);
    // //assert.strictEqual(Number(_userTokenAccount.value.amount), 2);
    // assert.ok(Math.abs(Number(_userTokenAccount.value.amount) - 2) < 2);
  });

  it("Unstake", async () => {
    

    let operation_accounts = { 
      tokenX: mintPubkey,  
      syntheticX: synth_x_pda, 
      vaultX: vault_x_pda, 
      sender: user.publicKey, 
      senderTokenX: userTokenAccount,
      senderTokenSynthX: wallet_synth_x, 
      tokenProgram: TOKEN_PROGRAM_ID,
      // clock: web3.SYSVAR_CLOCK_PUBKEY,
      receipt: receipt_pda,
    }

    const tx = await program.methods
    .remove()
    .accounts(operation_accounts).signers([user])
    .rpc();


    console.log("Your transaction signature", tx);

    let _userTokenAccount = await provider.connection.getTokenAccountBalance(userTokenAccount);
    assert.strictEqual(Number(_userTokenAccount.value.amount), userAmount);
    //assert.ok(Math.abs(Number(_userTokenAccount.value.amount) - (userAmount + 2)) < 2);
    let _vaultTokenAccount = await provider.connection.getTokenAccountBalance(vault_x_pda);
    assert.strictEqual(Number(_vaultTokenAccount.value.amount), 0);
    // should still get some X (rewards)
    let _userTokenAccountX = await provider.connection.getTokenAccountBalance(wallet_synth_x);
    assert.ok(Math.abs(Number(_userTokenAccountX.value.amount)) >= 1);
    

  });
});
