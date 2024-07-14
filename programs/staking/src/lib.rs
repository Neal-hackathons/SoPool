use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{self,Mint, MintTo, Token, TokenAccount,Transfer as SplTransfer},   
};

//mod instruction;
mod state;

//use instructions::*;
use state::*;





declare_id!("DQ2xiRbRvJuymAZSTj7kd7T8Auagh49NuKv6jS8kpX5c");

#[program]
mod staking {
    use super::*;


    

    pub fn initialize(ctx: Context<CreateVault>) -> Result<()> {
        msg!("Instruction: Initialize");

        Ok(())
    }




    pub fn new_staker(ctx: Context<NewStaker>) -> Result<()> {    
        
        Ok(())
    }

    pub fn add(ctx: Context<Operation>, deposit_amount: u64) -> Result<()> {    

        let receipt = &mut ctx.accounts.receipt;

        // record new staked add 
        if receipt.is_valid == 0 {
            receipt.is_valid = 1;
            // TODO
            //receipt.created_ts = ctx.accounts.clock.unix_timestamp;
            receipt.amount_deposited = deposit_amount;
        }
        // TODO
        // else { 
        //     // cant stake twice 
        //     return Err(ErrorCode::AccountAlreadyStakedError.into());
        // }

        // transfer X token from sender -> PDA vault 
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(), 
            SplTransfer {
                from: ctx.accounts.sender_token_x.to_account_info().clone(), 
                to: ctx.accounts.vault_x.to_account_info().clone(),
                authority: ctx.accounts.sender.to_account_info().clone(), 
            }
        );
        token::transfer(transfer_ctx, deposit_amount)?;

        // transfer synthetic X to sender 
        // let mint_ctx = CpiContext::new(
        //     ctx.accounts.token_program.to_account_info(), 
        //     MintTo {
        //         to: ctx.accounts.sender_token_synth_x.to_account_info(),
        //         mint: ctx.accounts.synthetic_x.to_account_info(),
        //         authority: ctx.accounts.synthetic_x.to_account_info(),
        //     }
        // );
        // let bump = *ctx.bumps.get("synthetic_x").unwrap();
        // let tokenx_key = ctx.accounts.token_x.key();
        // let pda_sign = &[
        //     b"synthetic",
        //     tokenx_key.as_ref(),
        //     &[bump],
        // ];
        // token::mint_to(
        //     mint_ctx.with_signer(&[pda_sign]), 
        //     deposit_amount
        // )?;

        Ok(())
    }   

    pub fn remove(ctx: Context<Operation>) -> Result<()> {

        // compute bonus for staking 
        let receipt = &mut ctx.accounts.receipt;

        // TODO
        // if receipt.is_valid == 0 { // must have staked in order to remove
        //     return Err(ProgramError::InvalidAccountData)
        // }
        let deposited_amount = receipt.amount_deposited;
        let start_time = receipt.created_ts; 

        // TODO
        // let curr_time = ctx.accounts.clock.unix_timestamp; 
        
        // // ~1 reward per second (note: unix time isnt always perfect)
        // let diff_time = curr_time - start_time;
        // // compute burn amount after rewards for staking 
        // let burn_amount = max(0, deposited_amount - diff_time as u64);

        // reset receipt validity 
        receipt.is_valid = 0; 

        // // remove SynthX from sender 
        // if burn_amount > 0 {
        //     let burn_ctx = CpiContext::new(
        //         ctx.accounts.token_program.to_account_info(), 
        //         Burn {
        //             mint: ctx.accounts.synthetic_x.to_account_info(),
        //             to: ctx.accounts.sender_token_synth_x.to_account_info(),
        //             authority: ctx.accounts.sender.to_account_info()
        //         }
        //     );
        //     token::burn(burn_ctx, burn_amount)?;
        // }

        // send back the deposited tokens 
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(), 
            SplTransfer {
                from: ctx.accounts.vault_x.to_account_info().clone(), 
                to: ctx.accounts.sender_token_x.to_account_info().clone(),
                authority: ctx.accounts.vault_x.to_account_info().clone(), 
            }
        );
        //let bump = *ctx.bumps.get("vault_x").unwrap();
        let bump = ctx.bumps.vault_x;
        let tokenx_key = ctx.accounts.token_x.key();

        let pda_sign = &[
            b"vault",
            tokenx_key.as_ref(),
            &[bump],
        ];

        token::transfer(
            transfer_ctx.with_signer(&[pda_sign]), 
            deposited_amount
        )?;

        Ok(())
    }

    // TODO
    // pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
    //     msg!("Instruction: Claim Reward");

    //     let user_info = &mut ctx.accounts.user_info;
    //     let clock = Clock::get()?;

    //     let reward = (clock.slot - user_info.deposit_slot) - user_info.reward_debt;

    //     let cpi_accounts = MintTo {
    //         mint: ctx.accounts.staking_token.to_account_info(),
    //         to: ctx.accounts.user_staking_wallet.to_account_info(),
    //         authority: ctx.accounts.admin.to_account_info(),
    //     };
    //     let cpi_program = ctx.accounts.token_program.to_account_info();
    //     let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    //     token::mint_to(cpi_ctx, reward)?;

    //     user_info.reward_debt += reward;

    //     Ok(())
    // }




}


#[derive(Accounts)]
pub struct CreateVault<'info> {
    #[account(
        init, 
        payer=payer, 
        seeds=[b"vault", token_x.key().as_ref()], 
        bump,
        token::mint = token_x,
        token::authority = vault_x
    )]
    pub vault_x: Account<'info, TokenAccount>,//pda 
    pub token_x: Account<'info, Mint>,// token
    #[account(mut)]
    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,
     //pub associated_token_program: Program<'info, AssociatedToken>, // NEEDED?
    pub token_program: Program<'info, Token>,
    //pub rent: Sysvar<'info, Rent>, // NEEDED?
}


#[derive(Accounts)]
pub struct NewStaker<'info> {
    pub token_x: Account<'info, Mint>,
    #[account(init, payer=sender, seeds=[b"receipt", token_x.key().as_ref(), sender.key().as_ref()], bump,space = 8 + 8 +8 + 1)] 
    pub receipt: Account<'info, Receipt>,
    #[account(mut)]
    pub sender: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Operation<'info> {
    pub token_x: Account<'info, Mint>,
    // #[account(mut, seeds=[b"synthetic", token_x.key().as_ref()], bump)] 
    // pub synthetic_x: Account<'info, Mint>, // mint of synthetic token X
    #[account(mut, seeds=[b"vault", token_x.key().as_ref()], bump)] 
    pub vault_x: Account<'info, TokenAccount>, // mint to hold token X
    #[account(mut)]
    pub sender: Signer<'info>,
    #[account(mut)]
    pub sender_token_x: Account<'info, TokenAccount>,
    // #[account(mut)]
    // pub sender_token_synth_x: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    //pub clock: Sysvar<'info, Clock>,
    #[account(mut, seeds=[b"receipt", token_x.key().as_ref(), sender.key().as_ref()], bump)] 
    pub receipt: Account<'info, Receipt>,
}




