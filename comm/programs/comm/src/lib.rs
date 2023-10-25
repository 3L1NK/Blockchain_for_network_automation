use anchor_lang::prelude::*;

declare_id!("AfHQ19owBBVPCyoM2HnnBvqnTgZLwzjLNqvBybHrmtCY");

#[program]
pub mod comm {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>, sensor: Pubkey, upper_bound: f32, lower_bound: f32) -> Result<()> {
        // pubkey from our admin account
        let admin = Pubkey::new_from_array([225,180,43,99,227,231,178,146,65,99,162,210,58,56,208,76,99,242,104,242,11,222,171,185,107,218,113,117,13,14,49,22]);
        if ctx.accounts.user.key() != admin {
            return err!(ErrorCode::ConstraintSigner);
        }
        let state_data = &mut ctx.accounts.data_account;
        state_data.admin_auth = admin;
        state_data.sensor_auth = sensor;
        state_data.upper_bound = upper_bound;
        state_data.lower_bound = lower_bound;
        state_data.state = 0;
        Ok(())
    }
    pub fn evaluate(ctx: Context<Evaluate>, data: [f32; 10]) -> Result<()> {
        let state_data = &mut ctx.accounts.data_account;
        let mut state = 0;
        if data.iter().any(|x| x <= &state_data.lower_bound || x >= &state_data.upper_bound) { state = 1; }
        if state != state_data.state {
            state_data.state = state;
            // send an event that clients can subscribe to
            emit!(StateChanged {
                state: state_data.state, data_account: state_data.key().to_string()
            });
        }
        Ok(())
    }
    pub fn set_upper_bound(ctx: Context<SetUpperBound>, data: f32) -> Result<()> {
        let state_data = &mut ctx.accounts.data_account;
        state_data.upper_bound = data;
        Ok(())
    }
    pub fn set_lower_bound(ctx: Context<SetLowerBound>, data: f32) -> Result<()> {
        let state_data = &mut ctx.accounts.data_account;
        state_data.lower_bound = data;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 32 + 32 + 1 + 4 + 4)]
    pub data_account: Account<'info, StateData>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(data: [f32;10])]
pub struct Evaluate<'info> {
    #[account(mut, has_one = sensor_auth)]
    pub data_account: Account<'info, StateData>,
    pub sensor_auth: Signer<'info>,
}
#[derive(Accounts)]
pub struct SetLowerBound<'info> {
    #[account(mut, has_one = admin_auth)]
    pub data_account: Account<'info, StateData>,
    pub admin_auth: Signer<'info>,
}
#[derive(Accounts)]
pub struct SetUpperBound<'info> {
    #[account(mut, has_one = admin_auth)]
    pub data_account: Account<'info, StateData>, 
    pub admin_auth: Signer<'info>,
}

#[account]
pub struct StateData {
    pub admin_auth: Pubkey,
    pub sensor_auth: Pubkey,
    pub state: u8,
    pub upper_bound: f32,
    pub lower_bound: f32,
}

#[event]
pub struct StateChanged {
    pub state: u8,
    pub data_account: String
}
