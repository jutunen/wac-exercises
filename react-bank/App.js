import React from "react";
import "./App.css";
import * as ID from "./ids.js";
import * as store from "./store.js";
import {
  MenuBar,
  RequestForm,
  TransferForm,
  DepositForm,
  WithdrawalForm,
  Heading,
  InitView
} from "./components.js";
import Modal from "simple-react-modal";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: ID.VIEW_AUTH,
      balance: "",
      deposit: "",
      withdrawal: "",
      transferAmount: "",
      transferAccount: "",
      requestAmount: "",
      requestAccount: "",
      showModal: false
    };
    this.userId = "";
    this.password = "";
    this.regUserName = "";
    this.regPassword = "";
    this.initDeposit = "";
    this.userName = "";
    this.allAccounts = store.getInitAccounts();
    this.allRequests = store.getInitRequests();
  }

  handleAuthAndRegInput = (id, event) => {
    if (id === ID.BTN_AUTH_REG) {
      this.setState({ view: ID.VIEW_REGIST });
    } else if (id === ID.BTN_REG_BACK) {
      this.setState({ view: ID.VIEW_AUTH });
    } else if (id === ID.INP_AUTH_UID) {
      this.userId = Number(event.target.value.trim());
    } else if (id === ID.INP_AUTH_PASSWD) {
      this.password = event.target.value;
    } else if (id === ID.BTN_AUTH_ENTER) {
      this.authenticateUser();
    } else if (id === ID.BTN_REG_REG) {
      this.registerUser();
    } else if (id === ID.INP_REG_NAME) {
      this.regUserName = event.target.value.trim();
    } else if (id === ID.INP_REG_PASSWD) {
      this.regPassword = event.target.value;
    } else if (id === ID.INP_REG_DEPOSIT) {
      this.initDeposit = event.target.value.trim();
    }
  };

  handleMenuInput = (id, event) => {
    if (id === ID.BTN_MENU_EXIT) {
      this.setState({
        view: ID.VIEW_AUTH,
        withdrawal: "",
        deposit: "",
        balance: "",
        transferAmount: "",
        transferAccount: "",
        requestAmount: "",
        requestAccount: ""
      });
      this.password = "";
      this.userId = "";
      //console.log(this.allAccounts);
    } else if (id === ID.BTN_MENU_DEPOSIT) {
      this.setState({ view: ID.VIEW_DEPOSIT });
    } else if (id === ID.BTN_MENU_WITHDRAW) {
      this.setState({ view: ID.VIEW_WITHDRAW });
    } else if (id === ID.BTN_MENU_TRANSFER) {
      this.setState({ view: ID.VIEW_TRANSFER });
    } else if (id === ID.BTN_MENU_REQUESTS) {
      this.setState({ view: ID.VIEW_REQUESTS });
    }
  };

  registerUser = () => {
    if (this.regUserName.length === 0) {
      this.showMsg("Name is missing!\nAdd name!");
      return;
    }

    if (this.regPassword.length === 0) {
      this.showMsg("Password is missing!\nAdd password!");
      return;
    }

    if (this.initDeposit.length > 0) {
      if (!isValidSum(this.initDeposit)) {
        this.showMsg("Invalid deposit!\nCheck deposit!");
        return;
      }
    }

    const balance = this.initDeposit.length > 0 ? Number(this.initDeposit) : 0;
    const id = store.generateId(this.allAccounts);
    const name = this.regUserName;

    store.addAccount(name, this.regPassword, id, balance, this.allAccounts);

    this.setState({ view: ID.VIEW_DEPOSIT, balance: balance });

    this.regUserName = "";
    this.regPassword = "";
    this.initDeposit = "";
    this.userName = name;
    this.userId = id;

    this.showMsg(
      "Registration successfull!\nRemember your new account id: " + id
    );
  };

  showMsg = msg => {
    this.modalText = msg;
    this.setState({ showModal: true });
  };

  authenticateUser = () => {
    if (this.userId.length === 0) {
      this.showMsg("User ID is missing!\nAdd ID!");
      return;
    }

    if (this.password.length === 0) {
      this.showMsg("Password is missing!\nAdd password!");
      return;
    }

    if (store.isCorrectPasswd(this.password, this.userId, this.allAccounts)) {
      this.setState({
        view: ID.VIEW_DEPOSIT,
        balance: store.getBalance(this.userId, this.allAccounts)
      });
      this.userName = store.getName(this.userId, this.allAccounts);
      return;
    }
    this.showMsg("Authentication failed!");
  };

  handleDeposit = (id, event) => {
    if (id === ID.INP_DEPOSIT) {
      this.setState({ deposit: event.target.value.trim() });
    } else if (id === ID.BTN_DEPOSIT) {
      if (this.state.deposit.length === 0) {
        this.showMsg("Deposit amount missing!\nAdd amount!");
        return;
      }

      if (!isValidSum(this.state.deposit)) {
        this.showMsg("Invalid deposit!\nCheck deposit!");
        return;
      }

      const newBalance = store.updateAccountAfterDeposit(
        this.userId,
        this.state.deposit,
        this.allAccounts
      );

      this.setState({ balance: newBalance, deposit: "" });

      this.showMsg("Deposit successfull!");
    }
  };

  handleWithdrawal = (id, event) => {
    if (id === ID.INP_WITHDRAW) {
      this.setState({ withdrawal: event.target.value.trim() });
    } else if (id === ID.BTN_WITHDRAW) {
      if (this.state.withdrawal.length === 0) {
        this.showMsg("Withdrawal amount missing!\nAdd amount!");
        return;
      }

      if (!isValidSum(this.state.withdrawal)) {
        this.showMsg("Invalid withdrawal amount!\nCheck amount!");
        return;
      }

      if (
        !store.isSmallerThanBalance(
          this.state.withdrawal,
          this.userId,
          this.allAccounts
        )
      ) {
        this.showMsg("Withdrawal amount exceeds your balance!\nCheck amount!");
        return;
      }

      const newBalance = store.updateAccountAfterWithdrawal(
        this.userId,
        this.state.withdrawal,
        this.allAccounts
      );
      this.setState({ balance: newBalance, withdrawal: "" });
      this.showMsg("Withdrawal successfull!");
    }
  };

  handleTransfer = (id, event) => {
    if (id === ID.INP_TRANSFER_ID) {
      this.setState({
        transferAccount: Number(event.target.value.trim())
      });
    } else if (id === ID.INP_TRANSFER_SUM) {
      this.setState({ transferAmount: event.target.value.trim() });
    } else if (id === ID.BTN_TRANSFER) {
      if (this.state.transferAmount.length === 0) {
        this.showMsg("Transfer amount missing!\nAdd amount!");
        return;
      }

      if (this.state.transferAccount.length === 0) {
        this.showMsg("Transfer account id missing!\nAdd account id!");
        return;
      }

      if (!isValidSum(this.state.transferAmount)) {
        this.showMsg("Invalid transfer amount!\nCheck amount!");
        return;
      }

      if (!store.isExistentId(this.state.transferAccount, this.allAccounts)) {
        this.showMsg(
          "Transfer destination account does not exist!\nCheck account id!"
        );
        return;
      }

      if (
        !store.isSmallerThanBalance(
          this.state.transferAmount,
          this.userId,
          this.allAccounts
        )
      ) {
        this.showMsg("Transfer amount exceeds your balance!\nCheck amount!");
        return;
      }

      if (this.state.transferAccount === this.userId) {
        this.showMsg(
          "You can't transfer to your own account.\nCheck account id!"
        );
        return;
      }

      store.updateAccountAfterDeposit(
        this.state.transferAccount,
        this.state.transferAmount,
        this.allAccounts
      );

      const newBalance = store.updateAccountAfterWithdrawal(
        this.userId,
        this.state.transferAmount,
        this.allAccounts
      );

      this.setState({
        balance: newBalance,
        transferAmount: "",
        transferAccount: ""
      });

      this.showMsg("Transfer successfull!");
    }
  };

  handleRequest = (id, event, reqId) => {
    if (id === ID.INP_REQUEST_AMOUNT) {
      this.setState({ requestAmount: event.target.value.trim() });
    } else if (id === ID.INP_REQUEST_ACCOUNT) {
      this.setState({ requestAccount: event.target.value.trim() });
    } else if (id === ID.BTN_REQUEST_SUBMIT) {
      if (this.state.requestAmount.length === 0) {
        this.showMsg("Request amount missing!\nAdd amount!");
        return;
      }

      if (this.state.requestAccount.length === 0) {
        this.showMsg("Request account id missing!\nAdd account id!");
        return;
      }

      if (!isValidSum(this.state.requestAmount)) {
        this.showMsg("Invalid request amount!\nCheck amount!");
        return;
      }

      if (!store.isExistentId(this.state.requestAccount, this.allAccounts)) {
        this.showMsg("Request account does not exist!\nCheck account id!");
        return;
      }

      if (this.state.requestAccount == this.userId) {
        this.showMsg(
          "You can't request from your own account.\nCheck account id!"
        );
        return;
      }

      store.addRequest(
        this.userId,
        this.state.requestAccount,
        this.state.requestAmount,
        this.allRequests
      );

      this.setState({ requestAccount: "", requestAmount: "" });
    } else if (id === ID.BTN_REQUEST_ACCEPT) {
      const request = store.getRequestByReqId(reqId, this.allRequests);

      if (
        !store.isSmallerThanBalance(
          request.amount,
          this.userId,
          this.allAccounts
        )
      ) {
        this.showMsg(
          "Request amount exceeds your balance!\nRequest can not be fulfilled!"
        );
        return;
      }

      store.updateAccountAfterDeposit(
        request.requesterId,
        request.amount,
        this.allAccounts
      );

      const newBalance = store.updateAccountAfterWithdrawal(
        this.userId,
        request.amount,
        this.allAccounts
      );

      this.setState({ balance: newBalance });

      store.removeRequest(reqId, this.allRequests);

      this.showMsg("Request fullfilled successfully!");
    }
  };

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="mainCont">
        <Heading />
        <div
          className="appCont"
          style={{
            flexDirection:
              this.state.view === ID.VIEW_AUTH ||
              this.state.view === ID.VIEW_REGIST
                ? "row"
                : "column"
          }}>
          <InitView
            view={this.state.view}
            callback={this.handleAuthAndRegInput}
          />

          <MenuBar
            view={this.state.view}
            balance={this.state.balance}
            callback={this.handleMenuInput}
          />

          <DepositForm
            view={this.state.view}
            value={this.state.deposit}
            name={this.userName}
            callback={this.handleDeposit}
          />

          <WithdrawalForm
            view={this.state.view}
            value={this.state.withdrawal}
            name={this.userName}
            callback={this.handleWithdrawal}
          />

          <TransferForm
            view={this.state.view}
            accountId={this.state.transferAccount}
            amount={this.state.transferAmount}
            name={this.userName}
            callback={this.handleTransfer}
          />

          <RequestForm
            amount={this.state.requestAmount}
            accountId={this.state.requestAccount}
            view={this.state.view}
            name={this.userName}
            callback={this.handleRequest}
            userId={this.userId}
            requests={this.allRequests}
          />
        </div>
        <Modal
          containerStyle={{
            background: "lightblue",
            height: "100px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "30px"
          }}
          closeOnOuterClick={true}
          show={this.state.showModal}
          onClose={this.closeModal.bind(this)}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              whiteSpace: "pre-line"
            }}>
            {this.modalText}
          </div>
          <button
            type="button"
            className="button"
            onClick={this.closeModal.bind(this)}>
            Close
          </button>
        </Modal>
      </div>
    );
  }
}

function isValidSum(sum) {
  sum = Number(sum);
  if (isNaN(sum) || sum <= 0) {
    return false;
  }
  return true;
}

export default App;
