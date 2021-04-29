import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Nav, Collapse } from 'reactstrap';
import PerfectScrollbar from 'react-perfect-scrollbar'

const mapStateToProps = state => ({
	...state
});

class Sidebar extends React.Component {

	constructor(props) {
		super(props);
		this.expandLogo = this.expandLogo.bind(this);
		this.activeRoute.bind(this);
		this.state = {
			authentication: this.activeRoute("/authentication") !== "" ? true : false,
			uicomponents: this.activeRoute("/ui-components") !== "" ? true : false,
			samplepages: this.activeRoute("/sample-pages") !== "" ? true : false,
			dashboardpages: this.activeRoute("/dahboards") !== "" ? true : false,
			iconsPages: this.activeRoute("/icons") !== "" ? true : false,
			formlayoutPages: this.activeRoute("/form-layouts") !== "" ? true : false,
			formpickerPages: this.activeRoute("/form-pickers") !== "" ? true : false,
		};
	}
	/*--------------------------------------------------------------------------------*/
	/*To Expand SITE_LOGO With Sidebar-Menu on Hover                                  */
	/*--------------------------------------------------------------------------------*/
	expandLogo() {
		document.getElementById("logobg").classList.toggle("expand-logo");
	}
	/*--------------------------------------------------------------------------------*/
	/*Verifies if routeName is the one active (in browser input)                      */
	/*--------------------------------------------------------------------------------*/
	activeRoute(routeName) { return this.props.location.pathname.indexOf(routeName) > -1 ? 'selected' : ''; }

	render() {
		return (
			<aside className="left-sidebar" id="sidebarbg" data-sidebarbg={this.props.settings.activeSidebarBg} onMouseEnter={this.expandLogo} onMouseLeave={this.expandLogo}>
				<div className="scroll-sidebar">
					<PerfectScrollbar className="sidebar-nav">
						{/*--------------------------------------------------------------------------------*/}
						{/* Sidebar Menus will go here                                                */}
						{/*--------------------------------------------------------------------------------*/}
						<Nav id="sidebarnav">
							{this.props.routes.map((prop, key) => {
								if (prop.redirect) {
									return null;
								}
								else if (prop.navlabel) {
									return (
										<li className="nav-small-cap" key={key}>
											<i className={prop.icon}></i>
											<span className="hide-menu">{prop.name}</span>
										</li>
									);
								}
								else if (prop.collapse) {
									let firstdd = {};
									firstdd[prop["state"]] = !this.state[prop.state];
									return (
										/*--------------------------------------------------------------------------------*/
										/* Menus wiil be goes here                                                        */
										/*--------------------------------------------------------------------------------*/
										<li className={this.activeRoute(prop.path) + ' sidebar-item'} key={key}>
											<span data-toggle="collapse" className="sidebar-link has-arrow" aria-expanded={this.state[prop.state]} onClick={() => this.setState(firstdd)} >
												<i className={prop.icon} />
												<span className="hide-menu">{prop.name}</span>
											</span>
											{/*--------------------------------------------------------------------------------*/}
											{/* Sub-Menus wiil be goes here                                                    */}
											{/*--------------------------------------------------------------------------------*/}
											<Collapse isOpen={this.state[prop.state]}>
												<ul className="first-level">
													{prop.child.map((prop, key) => {
														if (prop.redirect) return null;
														if (prop.collapse) {
															let seconddd = {};
															seconddd[prop["state"]] = !this.state[prop.state];
															return (
																<li className={this.activeRoute(prop.path) + ' sidebar-item'} key={key} >
																	<span data-toggle="collapse" className="sidebar-link has-arrow" aria-expanded={this.state[prop.state]} onClick={() => this.setState(seconddd)} >
																		<i className={prop.icon} />
																		<span className="hide-menu">{prop.name}</span>
																	</span>
																	{/*--------------------------------------------------------------------------------*/}
																	{/* Sub-Menus wiil be goes here                                                    */}
																	{/*--------------------------------------------------------------------------------*/}
																	<Collapse isOpen={this.state[prop.state]}>
																		<ul className="second-level">
																			{prop.subchild.map((prop, key) => {
																				if (prop.redirect) return null;
																				return (
																					<li className={this.activeRoute(prop.path) + ' sidebar-item'} key={key} >
																						<NavLink to={prop.path} activeClassName="active" className="sidebar-link">
																							<i className={prop.icon} />
																							<span className="hide-menu">{prop.name}</span>
																						</NavLink>
																					</li>
																				);
																			})}
																		</ul>
																	</Collapse>
																</li>
															);
														}
														return (
															/*--------------------------------------------------------------------------------*/
															/* Adding Sidebar Item                                                            */
															/*--------------------------------------------------------------------------------*/
															<li className={this.activeRoute(prop.path) + (prop.pro ? ' active active-pro' : '') + ' sidebar-item'} key={key}>
																<NavLink to={prop.path} className="sidebar-link" activeClassName="active">
																	<i className={prop.icon} />
																	<span className="hide-menu">{prop.name}</span>
																</NavLink>
															</li>
														);
													})}
												</ul>
											</Collapse>
										</li>
									);
								}
								else {
									return (
										/*--------------------------------------------------------------------------------*/
										/* Adding Sidebar Item                                                            */
										/*--------------------------------------------------------------------------------*/
										<li className={this.activeRoute(prop.path) + (prop.pro ? ' active active-pro' : '') + ' sidebar-item'} key={key}>
											<NavLink to={prop.path} className="sidebar-link" activeClassName="active">
												<i className={prop.icon} />
												<span className="hide-menu">{prop.name}</span>
											</NavLink>
										</li>
									);
								}
							})}
						</Nav>
					</PerfectScrollbar>
				</div>
			</aside>
		);
	}
}
export default connect(mapStateToProps)(Sidebar);
