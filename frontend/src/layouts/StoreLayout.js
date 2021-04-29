import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from "react-router-dom";
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './store-layout/header/header';
import Sidebar from './store-layout/sidebar/sidebar';
import Footer from './store-layout/footer/footer';
import StoreRoutes from '../routes/router';
import Menu from './store-layout/sidebar/menu';
import LoadingComponent from './loader/Loader';


class StoreLayout extends React.Component {
	constructor(props) {
		super(props);
		this.updateDimensions = this.updateDimensions.bind(this);
		this.state = {
			isOpen: false,
			width: window.innerWidth,
			isLoading: this.props.isLoading,
			userInfo: null,
		};

		this.props.history.listen((location, action) => {
			if (window.innerWidth < 767 &&
				document.getElementById('main-wrapper').className.indexOf("show-sidebar") !== -1) {
					document.getElementById('main-wrapper').classList.toggle("show-sidebar");
				}
		});
	}

	componentWillReceiveProps(newProps) {
      if (newProps.isLoading!==this.props.isLoading){
        this.setState({isLoading: newProps.isLoading});
      }
      if (newProps.userInfo!==this.props.userInfo){
        this.setState({userInfo: newProps.userInfo});
        if (newProps.userInfo && newProps.userInfo.status !==3) {
        	this.props.history.push('/s/complete-profile')
				}
      }
   }
	/*--------------------------------------------------------------------------------*/
	/*Life Cycle Hook, Applies when loading or resizing App                           */
	/*--------------------------------------------------------------------------------*/
	componentDidMount() {
		window.addEventListener("load", this.updateDimensions);
		window.addEventListener("resize", this.updateDimensions);
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
					{/* Sidebar                                                                        */}
					{/*--------------------------------------------------------------------------------*/}
					{
						this.props.userInfo && this.props.userInfo.status === 3 && <Sidebar {...this.props} routes={Menu} />
					}
					{/*--------------------------------------------------------------------------------*/}
					{/* Page Main-Content                                                              */}
					{/*--------------------------------------------------------------------------------*/}
					<div className={`page-wrapper d-block ${(this.props.userInfo && this.props.userInfo.status !== 3) && 'block-sidebar'}`}>
						<div className="page-content container-fluid">
							<Switch>
								{StoreRoutes.map((prop, key) => {
									if (prop.navlabel) {
										return null;
									}
									else if (prop.collapse) {
										return prop.child.map((prop2, key2) => {
											if (prop2.collapse) {
												return prop2.subchild.map((prop3, key3) => {
													return (
														<Route path={prop3.path} component={prop3.component} key={key3} />
													);
												});
											}
											return (
												<Route path={prop2.path} component={prop2.component} key={key2} />
											);
										});
									}
									else if (prop.redirect) {
										return <Redirect from={prop.path} to={prop.pathTo} key={key} />;
									}
									else {
										return (
											<Route path={prop.path} component={prop.component} key={key} />
										);
									}
								})}
							</Switch>
						</div>
						<Footer />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	...state,
	isLoading: state.settings.isLoading,
	userInfo: state.auth.userInfo
});

export default withRouter(connect(mapStateToProps)(StoreLayout));
