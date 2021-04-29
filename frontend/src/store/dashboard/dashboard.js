import React from "react";
import {
	Card,
	CardBody,

} from 'reactstrap';
import {connect} from "react-redux";

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAuthenticated: props.isAuthenticated
		}
	}

	render() {
		return (
			<Card>
				<CardBody>
					Start your project from here...
				</CardBody>
			</Card>
		);
	}
}

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, null)(Dashboard);