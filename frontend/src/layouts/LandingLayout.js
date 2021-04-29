import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './landing-layout/header/header';
import Footer from './landing-layout/footer/footer';
import landingRoutes from "../routes/landingroutes";
import FrontPage from '../landing/FrontPage';
import NoMatch from "../landing/NoMatch";
import LoadingComponent from "./loader/Loader";


class LandingLayout extends React.Component {
	constructor(props) {
		super(props);
		this.updateDimensions = this.updateDimensions.bind(this);
		this.state = {
			isOpen: false,
			width: window.innerWidth,
			isLoading: this.props.isLoading,
		};

		this.props.history.listen((location, action) => {
			if (window.innerWidth < 767 &&
				document.getElementById('main-wrapper').className.indexOf("show-sidebar") !== -1) {
				document.getElementById('main-wrapper').classList.toggle("show-sidebar");
			}
		});
	}
	/*--------------------------------------------------------------------------------*/
	/*Life Cycle Hook, Applies when loading or resizing App                           */
	/*--------------------------------------------------------------------------------*/
	componentDidMount() {
		window.addEventListener("load", this.updateDimensions);
		window.addEventListener("resize", this.updateDimensions);
	}

	componentWillReceiveProps(newProps) {
      if (newProps.isLoading!==this.props.isLoading){
        this.setState({isLoading: newProps.isLoading});
      }
   }

	/*--------------------------------------------------------------------------------*/
	/*Function that handles sidebar, changes when resizing App                        */
	/*--------------------------------------------------------------------------------*/
	updateDimensions() {
		let element = document.getElementById('main-wrapper');
		this.setState({
			width: window.innerWidth
		});
		switch (this.props.settings.activeSidebarType) {
			case 'full':
			case 'iconbar':
				if (this.state.width < 1170) {
					element.setAttribute("data-sidebartype", "mini-sidebar");
					element.classList.add("mini-sidebar");
				} else {
					element.setAttribute("data-sidebartype", this.props.settings.activeSidebarType);
					element.classList.remove("mini-sidebar");
				}
				break;

			case 'overlay':
				if (this.state.width < 767) {
					element.setAttribute("data-sidebartype", "mini-sidebar");
				} else {
					element.setAttribute("data-sidebartype", this.props.settings.activeSidebarType);
				}
				break;

			default:
		}
	}
	/*--------------------------------------------------------------------------------*/
	/*Life Cycle Hook                                                                 */
	/*--------------------------------------------------------------------------------*/
	componentWillUnmount() {
		window.removeEventListener("load", this.updateDimensions);
		window.removeEventListener("resize", this.updateDimensions);
	}
	render() {
		/*--------------------------------------------------------------------------------*/
		/* Theme Setting && Layout Options wiil be Change From Here                       */
		/*--------------------------------------------------------------------------------*/
		return (
			<div>
				{LoadingComponent({isLoading: this.state.isLoading, error: null})}
				<div
					id="main-wrapper"
					dir={this.props.settings.activeDir}
					data-theme={this.props.settings.activeTheme}
					data-layout={this.props.settings.activeThemeLayout}
					data-sidebartype={this.props.settings.activeSidebarType}
					data-sidebar-position={this.props.settings.activeSidebarPos}
					data-header-position={this.props.settings.activeHeaderPos}
					data-boxed-layout={this.props.settings.activeLayout}
				>
					{/*--------------------------------------------------------------------------------*/}
					{/* Header                                                                         */}
					{/*--------------------------------------------------------------------------------*/}
					<Header />
					{/*--------------------------------------------------------------------------------*/}
					<div style={{marginTop: '64px'}}>
						<Switch>
							{landingRoutes.map((prop, key) => {
							if (prop.redirect)
								return (
								<Redirect from={prop.path} to={prop.pathTo} key={key} />
								);
							return (
								<Route path={prop.path} exact={prop.exact} component={prop.component} key={key} />
							);
							})}
						</Switch>
					</div>
					<Footer />
				</div>
			</div>
		);
	}
}
const mapStateToProps = state => ({
	...state,
	isLoading: state.settings.isLoading
});
export default connect(mapStateToProps)(LandingLayout);
