import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './MessagesList'
import SendMessageForm from './SendMessageForm'
import TypingIndicator from './TypingIndicator'
import WhosOnlineList from './WhosOnlineList'

class ChatScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentUser: {},
      currentRoom: {},
      messages: [],
      usersWhoAreTyping: []
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.sendTypingEvent = this.sendTypingEvent.bind(this);
  }

  sendTypingEvent() {
        this.state.currentUser
          .isTypingIn({ roomId: this.state.currentRoom.id })
          .catch(error => console.error('error', error))
      }

  sendMessage(text) {
    this.state.currentUser.sendMessage({
      text,
      roomId: this.state.currentRoom.id,
    })
  }    

  componentDidMount () {
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: 'v1:us1:185bbfb0-5421-4bb8-892a-fb4304613ca6',
      userId: 'user',
      tokenProvider: new Chatkit.TokenProvider({
        url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/185bbfb0-5421-4bb8-892a-fb4304613ca6/token'
      })
    })

    chatManager
      .connect()
      .then(currentUser => {
        this.setState({ currentUser })
            return currentUser.subscribeToRoom({
                    roomId: "19386632",
                    messageLimit: 100,
                    hooks: {
                    onMessage: message => {
                        this.setState({
                        messages: [...this.state.messages, message],
                        })
                    },
                    onUserStartedTyping: user => {
                        this.setState({
                        usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                        })
                    },
                    onUserStoppedTyping: user => {
                        this.setState({
                        usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                            username => username !== user.name
                        ),
                        })
                    },
                    onPresenceChange: () => this.forceUpdate(),
                    onUserJoined: () => this.forceUpdate(),
                    },
            })
    })
        .then(currentRoom => {
            this.setState({ currentRoom })
            })
        .catch(error => console.error('error', error))
  }

  render() {
    const styles = {
      container: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
      chatContainer: {
        display: 'flex',
        flex: 1,
      },
      whosOnlineListContainer: {
        width: '300px',
        flex: 'none',
        padding: 20,
        backgroundColor: '#2c303b',
        color: 'white',
      },
      chatListContainer: {
        padding: 20,
        width: '85%',
        display: 'flex',
        flexDirection: 'column',
      },
   }

    return (
      <div style={styles.container}>
        <div style={styles.chatContainer}>
          <aside style={styles.whosOnlineListContainer}>
          <WhosOnlineList
              currentUser={this.state.currentUser}
              users={this.state.currentRoom.users}
            />
          </aside>
          <section style={styles.chatListContainer}>
          <MessageList
              messages={this.state.messages}
              style={styles.chatList}
            />
            <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
            <SendMessageForm onSubmit={this.sendMessage} onChange={this.sendTypingEvent}/>
          </section>
        </div>
      </div>
    )
  }
}

export default ChatScreen
