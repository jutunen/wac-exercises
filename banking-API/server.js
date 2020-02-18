const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const store = require("./store.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/bank/:user_id/balance", (req, res) => {
    const response = handleBalanceReq(req.params.user_id);
    res.send(response);
});

app.post("/bank/user", (req, res) => {
    const response = handleNewUserReq(req.body);
    res.send(response);
});

app.patch("/bank/user/withdraw", (req, res) => {
    const response = handleWithdrawReq(req.body);
    res.send(response);
});

app.patch("/bank/user/deposit", (req, res) => {
    const response = handleDepositReq(req.body);
    res.send(response);
});

console.log("Listening port 5000");
app.listen(5000);

function handleBalanceReq(userId) {
    const currentAccounts = store.getInitAccounts();

    if (store.isExistentId(userId, currentAccounts)) {
        const balance = store.getBalance(userId, currentAccounts);
        return { balance: balance };
    } else {
        return { error: "Invalid id" };
    }
}

function handleNewUserReq(request) {
    const { name, deposit, passwd } = request;
    const currentAccounts = store.getInitAccounts();
    const newId = store.generateId(currentAccounts);
    store.addAccount(name, passwd, newId, deposit, currentAccounts);
    //store.printAccounts();
    return { id: newId };
}

function handleWithdrawReq(request) {
    const { id, amount, passwd } = request;

    const currentAccounts = store.getInitAccounts();

    if (!store.isExistentId(id, currentAccounts)) {
        return { error: "Invalid id" };
    }

    if (!store.isCorrectPasswd(passwd, id, currentAccounts)) {
        return { error: "Invalid password" };
    }

    const balance = store.getBalance(id, currentAccounts);

    if (Number(amount) > Number(balance)) {
        return { error: "Insufficient balance" };
    }

    const newBalance = store.updateAccountAfterWithdrawal(
        id,
        amount,
        currentAccounts
    );

    return { balance: newBalance };
}

function handleDepositReq(request) {
    const { id, amount, passwd } = request;

    const currentAccounts = store.getInitAccounts();

    if (!store.isExistentId(id, currentAccounts)) {
        return { error: "Invalid id" };
    }

    if (!store.isCorrectPasswd(passwd, id, currentAccounts)) {
        return { error: "Invalid password" };
    }

    if (!store.isValidSum(amount)) {
        return { error: "Invalid amount" };
    }

    const newBalance = store.updateAccountAfterDeposit(
        id,
        amount,
        currentAccounts
    );

    return { balance: newBalance };
}
