mod constants;
mod state;
mod error;

use anchor_lang::{
    prelude::*,
    solana_program::{clock::Clock, hash::hash, program::invoke, system_instruction::transfer},
};

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self,Mint, MintTo,Burn, Token, TokenAccount,Transfer as SplTransfer},   
};

use crate::{constants::*, error::LotteryError};



pub use state::*;



use staking::program::Staking;

use staking::cpi::accounts::Operation;
pub use staking::Receipt;

//use staking::{self,Receipt};



declare_id!("D7ZJp9xHNS9RbaFuyWTiEXB1Ee4L4k4qtYoU9TDg1KUe");

#[program]
mod lottery {
    use super::*;
    pub fn init_master(_ctx: Context<InitMaster>) -> Result<()> {
        Ok(())
    }

    pub fn create_lottery(ctx: Context<CreateLottery>, ticket_price: u64) -> Result<()> {
        let master = &mut ctx.accounts.master;
        let lottery = &mut ctx.accounts.lottery;

        // Increment the last ticket id
        master.last_id += 1;

        // Set lottery values
        lottery.id = master.last_id;
        lottery.authority = ctx.accounts.authority.key();
        lottery.ticket_price = ticket_price;

        msg!("Created lottery: {}", lottery.id);
        msg!("Authority: {}", lottery.authority);
        msg!("Ticket price: {}", lottery.ticket_price);

        Ok(())
    }

    pub fn buy_ticket_with_token(ctx: Context<BuyTicketWithToken>, lottery_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;
        let ticket = &mut ctx.accounts.ticket;
        let buyer = &ctx.accounts.buyer;

        //if lottery.winner_id.is_some() {// TODO
        if lottery.winner_id > 0 {
            return err!(LotteryError::WinnerAlreadyExists);
        }
          // transfer X token from sender -> PDA vault 
          let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(), 
            SplTransfer {
                from: ctx.accounts.buyer_token_account.to_account_info().clone(), 
                to: ctx.accounts.lottery_token_account.to_account_info().clone(),
                authority: ctx.accounts.buyer.to_account_info().clone(), 
            }
        );
        token::transfer(transfer_ctx,  lottery.ticket_price)?;


        lottery.last_ticket_id += 1;

        ticket.id = lottery.last_ticket_id;
        ticket.lottery_id = lottery_id;
        ticket.authority = buyer.key();

        msg!("Ticket id: {}", ticket.id);
        msg!("Ticket authority: {}", ticket.authority);

        Ok(())
    }

    // TODO


    pub fn depositToStaking(ctx: Context<DepositStaking>, amount: u64,lottery_id: u32) -> Result<()> {

        let cpi_program = ctx.accounts.staking_program.to_account_info();
       
        let lottery = &mut ctx.accounts.lottery;
        let token_account = &mut ctx.accounts.token_x;
        let synth_x_mint = &mut ctx.accounts.synth_x_mint;
        let vault_x = &mut ctx.accounts.vault_x;
        let sender_token_synth_x = &mut ctx.accounts.sender_token_synth_x;
        let sender_token_x = &mut ctx.accounts.sender_token_x;
        // TODO: check that lottery token equals staking token
        // if (!token_account.to_account_info().key.equals(lottery.token)) {
        //     return err!(LotteryError::BadToken);
        // }
        //require_keys_eq!(token_account.key(), lottery.token,LotteryError::BadToken);

        let bump = ctx.bumps.lottery;
        let pda_sign =&[&[b"lottery", lottery_id.to_le_bytes().as_ref(), &[bump]]];

        
        let seeds = b"lottery";
        let binding = lottery_id.to_le_bytes();
        let bump = ctx.bumps.lottery;
        let pda_sign: &[&[&[u8]]] = &[&[seeds,binding.as_ref(), &[bump]]];

        let cpi_accounts = Operation {
            token_x: token_account.to_account_info(),
            sender_token_x: sender_token_x.to_account_info(),
            synthetic_x: synth_x_mint.to_account_info(),
            vault_x: vault_x.to_account_info(),
            sender: lottery.to_account_info(),
            sender_token_synth_x:sender_token_synth_x.to_account_info(),
            receipt: ctx.accounts.receipt.to_account_info(), 
            token_program: ctx.accounts.token_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts ,pda_sign);
        staking::cpi::add(cpi_ctx,amount)
      
    }

    pub fn removeFromStaking(ctx: Context<RemoveStaking>,lottery_id: u32) -> Result<()> {

        let cpi_program = ctx.accounts.staking_program.to_account_info();
       
        let lottery = &mut ctx.accounts.lottery;
        let token_account = &mut ctx.accounts.token_x;
        let synth_x_mint = &mut ctx.accounts.synth_x_mint;
        let vault_x = &mut ctx.accounts.vault_x;
        let sender_token_synth_x = &mut ctx.accounts.sender_token_synth_x;
        let sender_token_x = &mut ctx.accounts.sender_token_x;
        // TODO: check that lottery token equals staking token
        // if (!token_account.to_account_info().key.equals(lottery.token)) {
        //     return err!(LotteryError::BadToken);
        // }
        //require_keys_eq!(token_account.key(), lottery.token,LotteryError::BadToken);

        let bump = ctx.bumps.lottery;
        let pda_sign =&[&[b"lottery", lottery_id.to_le_bytes().as_ref(), &[bump]]];

        
        let seeds = b"lottery";
        let binding = lottery_id.to_le_bytes();
        let bump = ctx.bumps.lottery;
        let pda_sign: &[&[&[u8]]] = &[&[seeds,binding.as_ref(), &[bump]]];

        let cpi_accounts = Operation {
            token_x: token_account.to_account_info(),
            sender_token_x: sender_token_x.to_account_info(),
            synthetic_x: synth_x_mint.to_account_info(),
            vault_x: vault_x.to_account_info(),
            sender: lottery.to_account_info(),
            sender_token_synth_x:sender_token_synth_x.to_account_info(),
            receipt: ctx.accounts.receipt.to_account_info(), 
            token_program: ctx.accounts.token_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts ,pda_sign);
        staking::cpi::remove(cpi_ctx)
      
    }



    // fin TODO
    pub fn buy_ticket(ctx: Context<BuyTicket>, lottery_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;
        let ticket = &mut ctx.accounts.ticket;
        let buyer = &ctx.accounts.buyer;

        //if lottery.winner_id.is_some() {// TODO
        if lottery.winner_id > 0 {
            return err!(LotteryError::WinnerAlreadyExists);
        }

        // Transfer SOL to Lottery PDA
        invoke(
            &transfer(&buyer.key(), &lottery.key(), lottery.ticket_price),
            &[
                buyer.to_account_info(),
                lottery.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        lottery.last_ticket_id += 1;

        ticket.id = lottery.last_ticket_id;
        ticket.lottery_id = lottery_id;
        ticket.authority = buyer.key();

        msg!("Ticket id: {}", ticket.id);
        msg!("Ticket authority: {}", ticket.authority);

        Ok(())
    }

    pub fn pick_winner(ctx: Context<PickWinner>, _lottery_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;

       // if lottery.winner_id.is_some() {
        if lottery.winner_id > 0 {
            return err!(LotteryError::WinnerAlreadyExists);
        }
        if lottery.last_ticket_id == 0 {
            return err!(LotteryError::NoTickets);

        }

        // Pick a pseudo-random winner
        // TODO
        // let clock = Clock::get()?;
        // let pseudo_random_number = ((u64::from_le_bytes(
        //     <[u8; 8]>::try_from(&hash(&clock.unix_timestamp.to_le_bytes()).to_bytes()[..8])
        //         .unwrap(),
        // ) * clock.slot)
        //     % u32::MAX as u64) as u32;

        // let winner_id = (pseudo_random_number % lottery.last_ticket_id) + 1;
        let winner_id = 1;
        lottery.winner_id = winner_id;// Some(winner_id);// TODO

        msg!("Winner id: {}", winner_id);

        Ok(())
    }




    pub fn claim_prizeToken(ctx: Context<ClaimPrizeToken>, lottery_id: u32, _ticket_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;
        let ticket = &ctx.accounts.ticket;
        let winner = &ctx.accounts.authority;

        if lottery.claimed {
            return err!(LotteryError::AlreadyClaimed);
        }

        // Validate winner_id
        // match lottery.winner_id {

        //     Some(winner_id) => {
        //         if winner_id != ticket.id {
        //             return err!(LotteryError::InvalidWinner);
        //         }
        //     }
        //     None => return err!(LotteryError::WinnerNotChosen),
        // };
        
        if lottery.winner_id != ticket.id
        {
            return err!(LotteryError::InvalidWinner);
        }

        // Transfer the prize from Lottery PDA to the winner
        // let prize = lottery
        //     .ticket_price
        //     .checked_mul(lottery.last_ticket_id.into())
        //     .unwrap();

        // **lottery.to_account_info().try_borrow_mut_lamports()? -= prize;
        // **winner.to_account_info().try_borrow_mut_lamports()? += prize;
        let amt: u64 = ctx.accounts.sender_token_synth_x.amount;
        // send rewards 
        let transfer_ctx = CpiContext::new(
          ctx.accounts.token_program.to_account_info(), 
          SplTransfer {
                from: ctx.accounts.sender_token_synth_x.to_account_info().clone(), 
                to: ctx.accounts.receiver_token_synth_x.to_account_info().clone(),
                authority: lottery.to_account_info().clone(), 
            }
            
            );

    
            let bump = ctx.bumps.lottery;
            let binding = lottery_id.to_le_bytes();
            let pda_sign = &[
                b"lottery",
                binding.as_ref(),
                &[bump],
            ];


    
        token::transfer(
            transfer_ctx.with_signer(&[pda_sign]), 
            amt
        )?;
        lottery.claimed = true;

        msg!(
            "{} claimed {} lamports from lottery id {} with ticket id {}",
            winner.key(),
            amt,
            lottery.id,
            ticket.id
        );

        Ok(())
    }

    pub fn refund_ticketToken(ctx: Context<RefundTicketToken>, lottery_id: u32, _ticket_id: u32) -> Result<()> {
        let lottery = &mut ctx.accounts.lottery;
        let ticket = &ctx.accounts.ticket;
        let winner = &ctx.accounts.authority;

  
        // TODO: handle per ticket isrefunded 
        let amt: u64 = lottery.ticket_price;
        // send rewards 
        let transfer_ctx = CpiContext::new(
          ctx.accounts.token_program.to_account_info(), 
          SplTransfer {
                from: ctx.accounts.sender_token_x.to_account_info().clone(), 
                to: ctx.accounts.receiver_token_x.to_account_info().clone(),
                authority: lottery.to_account_info().clone(), 
            }
            
            );

    
            let bump = ctx.bumps.lottery;
            let binding = lottery_id.to_le_bytes();
            let pda_sign = &[
                b"lottery",
                binding.as_ref(),
                &[bump],
            ];


    
        token::transfer(
            transfer_ctx.with_signer(&[pda_sign]), 
            amt
        )?;
        

        msg!(
            "refunded");

        Ok(())
    }

    // pub fn claim_prize(ctx: Context<ClaimPrize>, _lottery_id: u32, _ticket_id: u32) -> Result<()> {
    //     let lottery = &mut ctx.accounts.lottery;
    //     let ticket = &ctx.accounts.ticket;
    //     let winner = &ctx.accounts.authority;

    //     if lottery.claimed {
    //         return err!(LotteryError::AlreadyClaimed);
    //     }

    //     // Validate winner_id
    //     match lottery.winner_id {
    //         Some(winner_id) => {
    //             if winner_id != ticket.id {
    //                 return err!(LotteryError::InvalidWinner);
    //             }
    //         }
    //         None => return err!(LotteryError::WinnerNotChosen),
    //     };

    //     // Transfer the prize from Lottery PDA to the winner
    //     let prize = lottery
    //         .ticket_price
    //         .checked_mul(lottery.last_ticket_id.into())
    //         .unwrap();

    //     **lottery.to_account_info().try_borrow_mut_lamports()? -= prize;
    //     **winner.to_account_info().try_borrow_mut_lamports()? += prize;

    //     lottery.claimed = true;

    //     msg!(
    //         "{} claimed {} lamports from lottery id {} with ticket id {}",
    //         winner.key(),
    //         prize,
    //         lottery.id,
    //         ticket.id
    //     );

    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct InitMaster<'info> {
    #[account(
        init,
        payer = payer,
        space = 8 + 4,
        seeds = [MASTER_SEED.as_bytes()],
        bump,
    )]
    pub master: Account<'info, Master>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Master {
    pub last_id: u32,
}


#[derive(Accounts)]
#[instruction(amount:u64,lottery_id: u32)]
pub struct DepositStaking<'info> {

    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(mut)]   
    pub token_x: Account<'info, Mint>,
    #[account(mut)] 
    pub synth_x_mint: Account<'info, Mint>, // mint of synthetic token X
    #[account(mut)] 
    pub vault_x:Account<'info, TokenAccount>,
    #[account(mut)]
    pub sender_token_synth_x: Account<'info, TokenAccount>,
    #[account(mut)]
    pub sender_token_x: Account<'info, TokenAccount>,
   
    #[account(mut)]    
    pub receipt: Account<'info, Receipt>,

    pub staking_program: Program<'info, Staking>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct RemoveStaking<'info> {

    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(mut)]   
    pub token_x: Account<'info, Mint>,
    #[account(mut)] 
    pub synth_x_mint: Account<'info, Mint>, // mint of synthetic token X
    #[account(mut)] 
    pub vault_x:Account<'info, TokenAccount>,
    #[account(mut)]
    pub sender_token_synth_x: Account<'info, TokenAccount>,
    #[account(mut)]
    pub sender_token_x: Account<'info, TokenAccount>,
   
    #[account(mut)]    
    pub receipt: Account<'info, Receipt>,

    pub staking_program: Program<'info, Staking>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateLottery<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 4 + 32 +32+ 8 + 4 +4 + 1,
        //seeds = [LOTTERY_SEED.as_bytes(), &(master.last_id + 1).to_le_bytes()],
        seeds = [LOTTERY_SEED.as_bytes(), &(master.last_id + 1).to_le_bytes()],
        
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(
        mut,
        seeds = [MASTER_SEED.as_bytes()],
        bump,
    )]
    pub master: Account<'info, Master>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct BuyTicketWithToken<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(
        init,
        payer = buyer,
        space = 8 + 4 + 4 + 32,
        seeds = [
            TICKET_SEED.as_bytes(),
            lottery.key().as_ref(),
            &(lottery.last_ticket_id + 1).to_le_bytes()
        ],
        bump,
    )]
    pub ticket: Account<'info, Ticket>,
    #[account(mut)]
    pub lottery_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,
  
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct BuyTicket<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(
        init,
        payer = buyer,
        space = 8 + 4 + 4 + 32,
        seeds = [
            TICKET_SEED.as_bytes(),
            lottery.key().as_ref(),
            &(lottery.last_ticket_id + 1).to_le_bytes()
        ],
        bump,
    )]
    pub ticket: Account<'info, Ticket>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Ticket {
    pub id: u32,
    pub lottery_id: u32,
    pub authority: Pubkey,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32)]
pub struct PickWinner<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
        has_one = authority,
    )]
    pub lottery: Account<'info, Lottery>,
    pub authority: Signer<'info>,
}



#[derive(Accounts)]
#[instruction(lottery_id: u32, ticket_id: u32)]
pub struct ClaimPrize<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(
        seeds = [
            TICKET_SEED.as_bytes(),
            lottery.key().as_ref(),
            &ticket_id.to_le_bytes()
        ],
        bump,
        has_one = authority,
    )]
    pub ticket: Account<'info, Ticket>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(lottery_id: u32, ticket_id: u32)]
pub struct ClaimPrizeToken<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(
        seeds = [
            TICKET_SEED.as_bytes(),
            lottery.key().as_ref(),
            &ticket_id.to_le_bytes()
        ],
        bump,
        has_one = authority,
    )]
    pub ticket: Account<'info, Ticket>,
    #[account(mut)]
    pub sender_token_synth_x: Account<'info, TokenAccount>,  
    #[account(mut)]
    pub receiver_token_synth_x: Account<'info, TokenAccount>,  
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
#[instruction(lottery_id: u32, ticket_id: u32)]
pub struct RefundTicketToken<'info> {
    #[account(
        mut,
        seeds = [LOTTERY_SEED.as_bytes(), &lottery_id.to_le_bytes()],
        bump,
    )]
    pub lottery: Account<'info, Lottery>,
    #[account(
        seeds = [
            TICKET_SEED.as_bytes(),
            lottery.key().as_ref(),
            &ticket_id.to_le_bytes()
        ],
        bump,
        has_one = authority,
    )]
    pub ticket: Account<'info, Ticket>,
    #[account(mut)]
    pub sender_token_x: Account<'info, TokenAccount>,  
    #[account(mut)]
    pub receiver_token_x: Account<'info, TokenAccount>,  
    #[account(mut)]
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}