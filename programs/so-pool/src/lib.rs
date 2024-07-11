use anchor_lang::prelude::*;

//mod constants;
//use crate::constants::*;

// This is your program's public key and it will update
// automatically when you build the project
declare_id!("3attdVJrdoB1J82iRdp3Gpo8KmKUK4R4SB5fzKRLFNpH");

#[program]
mod so_pool {
    use super::*;
    pub fn initialize(
        ctx: Context<CreatePool>,
        name: String,
        description: String,
        pool_yield: f32,
    ) -> Result<()> {
        let pool = &mut ctx.accounts.pool;
        pool.name = name; // TODO: tester la limite à 10char
        pool.description = description; // TODO: tester la limite à 32char
        pool.pool_yield = pool_yield;
        pool.active = true;
        pool.prize = 0.;
        pool.owner = ctx.accounts.signer.key();

        msg!("created a new pool: {} : {}!", &pool.name, pool_yield); // Message will show up in the tx logs
        Ok(())
    }
    pub fn stake_crypto(ctx: Context<CreatePooler>, pool: Pubkey, amount: f32) -> Result<()> {
        let pooler = &mut ctx.accounts.pooler;

        pooler.amount = amount;
        pooler.pool = pool;
        pooler.address = ctx.accounts.signer.key();

        msg!("added to the pool: {} : {}!", &pool, amount); // Message will show up in the tx logs
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePool<'info> {
    #[account(init, payer = signer, space = 8 + 10 + 32 + 32 + 8 + 8 +1 )]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CreatePooler<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(init, 
    payer = signer, 
    space = 8 + 32 + 32 + 8 + 1, 
    seeds = [pool.key().as_ref(),signer.key().as_ref()],
    bump )]
    pub pooler: Account<'info, Pooler>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Pool {
    pub name: String,
    pub description: String,
    pub owner: Pubkey,
    pub pool_yield: f32,
    pub prize: f32,
    pub active: bool,
}

#[account]
pub struct Pooler {
    pub address: Pubkey,
    pub pool: Pubkey,
    pub amount: f32,
    //pub token: Pubkey // il faudra ajouter l'adresse du token
}
