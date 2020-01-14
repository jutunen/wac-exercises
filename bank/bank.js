const readline = require("readline-sync");

const initStr = 'Welcome to Buutti banking CLI! Hint: You can get help with the commands by typing “help”.';

const helpStr =
`Accounts
create_account -- > Opens dialog for creating an account.
close_account -- > Opens a dialog for closing an account.
modify_account -- > Opens a dialog for modifying an account.
does_account_exist -- > Opens a dialog for checking if the account exists.
Funds
withdraw_funds -- > Opens a dialog for withdrawing funds.
deposit_funds -- > Opens a dialog for depositing funds.
transfer_funds -- > Opens a dialog for transferring funds to another account.
Program control
quit -- > Quit`;

const createAccountStr_1 = 'So you want to create a new account!';
const createAccountStr_2 = 'Let’s start with the easy question. What is your name?';
const createAccountStr_3 = 'Hey x! It’s great to have you as a client.';
const createAccountStr_4 = 'How much cash do you want to deposit to get started with your account? (10€ is the minimum)';
const createAccountStr_5 = 'Unfortunately we can’t open an account for such a small account. Please give bigger sum of cash.';
const createAccountStr_6 = 'Great #! You now have an account (ID: ¤) with balance of % €.';
const createAccountStr_7 = 'We’re happy to have you as a customer, and we want to ensure that your money is safe with us.';
const createAccountStr_8 = 'Give us a password, which gives only you the access to your account.';
const createAccountStr_9 = 'Account created successfully.';

const authenticationStr_1 = 'What is your account id?'
const authenticationStr_2 = 'Id does not exist.'
const authenticationStr_3 = 'What is your password?'
const authenticationStr_4 = 'Wrong password.'
const authenticationStr_5 = 'Hello x.'

const withdrawFundsStr_1 = 'You selected withdraw.'
const withdrawFundsStr_2 = 'Your current balance is x €. How much do you want to withdraw?'
const withdrawFundsStr_3 = 'That exceeds your balance.'
const withdrawFundsStr_4 = 'Withdrawal completed successfully. Your current balance is x €.'

const depositFundsStr_1 = 'You selected deposit.'
const depositFundsStr_2 = 'Your current balance is x €. How much do you want to deposit?'
const depositFundsStr_3 = 'Deposit completed successfully. Your current balance is x €.'

const transferFundsStr_1 = 'You selected transfer.'
const transferFundsStr_2 = 'Your current balance is x €. How much do you want to transfer?'
const transferFundsStr_3 = 'That exceeds your balance.'
const transferFundsStr_4 = 'What is the transfer destination account ID?'
const transferFundsStr_5 = 'Account with that ID does not exist.'
const transferFundsStr_6 = 'Transfer completed successfully. Your current balance is x €.'

const modifyAccountStr_1 = 'You selected account modification.'
const modifyAccountStr_2 = 'What is the new name for account owner?'
const modifyAccountStr_3 = 'That is the current name for account owner.'
const modifyAccountStr_4 = 'Account owner name changed succesfully.'

const accountExistsStr_1 = 'You selected account existence checking.'
const accountExistsStr_2 = 'Please give the account ID to be checked.'
const accountExistsStr_3 = 'Account with ID x exists.'
const accountExistsStr_4 = 'Account with ID x does not exist.'

main();

function main() {

  let all_users = [
    {"name":"Antti","password":"qwert","id":6,"balance":100},
    {"name":"Marko","password":"asdf","id":5,"balance":10},
    {"name":"Risto","password":"zxcv","id":1,"balance":50},
    {"name":"Keijo","password":"1234","id":2,"balance":0},
    {"name":"Tarja","password":"9876","id":3,"balance":150},
  ];

  while(true) {
    console.log(initStr);
    let input = readline.question(":");

    if(input === 'help') {
      console.log(helpStr)
    } else if(input === 'create_account') {
      let account = createAccount(all_users);
    } else if(input === 'quit') {
      process.exit()
    } else if(input === 'debug') {
      for(let i = 0; i < all_users.length; i++) {
        console.log(JSON.stringify(all_users[i]));
      }
    } else if(input === 'withdraw_funds') {
      withdrawFunds(all_users);
    } else if(input === 'deposit_funds') {
      depositFunds(all_users);
    } else if(input === 'transfer_funds') {
      transferFunds(all_users);
    } else if(input === 'modify_account') {
      modifyAccount(all_users);
    } else if(input === 'does_account_exist') {
      checkAccountExistence(all_users);
    }
  }
}

function checkAccountExistence(all_users) {

  let id;
  console.log(accountExistsStr_1);

  do {
    console.log(accountExistsStr_2);
    id = readline.question(":");
  } while( !isValidInput(id) )

  if(isExistentId(id,all_users)) {
    console.log(accountExistsStr_3.replace('x',id));
  } else {
    console.log(accountExistsStr_4.replace('x',id));
  }
}

function authenticateUser(all_users) {

  let id, passwd, sum;

  do {
    console.log(authenticationStr_1);
    id = readline.question(":");
  } while( !isValidInput(id) )

  while( !isExistentId(id,all_users) ) {
    console.log(authenticationStr_2 + ' ' + authenticationStr_1);
    id = readline.question(":");
  }

  do {
    console.log(authenticationStr_3);
    passwd = readline.question(":");
  } while( !isValidInput(passwd) )

  while( !isCorrectPasswd(passwd,id,all_users) ) {
    console.log(authenticationStr_4 + ' ' + authenticationStr_3);
    passwd = readline.question(":");
  }

  let accountOwner = getName(id, all_users);
  console.log(authenticationStr_5.replace('x',accountOwner));
  return id;
}

function modifyAccount(all_users) {

  let id, newAccountOwner;

  console.log(modifyAccountStr_1);

  id = authenticateUser(all_users);

  do {
    console.log(modifyAccountStr_2);
    newAccountOwner = readline.question(":");
  } while( !isValidInput(newAccountOwner) )

  let currentAccountOwner = getName(id, all_users);

  while( newAccountOwner.trim().localeCompare( currentAccountOwner.trim(), undefined, {sensitivity: 'base'}) === 0) {
    console.log(modifyAccountStr_3 + ' ' + modifyAccountStr_2);
    newAccountOwner = readline.question(":");
  }

  updateAccountOwner(id,newAccountOwner,all_users);
  console.log(modifyAccountStr_4);
}

function depositFunds(all_users) {

  let id, sum;

  console.log(depositFundsStr_1);

  id = authenticateUser(all_users);

  let currentBalance = getBalance(id, all_users);

  do {
    console.log(depositFundsStr_2.replace('x',currentBalance));
    sum = Number(readline.question(":"));
  } while( !isValidSum(sum) )

  let newBalance = updateAccountAfterDeposit(id,sum,all_users);
  console.log(depositFundsStr_3.replace('x',newBalance));
}

function withdrawFunds(all_users) {

  let id, sum;

  console.log(withdrawFundsStr_1);

  id = authenticateUser(all_users);

  let currentBalance = getBalance(id, all_users);

  do {
    console.log(withdrawFundsStr_2.replace('x',currentBalance));
    sum = Number(readline.question(":"));
  } while( !isValidSum(sum) )

  while( !isSmallerThanBalance(sum,id,all_users) || !isValidSum(sum) ) {
    console.log(withdrawFundsStr_3 + ' ' + withdrawFundsStr_2.replace('x',currentBalance));
    sum = Number(readline.question(":"));
  }

  let newBalance = updateAccountAfterWithdrawal(id,sum,all_users);
  console.log(withdrawFundsStr_4.replace('x',newBalance));
}

function transferFunds(all_users) {

  let id, sum, destinationId;

  console.log(transferFundsStr_1);

  id = authenticateUser(all_users);

  let currentBalance = getBalance(id, all_users);

  do {
    console.log(transferFundsStr_2.replace('x',currentBalance));
    sum = Number(readline.question(":"));
  } while( !isValidSum(sum) )

  while( !isSmallerThanBalance(sum,id,all_users) || !isValidSum(sum) ) {
    console.log(transferFundsStr_3 + ' ' + transferFundsStr_2.replace('x',currentBalance));
    sum = Number(readline.question(":"));
  }

  do {
    console.log(transferFundsStr_4);
    destinationId = readline.question(":");
  } while( !isValidInput(id) )

  while( !isExistentId(destinationId,all_users) ) {
    console.log(transferFundsStr_5 + ' ' + transferFundsStr_4);
    destinationId = readline.question(":");
  }

  updateAccountAfterDeposit(destinationId,sum,all_users);

  let newBalance = updateAccountAfterWithdrawal(id,sum,all_users);
  console.log(transferFundsStr_6.replace('x',newBalance));
}

function createAccount(all_users) {
  console.log(createAccountStr_1);
  let name = '';
  while(!isValidInput(name)) {
    console.log(createAccountStr_2);
    name = readline.question(":");
  }
  console.log(createAccountStr_3.replace('x',name));
  let deposit = '';
  while(!isValidSum(deposit)) {
    console.log(createAccountStr_4);
    deposit = readline.question(":");
  }
  while(!isBigEnoughDeposit(deposit)) {
    console.log(createAccountStr_5);
    deposit = readline.question(":");
  }
  let accountId = generateAccountId(all_users);
  console.log(createAccountStr_6.replace('#',name).replace('¤',accountId).replace('%',deposit));
  console.log(createAccountStr_7);
  let passwd = '';
  while(!isValidInput(passwd)) {
    console.log(createAccountStr_8);
    passwd = readline.question(":");
  }
  console.log(createAccountStr_9);
  all_users.push({name:name, password:passwd, id: accountId, balance: Number(deposit)});
}

function isValidInput(name) {
  if(name.length === 0) {
    return false;
  }
  return true;
}

function isValidSum(sum) {
  if(sum.length === 0 || isNaN(sum) || sum < 0) {
    return false;
  }
  return true;
}

function isBigEnoughDeposit(deposit) {
  if(Number(deposit) < 10 || deposit.length === 0 || isNaN(deposit) ) {
    return false;
  }
  return true;
}

function generateAccountId(all_users) {
  let existentIds = all_users.map(x => x.id)
  existentIds.sort(function(a, b){return a-b});
  for(let i = 0; i < 100000000; i++) {
    if(existentIds[i] + 1 !== existentIds[i + 1]) {
      return existentIds[i] + 1;
    }
  }
}

function isExistentId(id,all_users) {
  let existentIds = all_users.map(x => x.id)
  if(existentIds.includes(Number(id))) {
    return true;
  }
  return false;
}

function isCorrectPasswd(passwdInput,id,all_users) {
  let account = all_users.find( x => x.id == id )
  if(passwdInput === account.password) {
    return true;
  }
  return false;
}

function getBalance(id,all_users) {
  let account = all_users.find(x => x.id == id )
  return account.balance;
}

function getName(id, all_users) {
  let account = all_users.find(x => x.id == id )
  return account.name;
}

function isSmallerThanBalance(sum,id,all_users) {
  let balance = getBalance(id,all_users);
  if( sum <= balance ) {
    return true;
  }
  return false;
}

function updateAccountOwner(id,newOwner,all_users) {
  for(let i = 0; i < all_users.length; i++) {
    if(all_users[i].id == id) {
      all_users[i].name = newOwner;
    }
  }
}

function updateAccountAfterWithdrawal(id,sum,all_users) {
  for(let i = 0; i < all_users.length; i++) {
    if(all_users[i].id == id) {
      all_users[i].balance -= sum;
      return all_users[i].balance;
    }
  }
}

function updateAccountAfterDeposit(id,sum,all_users) {
  for(let i = 0; i < all_users.length; i++) {
    if(all_users[i].id == id) {
      all_users[i].balance += sum;
      return all_users[i].balance;
    }
  }
}
