use anchor_lang::prelude::*;




#[account]
pub struct UserInfo {
    pub amount: u64,
    pub reward_debt: u64,
    pub deposit_slot: u64,
}

#[account]
#[derive(Default)] // will be init to zeros 
pub struct Receipt {
    pub is_valid: u8,
    pub created_ts: i64,
    pub amount_deposited: u64,
}



impl UserInfo {
    pub const LEN: usize = 8 + 8 + 8;
}

