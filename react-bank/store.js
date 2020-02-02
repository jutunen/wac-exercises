
const allAccounts = [
  {'name': 'Antti', 'password': '5', 'id': 5, 'balance': 100},
  {'name': 'Marko', 'password': '4', 'id': 4, 'balance': 10},
  {'name': 'Risto', 'password': '1', 'id': 1, 'balance': 50},
  {'name': 'Keijo', 'password': '2', 'id': 2, 'balance': 0},
  {'name': 'Tarja', 'password': '3', 'id': 3, 'balance': 150},
  {'name': 'Maija', 'password': '0', 'id': 0, 'balance': 1000}
];

const allRequests = [
  {'id': 1, 'requesterId': 5, 'granterId': 3, 'amount': 10},
  {'id': 2, 'requesterId': 0, 'granterId': 1, 'amount': 40},
  {'id': 3, 'requesterId': 3, 'granterId': 0, 'amount': 100},
  {'id': 4, 'requesterId': 4, 'granterId': 2, 'amount': 500}
];

export function getInitAccounts () {
  return allAccounts;
}

export function getInitRequests () {
  return allRequests;
}

export function isCorrectPasswd (passwdInput, id, all_users) {
  const account = all_users.find(x => x.id == id);

  if (account === undefined) {
    return false;
  }

  if (passwdInput === account.password) {
    return true;
  }

  return false;
}

export function generateId (all_users) {
  let existentIds = all_users.map(x => x.id);
  existentIds.sort(function (a, b) { return a - b; });
  for (let i = 0; i < 100000000; i++) {
    if (existentIds[i] + 1 !== existentIds[i + 1]) {
      return existentIds[i] + 1;
    }
  }
}

export function getBalance (id, all_users) {
  let account = all_users.find(x => x.id == id);
  return account.balance;
}

export function getName (id, all_users) {
  let account = all_users.find(x => x.id == id);
  return account.name;
}

export function updateAccountAfterDeposit (id, sum, all_users) {
  for (let i = 0; i < all_users.length; i++) {
    if (all_users[i].id == id) {
      all_users[i].balance += Number(sum);
      return all_users[i].balance;
    }
  }
}

export function updateAccountAfterWithdrawal (id, sum, all_users) {
  for (let i = 0; i < all_users.length; i++) {
    if (all_users[i].id == id) {
      all_users[i].balance -= sum;
      return all_users[i].balance;
    }
  }
}

export function isSmallerThanBalance (sum, id, all_users) {
  let balance = getBalance(id, all_users);
  if (sum <= balance) {
    return true;
  }
  return false;
}

export function isExistentId (id, all_users) {
  let existentIds = all_users.map(x => x.id);
  if (existentIds.includes(Number(id))) {
    return true;
  }
  return false;
}

export function addAccount (name, password, id, balance, all_users) {
  all_users.push({
    name: name,
    password: password,
    id: id,
    balance: balance
  });
}

export function addRequest (requesterId, granterId, amount, all_requests) {
  all_requests.push({
    requesterId: Number(requesterId),
    granterId: Number(granterId),
    amount: Number(amount),
    id: generateId(all_requests)
  });
}

export function removeRequest (id, all_requests) {
  const request = all_requests.find(x => x.id === id);
  const index = all_requests.indexOf(request);
  all_requests.splice(index, 1);
}

export function getRequestsByUserId (id, all_requests) {
  return all_requests.filter(x => x.requesterId === id || x.granterId === id);
}

export function getRequestByReqId (id, all_requests) {
  return all_requests.find(x => x.id === id);
}
