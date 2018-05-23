import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PaymentsList from '../PaymentsList';
import { setPayments } from '../ducks';

function mapStateToProps({ ledger }) {
  return {
    ...ledger,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setPayments, dispatch,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsList);