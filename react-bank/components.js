import React from "react";
import "./App.css";
import * as ID from "./ids.js";
import * as store from "./store.js";

function RequestList(props) {
  let requests = store.getRequestsByUserId(props.id, props.requests);

  if (requests.length === 0) {
    return null;
  }

  return (
    <div>
      {requests.map(req => {
        return (
          <Request
            key={req.id}
            reqId={req.id}
            userId={props.id}
            name={props.name}
            amount={req.amount}
            granter={req.granterId}
            requester={req.requesterId}
            callback={props.callback}
          />
        );
      })}
    </div>
  );
}

function Request(props) {
  if (props.userId === props.requester) {
    return (
      <div className="requestDetailsCont">
        <div className="requestDetail">{props.name}</div>
        <LeftArrow />
        <div className="requestDetail">{props.amount} €</div>
        <LeftArrow />
        <div className="requestDetail">from ID: {props.granter}</div>
        <div className="requestDetail floatright">Request pending</div>
      </div>
    );
  } else {
    return (
      <div className="requestDetailsCont">
        <div className="requestDetail">{props.name}</div>
        <RightArrow />
        <div className="requestDetail">{props.amount} €</div>
        <RightArrow />
        <div className="requestDetail">to ID: {props.requester}</div>
        <button
          type="button"
          className="button floatright"
          onClick={ev =>
            props.callback(ID.BTN_REQUEST_ACCEPT, ev, props.reqId)
          }>
          Accept
        </button>
      </div>
    );
  }
}

function RightArrow() {
  return (
    <svg height="20" width="40">
      <path d="M0 6 L20 6 L20 0 L40 10 L20 20 L20 14 L0 14 Z" fill="gray" />
    </svg>
  );
}

function LeftArrow() {
  return (
    <svg height="20" width="40">
      <path d="M0 10 L20 0 L20 6 L40 6 L40 14 L20 14 L20 20 Z" fill="gray" />
    </svg>
  );
}

export function MenuBar(props) {
  if (props.view === ID.VIEW_AUTH || props.view === ID.VIEW_REGIST) {
    return null;
  }

  return (
    <div className="menuCont">
      <button
        type="button"
        onClick={ev => props.callback(ID.BTN_MENU_DEPOSIT, ev)}
        className={
          props.view === ID.VIEW_DEPOSIT ? "selectedButton" : "button"
        }>
        Deposit
      </button>
      <button
        type="button"
        onClick={ev => props.callback(ID.BTN_MENU_WITHDRAW, ev)}
        className={
          props.view === ID.VIEW_WITHDRAW ? "selectedButton" : "button"
        }>
        Withdraw
      </button>
      <button
        type="button"
        onClick={ev => props.callback(ID.BTN_MENU_TRANSFER, ev)}
        className={
          props.view === ID.VIEW_TRANSFER ? "selectedButton" : "button"
        }>
        Transfer
      </button>
      <button
        type="button"
        onClick={ev => props.callback(ID.BTN_MENU_REQUESTS, ev)}
        className={
          props.view === ID.VIEW_REQUESTS ? "selectedButton" : "button"
        }>
        Fund requests
      </button>
      <div className="balance">
        Balance: {props.balance}
      </div>
      <button
        type="button"
        className="button"
        onClick={ev => props.callback(ID.BTN_MENU_EXIT, ev)}>
        Exit
      </button>
    </div>
  );
}

export function RequestForm(props) {
  if (props.view !== ID.VIEW_REQUESTS) {
    return null;
  }

  return (
    <div className="depositCont">
      <div className="requestSubCont">
        <div className="requestSubSubCont">
          Hello {props.name}, let's request for some funds!
        </div>
        <div className="requestSubSubCont">
          <input
            value={props.amount}
            onChange={ev => props.callback(ID.INP_REQUEST_AMOUNT, ev)}
            type="text"
            placeholder="Amount"
          />
          <input
            value={props.accountId}
            onChange={ev => props.callback(ID.INP_REQUEST_ACCOUNT, ev)}
            className="rightMargin20px width100px leftMargin10px"
            type="text"
            placeholder="Account id"
          />
          <button
            type="button"
            className="button"
            onClick={ev => props.callback(ID.BTN_REQUEST_SUBMIT, ev)}>
            Submit
          </button>
        </div>
        <div className="pendingRequestsCont">
          <div className="requestDetailsCont">
            Here's your all pending requests!
          </div>
          <RequestList
            id={props.userId}
            requests={props.requests}
            name={props.name}
            callback={props.callback}
          />
        </div>
      </div>
    </div>
  );
}

export function TransferForm(props) {
  if (props.view !== ID.VIEW_TRANSFER) {
    return null;
  }

  return (
    <div className="depositCont">
      <div className="transferSubCont">
        <div className="depositSubSubCont">
          Hello {props.name}, let's transfer some money from your account.
        </div>
        <div className="depositSubSubCont">
          Transfer destination account id:
          <input
            className="rightMargin20px width100px leftMargin10px"
            value={props.accountId}
            onChange={ev => props.callback(ID.INP_TRANSFER_ID, ev)}
            type="text"
            placeholder="Account ID"
          />
        </div>
        <div className="depositSubSubCont">
          Amount to be transfered:
          <input
            className="rightMargin20px width100px leftMargin10px"
            value={props.amount}
            onChange={ev => props.callback(ID.INP_TRANSFER_SUM, ev)}
            type="text"
            placeholder="Amount"
          />
          <button
            type="button"
            className="button"
            onClick={ev => props.callback(ID.BTN_TRANSFER, ev)}>
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

export function DepositForm(props) {
  if (props.view !== ID.VIEW_DEPOSIT) {
    return null;
  }

  return (
    <div className="depositCont">
      <div className="depositSubCont">
        <div className="depositSubSubCont">
          Hello {props.name}, let's deposit some money into your account.
        </div>
        <div className="depositSubSubCont">
          <input
            className="rightMargin20px"
            value={props.value}
            onChange={ev => props.callback(ID.INP_DEPOSIT, ev)}
            type="text"
            placeholder="Amount"
          />
          <button
            type="button"
            className="button"
            onClick={ev => props.callback(ID.BTN_DEPOSIT, ev)}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export function WithdrawalForm(props) {
  if (props.view !== ID.VIEW_WITHDRAW) {
    return null;
  }

  return (
    <div className="depositCont">
      <div className="depositSubCont">
        <div className="depositSubSubCont">
          Hello {props.name}, let's withdraw some money from your account.
        </div>
        <div className="depositSubSubCont">
          <input
            className="rightMargin20px"
            value={props.value}
            onChange={ev => props.callback(ID.INP_WITHDRAW, ev)}
            type="text"
            placeholder="Amount"
          />
          <button
            type="button"
            className="button"
            onClick={ev => props.callback(ID.BTN_WITHDRAW, ev)}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export function Heading(props) {
  return <div className="heading">Buutti Banking</div>;
}

export function AuthForm(props) {
  if (props.view !== ID.VIEW_AUTH) {
    return null;
  }

  return (
    <>
      <div className="authFormCont">
        <div>Authentication</div>
        <input
          type="text"
          className="width160px"
          placeholder="User ID"
          onChange={ev => props.callback(ID.INP_AUTH_UID, ev)}
        />
        <input
          type="password"
          className="width160px"
          placeholder="Password"
          onChange={ev => props.callback(ID.INP_AUTH_PASSWD, ev)}
        />
      </div>
      <div className="buttonsCont">
        <button
          type="button"
          className="button"
          onClick={ev => props.callback(ID.BTN_AUTH_REG, ev)}>
          Register
        </button>
        <button
          type="button"
          className="button"
          onClick={ev => props.callback(ID.BTN_AUTH_ENTER, ev)}>
          Enter
        </button>
      </div>
    </>
  );
}

export function RegForm(props) {
  if (props.view !== ID.VIEW_REGIST) {
    return null;
  }

  return (
    <>
      <div className="authFormCont">
        <div>Registration</div>
        <input
          type="text"
          className="width160px"
          placeholder="Full name"
          onChange={ev => props.callback(ID.INP_REG_NAME, ev)}
        />
        <input
          type="password"
          className="width160px"
          placeholder="Password"
          onChange={ev => props.callback(ID.INP_REG_PASSWD, ev)}
        />
        <input
          type="text"
          className="width160px"
          placeholder="Initial cash deposit"
          onChange={ev => props.callback(ID.INP_REG_DEPOSIT, ev)}
        />
      </div>
      <div className="buttonsCont">
        <button
          type="button"
          className="button"
          onClick={ev => props.callback(ID.BTN_REG_REG, ev)}>
          Register
        </button>
        <button
          type="button"
          className="button"
          onClick={ev => props.callback(ID.BTN_REG_BACK, ev)}>
          Back
        </button>
      </div>
    </>
  );
}

export function InitView(props) {
  if (props.view !== ID.VIEW_AUTH && props.view !== ID.VIEW_REGIST) {
    return null;
  }

  return (
    <>
      <div className="loremCont">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere
        interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis
        facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus
        auctor vitae, consectetuer et venenatis eget velit.
      </div>
      <div className="authCont">
        <AuthForm view={props.view} callback={props.callback} />
        <RegForm view={props.view} callback={props.callback} />
      </div>
    </>
  );
}
