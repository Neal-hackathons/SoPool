use anchor_lang::prelude::*;




#[account]
pub struct Lottery {
    pub id: u32,
    pub authority: Pubkey,
    pub token: Pubkey,
    pub ticket_price: u64,
    pub last_ticket_id: u32,
    //pub winner_id: Option<u32>, // TODO
    pub winner_id: u32,
    pub claimed: bool,
}
