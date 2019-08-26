import React from 'react';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import GameCard from './GameCard';
const styles = theme => ({
    root: {
        flexGrow: 1,
    },
});

class Game extends React.Component {

  
    constructor(props) {
        super(props);

        this.state = {
            gameCards: [],
            firstCardIndex: -1,
            secondCardIndex: -1
        }
    }
    evaluateResult() {
        if (this.state.firstCardIndex >= 0 && this.state.secondCardIndex >= 0) {
            const card1 = this.state.gameCards[this.state.firstCardIndex];
            const card2= this.state.gameCards[this.state.secondCardIndex];

            let cards = [...this.state.gameCards];
            let foundCards = cards.filter(card => (card.index === card1.index || card.index === card2.index));

            if (card1.index === card2.pair) {
                foundCards.forEach(foundCard => {
                    foundCard.found = true;
                });
                this.setState({gameCards: cards});
            } else {
                foundCards.forEach(foundCard => {
                    foundCard.found = false;
                    foundCard.open = false;
                })
            }
        }
    }

    onCardClicked = cardIndex => {
        console.log('card clicked ', cardIndex);
        let cards = [...this.state.gameCards];
        if (this.state.firstCardIndex < 0) {
            this.setState({firstCardIndex : cardIndex});
            cards[cardIndex].open = true;
            this.setState({gamecards: cards});
        } else if (this.state.firstCardIndex >=0 && this.state.secondCardIndex < 0) {
            this.setState({secondCardIndex : cardIndex});
            cards[cardIndex].open = true;
            this.setState({gamecards: cards});
            setTimeout(this.evaluateResult.bind(this), 1000);
        }
    }

    async downloadImages() {
        try {
            const key = '13410216-0f60fa24a53834ad987c8369e';
            const imageType = 'vector';
            const perPage = 18;
            const pixabayUrl = `https://pixabay.com/api/?key=${key}&image_type=${imageType}&orientation=horizontal&safesearch=true&per_page=${perPage}&q=flower`;
            const results = await axios.get(pixabayUrl);
            let images = []
            if (results && results.data.hits) {
                images = results.data.hits.map((hit, index) => {
                    let image = {};
                    image.id = hit.id;
                    image.url = hit.webformatURL;
                    return image;
                });
            }
            console.log(images);
            return images;
        } catch (error) {
            console.log('Error in downloading images ', error);
            return null;
        }
    }
    getRandomInt(start, max, indices) {
        if (indices.length <= 2) {
            return indices[0];
        }
        const randomInt = Math.floor(Math.random() * Math.floor(max - start)) + start;
        const uniqueInt = indices.find(index => (index == randomInt));
        if (!uniqueInt) {
            return this.getRandomInt(start, max, indices);
        } else {
            return uniqueInt;
        }
    }

    async componentDidMount() {
        try {
            const images = await this.downloadImages();
            const totalCards = images.length * 2;
            let indices = [];
            let gameCards = [];
            let generation = 0;
            for (let i = 18; i < totalCards; i++) {
                indices.push(i);
            }
            while (indices.length > 0) {
                const pair1 = generation;//this.getRandomInt(totalCards, indices);
                //indices = indices.filter(index => (index !== generation));
                const pair2 = this.getRandomInt(totalCards / 2, totalCards, indices);
                indices = indices.filter(index => (index !== pair2));
                console.log('removing ', pair1, pair2);
                let card1 = {
                    index: pair1,
                    pair: pair2,
                    open: false,
                    found: false,
                    image: images[generation]
                }
                let card2 = {
                    index: pair2,
                    pair: pair1,
                    open: false,
                    found: false,
                    image: images[generation]
                }
                gameCards.push(card1, card2);
                generation += 1;
            }
            gameCards.sort((c1, c2) => (c1.index - c2.index));
            this.setState({
                gameCards: gameCards,
            });
            console.log(this.state.gameCards);
        } catch (error) {
            console.log('Error in setting up game ', error);
        }
    }

    render() {
        const { classes } = this.props;
        let gameItems = [];
        for (let i = 0; i < this.state.gameCards.length; i++) {
            gameItems.push(<Grid item xs={2}>
                <GameCard card={this.state.gameCards.find(card => (card.index === i))} onCardClicked={this.onCardClicked}></GameCard>
            </Grid>
            );
        }
        return (
            <Grid container className={classes.root}>
                {gameItems}
            </Grid>
        );
    }
}

export default withStyles(styles)(Game);