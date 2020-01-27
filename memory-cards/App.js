// Cards game by Jussi Utunen

import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: []
    };
    this.exposedCards = [];
  }

  render() {

    const headingContainerStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '500px', margin: 'auto', marginBottom: '20px' };
    const cardsContainerStyle = { display: 'flex', flexWrap: 'wrap', width: '420px', margin: 'auto' };

    return (
      <div>
        <div style={headingContainerStyle}>
          <h1>Cards!</h1>
          <button onClick={ this.newGame }>New game</button>
        </div>
        <div style={cardsContainerStyle}>
          {this.state.cards.map(x => this.renderCard(x))}
        </div>
      </div>
    );

  }

  newGame = () => {

    let initDeck = [];
    const pairCount = 9;
    this.firstCardId = 0;

    for(let i = 0; i < pairCount; i++) {
      initDeck = initDeck.concat(this.generatePair(i));
    }
    shuffleArray(initDeck);
    this.setState({cards: initDeck});

  }

  generatePair = (value) => {

    value++;
    return [{id:this.firstCardId++, value:value, exposed:false, matched:false},
            {id:this.firstCardId++, value:value, exposed:false, matched:false}];

  }

  hideExposedCards = () => {

    let newCardsState = this.state.cards.map(x => {
       if( x.exposed === true ) {
         const newCard = {id:x.id, value:x.value, matched:x.matched, exposed:false};
         return newCard;
       }
       return x;
     });

    this.exposedCards = [];
    this.setState({cards: newCardsState});

  }

  cardClickHandler = (id) => {

    if(this.exposedCards.length === 2) {
      return;
    }

    if( this.state.cards.find(x => x.id === id).matched === true ) {
      return;
    }

    let newCardsState = this.state.cards.map(x => {
       if( x.id === id ) {
         const newCard = {id:id, value:x.value, matched:x.matched, exposed:true};
         this.exposedCards.push(newCard);
         return newCard;
       }
       return x;
     });

    if(this.exposedCards.length === 2) {
      if(this.exposedCards[0].value === this.exposedCards[1].value) {
        //console.log("Values matched!");
        this.exposedCards.forEach( x => {
          newCardsState = newCardsState.map( y => {
            if( y.id === x.id ) {
              y.matched = true;
              y.exposed = false;
            }
            return y;
          });
        })
        this.exposedCards = [];
      } else { // exposed card values do not match
        setTimeout(this.hideExposedCards, 2000);
      }
    }

    this.setState({cards: newCardsState});

    if( newCardsState.every(x => x.matched === true) ) {
      alert("Game completed succesfully!");
    }
  }

  renderCard = (card) => {

    const cardStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', height: '80px', backgroundColor: 'lightgray', margin: '5px', fontSize: '50px' };

    return (
      <div key={card.id} style={cardStyle} onClick={ () => this.cardClickHandler(card.id) }> {card.exposed === true || card.matched === true ? card.value : ''} </div>
    )

  }
}

// Source of function shuffleArray:
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default App;
