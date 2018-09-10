import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { extendObservable } from 'mobx';
import { graphql } from 'react-apollo';

import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import People from '@material-ui/icons/People';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    layout: {
        width: 'auto',
        display: 'block', // Fix IE11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(380 + theme.spacing.unit * 3 * 2)]: {
            width: 380,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing.unit * 4,
    },
    avatar: {
        marginBottom: theme.spacing.unit * 3,
    },
    form: {
        marginTop: theme.spacing.unit * 2,
        width: '100%', // Fix IE11 issue.
        '& > div': {
            marginBottom: theme.spacing.unit * 3,
        },
    },
    submit: {
        margin: `${theme.spacing.unit * 3}px 0`,
    },
});

const CREATE_TEAM_MUTATION = gql`
    mutation CreateTeam($name: String!) {
        createTeam(name: $name) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

class CreateTeam extends React.Component {
    constructor(props) {
        super(props);

        extendObservable(this, {
            name: '',
            errors: {},
        });
    }

    onChangeHandler = (e) => {
        const { name, value } = e.target;
        this[name] = value;
    }

    onSubmitHandler = async (e) => {
        e.preventDefault();
        const { mutate, history } = this.props;
        const { name } = this;
        const res = await mutate({
            variables: { name },
        });
        console.log(res);
        const { ok, errors } = res.data.createTeam;
        if (ok) {
            history.push('/');
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            });
            this.errors = err;
            this.setState({});
        }
    }

    render() {
        const { name, errors: { nameError } } = this;
        const { classes } = this.props;
        return (
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <People />
                    </Avatar>
                    <Typography variant="headline">Create a Team</Typography>
                    <form className={classes.form}>
                        <TextField
                            autoFocus
                            required
                            fullWidth
                            id="name"
                            name="name"
                            label="Team name"
                            autoComplete="name"
                            defaultValue={name}
                            error={!!nameError}
                            helperText={nameError}
                            onChange={this.onChangeHandler}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="raised"
                            color="primary"
                            className={classes.submit}
                            onClick={this.onSubmitHandler}
                            children="Create Team"
                        />
                    </form>
                </Paper>
            </main>
        );
    }
}

CreateTeam.propTypes = {
    classes: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default graphql(CREATE_TEAM_MUTATION)(observer(withStyles(styles)(CreateTeam)));
