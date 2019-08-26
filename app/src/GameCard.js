import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { ButtonBase, Grid } from '@material-ui/core';

const styles = theme => (
    {
        root: {
            flexGrow: 1
        },
        paper: {
            margin: theme.spacing(4),
            textAlign: 'center',
            color: theme.palette.text.secondary,
            height: 150,
            display: 'flex',
            justifyContent: 'center'
        },
        image: {
            width: 'auto',
            height: 'auto'
        },
        img: {
            maxWidth: '100%',
            maxHeight: '100%',
        }
    }
);

class GameCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            card: props.card
        }

    }
    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.paper}>
                <ButtonBase onClick={() => this.props.onCardClicked(this.props.card.index)}>
                    <img src={this.state.card.image.url} className={classes.img} />
                </ButtonBase>
            </Paper>
        );
    }
}

export default withStyles(styles)(GameCard);