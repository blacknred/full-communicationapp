import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

import NewMessageForm from '../components/NewMessageForm';

import { ME_QUERY } from '../graphql/team';
import { CREATE_DIRECT_MESSAGE_MUTATION } from '../graphql/message';

class NewDirectMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
    }

    onChangeHandler = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmitHandler = async () => {
        const { text } = this.state;
        const { mutate, teamId, receiverId } = this.props;
        if (!text || !text.trim()) return;
        try {
            await mutate({
                variables: {
                    teamId,
                    receiverId,
                    text,
                },
                optimisticResponse: {
                    createDirectMessage: true,
                },
                update: (store) => {
                    const data = store.readQuery({ query: ME_QUERY });
                    const allreadyThere = data.me.teams[teamId].directMessageMembers
                        .every(member => member.id !== parseInt(receiverId, 10));
                    if (allreadyThere) return;
                    data.me.teams[teamId].directMessageMembers.push({
                        __typename: 'User',
                        id: receiverId,
                        username: 'someone',
                    });
                    store.writeQuery({ query: ME_QUERY, data });
                },
            });
            this.setState({ text: '' });
        } catch (err) {
            // return;
        }
    }

    render() {
        const { text } = this.state;
        const { placeholder } = this.props;
        return (
            <NewMessageForm
                placeholder={placeholder}
                message={text}
                onChange={this.onChangeHandler}
                onSubmit={this.onSubmitHandler}
            />
        );
    }
}

NewDirectMessage.propTypes = {
    mutate: PropTypes.func.isRequired,
    teamId: PropTypes.number.isRequired,
    receiverId: PropTypes.number.isRequired,
    placeholder: PropTypes.string.isRequired,
};

export default graphql(CREATE_DIRECT_MESSAGE_MUTATION)(NewDirectMessage);
