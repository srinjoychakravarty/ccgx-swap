import React from 'react';
import TronLinkGuide from 'components/TronLinkGuide';
import TronWeb from 'tronweb';
import Utils from 'utils';
import Swal from 'sweetalert2';

import './App.scss';

const FOUNDATION_ADDRESS = 'TWiWt5SEDzaEqS6kE5gandWMNfxR2B5xzg';
const CONTRACT_ADDRESS = 'TEH69yFp8KbYhLu6AjZBCr9seYSgvivRRL';
const TRC20_TOKEN_CONTRACT_ADDRESS = 'TVjX5pL5LYWzvKtBNQtz2vF19EYR3qa5Vx';
const TOKEN_ID = 1000010;
class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            gettrxtrc10amount: 0,
            address: '',
            TRC10contractbalance:'',
            TRC20contractbalance:'',
            gettrxtrc20amount:0,
            TRXcontractbalance:'',

              tronWeb: {
                  installed: false,
                  loggedIn: false
              },
            }
        this.updateTRC10Value = this.updateTRC10Value.bind(this)
        this.updateTRC20Value = this.updateTRC20Value.bind(this)

    }

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
                    tronWeb: tronWebState,
                    contractAddress: CONTRACT_ADDRESS,
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

        await Utils.setTronWeb(window.tronWeb, CONTRACT_ADDRESS);

        this.setState({
            address : Utils.tronWeb.address.fromHex((String((await Utils.tronWeb.trx.getAccount()).address))),
            TRC10contractbalance : parseFloat(String(await Utils.contract.getTRC10TokenBalance(TOKEN_ID).call())),
            //TRC20contractbalance : parseFloat((await Utils.contract.getTRC20TokenBalance(TRC20_TOKEN_CONTRACT_ADDRESS).call()).toString())/1000000,
            TRXcontractbalance : parseFloat((String(await Utils.contract.getBalance().call()))/1000000),
        });

        //await Utils.setTronWeb(window.tronWeb);
        //console.log(Utils.tronWeb.address.fromHex((((await Utils.tronWeb.trx.getAccount()).address).toString())));  /////// Get account address and info
        console.log(Utils.contract);
    }

    /////////////////////////////////////// SwapTRXTRC10 /////////////////////////////////
    async SwapTRXTRC10(_amount){

        Utils.contract.SwapToTRC10(this.state.address, Utils.tronWeb.toSun(_amount/1000000), TOKEN_ID).send({
            shouldPollResponse: true,
            callValue: Utils.tronWeb.toSun(_amount)
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateTRC10Value (evt) {
        console.log('gettrxtrc10amount : ', this.state.gettrxtrc10amount);
            this.setState({
              gettrxtrc10amount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXTRC10 /////////////////////////////////





    /////////////////////////////////////// SwapTRXTRC20 /////////////////////////////////
    async SwapTRC10TRC20(_trc10amount){

        Utils.contract.SwapToTRC20(TRC20_TOKEN_CONTRACT_ADDRESS).send({
            //shouldPollResponse: true,
            //callValue: Utils.tronWeb.toSun(_amount),
            tokenId: TOKEN_ID,
            tokenValue: _trc10amount*10,
        }).then(res => Swal({
            title:'Transfer Successful',
            type: 'success'
        })).catch(err => Swal({
            title:'Transfer Failed',
            type: 'error'
        }));
    }

    updateTRC20Value (evt) {
        console.log('gettrxtrc20amount : ', this.state.gettrxtrc20amount);
            this.setState({
              gettrxtrc20amount: evt.target.value
            });
    }
    /////////////////////////////////////// SwapTRXTRC20 /////////////////////////////////





    render() {
        if(!this.state.tronWeb.installed)
            return <TronLinkGuide />;

        if(!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed />;

        return (
              <div className='row'>
                <div className='col-lg-12 text-center' >
                  <hr/>

                  <h2 style={{color : 'white' }}>CCGX OTC Desk Harvester</h2>
                  <br/>
                  <hr style={{color: 'white', backgroundColor: 'white', height: 0.5}}/>
                  <br/>






                  <br/>
                  <br/>
                  <h4>Obtain MicroHarvest Tokens 1:1 with TRON (TRX)</h4>
                  <p style={{color: 'yellow'}}><h5><i>25% of proceed allocates to the CharityCompassionCoin initiative</i></h5></p>
                  <p style={{color: 'green'}}> <i> Current MicroHarvest TRC10 (ID: 1000010) supply available for OTC Trade: {this.state.TRC10contractbalance} </i></p>
                  <br/>
                  <p>Enter amount of MicroHarvest token needed:</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxtrc10amount} onChange={this.updateTRC10Value}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRXTRC10(this.state.gettrxtrc10amount)
                                                                     }  }>Get CCC (TRC10)
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>







                  <br/>
                  <br/>
                  <br/>
                  <h4>  </h4>
                  <p> <i> CCGX TRC20 Daily Seeding Protocol: 42,000 CCGX Cap Seeded Daily For Harvesting {this.state.TRC20contractbalance} </i></p>
                  <br/>
                  <h4>Harvest 1 CCGX SmartCoin (TRC20) with 10 MicroHarvest (TRC10) Tokens</h4>
                  <br/>
                  <p>Enter amount of CCGX (TRC20) to harvest:</p>
                  <input style={{ width:"200px" }} value={this.state.gettrxtrc20amount} onChange={this.updateTRC20Value}/>
                  <br/>
                  <br/>
                  <button className='btn btn-danger' onClick={(event) => {
                                                                       event.preventDefault()
                                                                       this.SwapTRC10TRC20(this.state.gettrxtrc20amount)
                                                                     }  }>Harvest CCGX (TRC20)
                  </button>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>







                  <hr style={{color: 'red', backgroundColor: 'red', height: 0.5}}/>
                  <p style={{color: 'red'}}> <i> *For Official Use Only </i></p>

                  <p> <i> Current TRX Supply in Smart Contract : {this.state.TRXcontractbalance} </i></p>






                  <br/>
                  <br/>
                </div>
              </div>
        );
    }
}

export default App;
