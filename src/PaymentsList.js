import React, { Component } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import {RingLoader} from 'react-spinners';
import _ from 'lodash';

class PaymentsList extends Component {

    constructor() {
        super();
        this.state = {
            spinningSpinner: false
        };
        this.updateTextArea = this.updateTextArea.bind(this);
        this.makeRESTapiCall = this.makeRESTapiCall.bind(this);

    }

    updateTextArea() {
        this.setState({
            spinningSpinner: !this.state.spinningSpinner,
            paymentsString: this.state.paymentsString + "Empty payments list \n"
        });
    }

    makeRESTapiCall() {
        fetch('http://localhost:3001/api/payments/all')
            .then(results => {
                return results.json();
            }).then(data => {
                console.log('Results JSON:' + JSON.stringify(data));

                //separate Ampere payments and ATB payments after API call
                //ATB payments are ones that have been Approved

                let payments = data
                .map((payment) => {
                    return (payment.PaymentType + 
                            ' $' + payment.Amount + 
                            '  ' + payment.Status +
                            '  ' + payment.DueDate +
                            '  ' + payment.ReceiverAccountNumber +
                            '  ' + payment.ReceiverRTN + 
                            '  ' + payment.ReceiverName +
                            '  ' + payment.OriginatorAccountNumber + 
                            '  ' + payment.OriginatorRTN +
                            '\n')
                })
                .reduce((prev, curr) => [prev + '\n' + curr])

                let pendingPayments = data.filter(function(payment) {
                    if(payment.Status == 'Pending') return payment;
                });

                let approvedPayments = data.filter(function(payment){
                    if(payment.Status != 'Pending') return payment;
                });

                this.setState({
                    paymentsString: payments, 
                    paymentsList: data,
                    rewattPayments: pendingPayments,
                    atbPayments: approvedPayments
                });
            })
    }

    handleApprovePayment(paymentId) {
       
        _.set(_.find(this.state.paymentsList, {AmperePaymentId: paymentId}),  'Status', 'Approved');

        let pendingPayments = this.state.paymentsList.filter(function(payment) {
            if(payment.Status == 'Pending') return payment;
        });

        let approvedPayments = this.state.paymentsList.filter(function(payment){
            if(payment.Status != 'Pending') return payment;
        });
        
        this.setState({
            paymentsList: this.state.paymentsList,
            rewattPayments: pendingPayments,
            atbPayments: approvedPayments
        });
       
    }

    render() {
        
        const paymentsListCols = [{
                Header: 'Type', 
                accessor: 'PaymentType'},
            {
                Header: '$ Amount', 
                accessor: 'Amount'
            },
            {
                Header: 'Status', 
                accessor: 'Status'
            },
            {
                Header: 'Due Date', 
                accessor: 'DueDate'
            },
            {
                Header: 'To', 
                accessor: 'ReceiverName'
            },
            {
                Header: 'To Acct. No', 
                accessor: 'ReceiverAccountNumber'
            },
            {
                Header: 'To RTN', 
                accessor: 'ReceiverRTN'
            },
            {
                Header: 'Action', 
                accessor: 'action',
                Cell: row => (
                    row.original.Status === 'Pending' ? 
                        <button onClick={this.handleApprovePayment.bind(this, row.original.AmperePaymentId)}>Approve Payment</button>
                    :
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "#dadada",
                        borderRadius: "2px"
                      }}
                    />)
            },
        ];

        return (
            <div>
                <textarea value={this.state.paymentsString} style={{width:800, height: 150}} />
                <br/>
                <button onClick={this.updateTextArea}>Do Something</button>
                <br/>
                <button onClick={this.makeRESTapiCall}>Call API</button>
                <br/>
                <RingLoader loading={this.state.spinningSpinner} /> 
                <br/>
                <h3>Ampere Blockchain Payments Queue</h3>
                <ReactTable
                    data={this.state.rewattPayments}
                    columns={paymentsListCols}
                    minRows={1}
                    showPagination={false}
                    className="-striped -highlight"
                />
                <br/>
                
                <h3>ATB Payments</h3>
                <ReactTable
                    data={this.state.atbPayments}
                    columns={paymentsListCols}
                    minRows={1}
                    showPagination={false}
                    className="-striped -highlight"
                />
            </div>
        );
        
    }
}

export default PaymentsList;