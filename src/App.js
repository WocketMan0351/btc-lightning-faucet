import { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { TextInput } from './components/text-input.components';

class App extends Component {
  constructor() {
    super();

    this.state = {
      sats: '',
      createInvoiceHeader: '',
      lnInvoice: '',
      lnUrlHeader: '',
      amount: '',
    };
  }

  componentDidMount() {
    this.getBalances();
  }

  getBalances() {
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: process.env.REACT_APP_READ_ONLY_KEY,
      },
    };
    fetch('https://api.opennode.com/v1/account/balance', options)
      .then((response) => response.json())
      .then((d) => this.setState({ sats: d.data.balance.BTC }))
      .catch((err) => console.error(err));
  }

  createInvoice() {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_INVOICES_KEY,
      },
      body: JSON.stringify({
        order_id: "Merchant's internal order ID",
        ttl: 1440,
        description: 'Test Invoice',
        amount: this.state.amount,
        customer_email: 'cworthen777@hotmail.com',
        currency: 'BTC',
        min_amt: this.state.amount,
        max_amt: this.state.amount,
        callback_url: 'https://example.com/webhook/opennode',
      }),
    };

    fetch('https://api.opennode.com/v1/charges', options)
      .then((response) => response.json())
      .then((response) => {
        if (this.state.amount > 0) {
          return (
            this.setState({
              lnInvoice: response.data.lightning_invoice.payreq,
            }),
            this.setState({
              createInvoiceHeader: `Thanks for donating ${this.state.amount} sat(s)`,
            })
          );
        }
      })
      .catch((err) => console.error(err));
  }

  lnUrlWithdrawal() {
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_WITHDRAW_KEY,
      },
      body: JSON.stringify({
        order_id: "Merchant's internal order ID",
        ttl: 1440,
        description: 'Test Invoice',
        customer_email: 'cworthen777@hotmail.com',
        currency: 'BTC',
        min_amt: 10,
        max_amt: 10,
        callback_url: 'https://example.com/webhook/opennode',
      }),
    };

    fetch('https://api.opennode.com/v2/lnurl-withdrawal', options)
      .then((response) => response.json())
      .then((response) => window.open(`${response.data.uri}`, '_self'))
      .catch((err) => console.error(err));

    this.setState({ lnUrlHeader: 'Claim' });
  }

  render() {
    const { sats, createInvoiceHeader, lnInvoice } = this.state;

    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />

          <div style={{ alignItems: 'center', margin: 20 }}>
            <h3>{'LN Faucet contains ' + sats + ' sats'}</h3>
            <div>
              <button onClick={() => this.getBalances()}>
                Refresh Balance
              </button>
            </div>

            <div>
              <TextInput
                placeHolder='Amount (sats)'
                handleChange={(event) =>
                  this.setState({ amount: event.target.value })
                }
              />
            </div>

            <div>
              <button onClick={() => this.createInvoice()}>
                Donate sats to faucet
              </button>
            </div>

            <div>
              <button onClick={() => this.lnUrlWithdrawal()}>
                Claim 10 sats!
              </button>
            </div>

            <div
              style={{
                wordWrap: 'break-word',
                marginTop: 25,
                marginLeft: 25,
                marginRight: 25,
                color: 'white',
              }}
            >
              {createInvoiceHeader}
            </div>

            <div
              style={{
                wordWrap: 'break-word',
                marginTop: 25,
                marginLeft: 25,
                marginRight: 25,
                color: 'white',
              }}
            >
              {lnInvoice}
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
