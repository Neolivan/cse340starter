const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
    try {
      const sql = "SELECT * FROM account WHERE account_email = $1"
      const email = await pool.query(sql, [account_email])
      return email.rowCount
    } catch (error) {
      return error.message
    }
  }
  /* **********************
 *   Get Account by id
 * ********************* */
async function getAccountById(account_id){
    try {
      const result = await pool.query(
        'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
        [account_id])
      return result.rows[0]
    } catch (error) {
      return error.message
    }
  }
  
/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ***************************
 *  Update user info Data
 * ************************** */
async function updateInfo(
  account_email,
    account_firstname,
    account_lastname,
    account_id
) {
  try {
    const sql =
      "UPDATE public.account SET account_email = $1, account_firstname = $2, account_lastname = $3 WHERE account_id = $4 RETURNING *"
    const data = await pool.query(sql, [
      account_email,
    account_firstname,
    account_lastname,
    account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update user info Data
 * ************************** */
async function adminUpdateInfo(
  account_email,
    account_firstname,
    account_lastname,
    account_id,
    account_type
) {
  try {
    const sql =
      "UPDATE public.account SET account_email = $1, account_firstname = $2, account_lastname = $3, account_type = $4 WHERE account_id = $5 RETURNING *"
    const data = await pool.query(sql, [
      account_email,
    account_firstname,
    account_lastname,
    account_type,
    account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Update user password Data
 * ************************** */
async function updatePass(
  account_password,
    account_id
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      account_password,
    account_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

  /* **********************
 *   Get all accounts
 * ********************* */
  async function getAllAccounts(){
    try {
      const sql = "SELECT * FROM account"
      const data = await pool.query(sql)
      return data.rows
    } catch (error) {
      return error.message
    }
  }

  /* **********************
 *   Delete account by id
 * ********************* */
  async function deleteAccount(account_id){
    try {
      const sql = 'DELETE FROM account WHERE account_id = $1';
      const data = await pool.query(sql,[account_id])
      return data.rows
    } catch (error) {
      return new Error("Delete Account Error")
    }
  }

  module.exports ={registerAccount,checkExistingEmail, getAccountByEmail,updateInfo,updatePass,getAllAccounts,getAccountById,adminUpdateInfo,deleteAccount}