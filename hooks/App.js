import React, { Component, useState, useContext } from "react";
import "./App.css";

const languages = {
  suomi: {
    title: "Opiskelijan tiedot",
    name: "Nimi",
    nationality: "Kansallisuus",
    address: "Osoite",
    field: "Pääaine",
    save: "Tallenna",
    switch: "Vaihda kieltä"
  },
  english: {
    title: "Student information",
    name: "Name",
    nationality: "Nationality",
    address: "Address",
    field: "Field of study",
    save: "Save",
    switch: "Switch language"
  }
};

const LangContext = React.createContext(null);

const App = props => {

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [field, setField] = useState("");

  const lang = useContext(LangContext);

  return (
    <div className="main">
      <h1> {lang.title} </h1>
      <div className="form">
        <div className="formField">
          <div>{lang.name}:</div>
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
          />
        </div>
        <div className="formField">
          <div>{lang.nationality}:</div>
          <input
            type="text"
            value={nationality}
            onChange={ev => setNationality(ev.target.value)}
          />
        </div>
        <div className="formField">
          <div>{lang.address}:</div>
          <input
            type="text"
            value={address}
            onChange={ev => setAddress(ev.target.value)}
          />
        </div>
        <div className="formField">
          <div>{lang.field}:</div>
          <input
            type="text"
            value={field}
            onChange={ev => setField(ev.target.value)}
          />
        </div>
        <button type="button">{lang.save}</button>
        <div className="summary">
          <div className="summaryLine">
            <b>{lang.name}:</b> {name}
          </div>
          <div className="summaryLine">
            <b>{lang.nationality}:</b> {nationality}
          </div>
          <div className="summaryLine">
            <b>{lang.address}:</b> {address}
          </div>
          <div className="summaryLine">
            <b>{lang.field}:</b> {field}
          </div>
        </div>
        <button type="button" className="switchBtn" onClick={props.callback}>
          {lang.switch}
        </button>
      </div>
    </div>
  );
};

const MainApp = () => {
  
  const [language, setLanguage] = useState("suomi");

  function switchLang() {
    const newLang = language === "suomi" ? "english" : "suomi";
    setLanguage(newLang);
  }

  return (
    <LangContext.Provider
      value={language === "suomi" ? languages.suomi : languages.english}>
      <App callback={switchLang} />
    </LangContext.Provider>
  );
};

export default MainApp;
