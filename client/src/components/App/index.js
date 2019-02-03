import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';
import Header from './Header';
import Player from './Player';
import ChatScreen from './ChatScreen';


const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';



class App extends React.Component {

    state = {
        candidates: [],
        loading: false,
    
        tronWeb: {
          installed: false,
          loggedIn: false
      }
      };
    
      
    
      async componentDidMount() {
    
        this.setState({loading:true})
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };
    
            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });
    
                return resolve();
            }
    
            let tries = 0;
    
            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';
    
                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );
    
                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });
    
                    clearInterval(timer);
                    return resolve();
                }
    
                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;
    
                if(!tronWebState.installed)
                    return tries++;
    
                this.setState({
                    tronWeb: tronWebState
                });
    
                resolve();
            }, 100);
        });
    
        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };
    
            window.tronWeb.on('addressChanged', () => {
                if(this.state.tronWeb.loggedIn)
                    return;
    
                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }
        await Utils.setTronWeb(window.tronWeb);
        this.fetchData();
        this.startEventListener();
        this.setState({loading:false})
    
    }
    
    startEventListener(){
      Utils.contract.eventVote().watch((err) => {
    
          if(err){
          return console.log('Failed to bind the event', err);
          }
    
          window.history.go(0);
      });
    
    }
    
    async fetchData(){
      const CandidateCount = (await Utils.contract.candidatecount().call()).toNumber();
      console.log('CandidateCount', CandidateCount);
    
      for(var i=1; i<=CandidateCount; i++){
    
          const candidate_tmp = await Utils.contract.candidates(i).call();
          console.log('candidate_tmp', candidate_tmp);
    
          const candidates = [...this.state.candidates];
    
          candidates.push({
                          id: candidate_tmp.id.toNumber(),
                          name: candidate_tmp.name,
                          score: candidate_tmp.score.toNumber()
          });
    
          this.setState({candidates:candidates})
    
    
    
      }
    
    }
    
      handleScoreChange = (index, delta) => {
        // this.setState( prevState => ({
        //   score: prevState.players[index].score += delta
        // }));
    
        if(delta === 1)
        {
          Utils.contract.scoreUp(index).send({
            shouldPollResponse: true,
            callValue: 0
          }).then(res => Swal({
              title:'Score increased',
              type: 'success'
          })).catch(err => Swal({
              title:'Score change failed',
              type: 'error'
      
          }));
        }
        else
        {
          Utils.contract.scoreDown(index).send({
            shouldPollResponse: true,
            callValue: 0
          }).then(res => Swal({
              title:'Score decreased',
              type: 'success'
          })).catch(err => Swal({
              title:'Score change failed',
              type: 'error'
      
          }));
          }
        }
    
        
    
      handleRemovePlayer = (id) => {
        // this.setState( prevState => {
        //   return {
        //     players: prevState.players.filter(p => p.id !== id)
        //   };
        // });
    
        Utils.contract.removeCandidate(id).send({
          shouldPollResponse: true,
          callValue: 0
        }).then(res => Swal({
            title:'Score decreased',
            type: 'success'
        })).catch(err => Swal({
            title:'Score change failed',
            type: 'error'
        }));
        
    
      }
    
      render() {

        return <ChatScreen />

        if(!this.state.tronWeb.installed)
        return <TronLinkGuide />;
    
        if(!this.state.tronWeb.loggedIn)
        return <TronLinkGuide installed />;
    
        return (
          <div className="scoreboard">
            <Header 
              title="Scoreboard" 
              totalPlayers={this.state.candidates.length} 
            />
      
            {/* Players list */}
            {this.state.candidates.map( (player, index) =>
              <Player 
                name={player.name}
                score={player.score}
                id={player.id}
                key={player.id.toString()} 
                index={index}
                changeScore={this.handleScoreChange}
                removePlayer={this.handleRemovePlayer}           
              />
            )}
          </div>
        );
      }
}

export default App;

