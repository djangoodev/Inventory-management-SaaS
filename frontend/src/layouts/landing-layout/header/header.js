import React from 'react';
import { connect } from 'react-redux';
import {
	Nav,
	NavItem,
	NavLink,
	Button,
	Navbar,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';
import logodarktext from "../../../assets/images/logo-light-icon.png";
import s_w_logo__icon from "../../../assets/images/logo/s_w_logo-icon.png"
import s_w_logo__text from "../../../assets/images/logo/s_w_logo-text.png"
import ApiConfig from '../../../config/ApiConfig';

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/

const mapStateToProps = state => ({
	...state
});

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.toggle = this.toggle.bind(this);
		this.showMobilemenu = this.showMobilemenu.bind(this);
		this.sidebarHandler = this.sidebarHandler.bind(this);
		this.state = {
			isOpen: false,
			isLocal: process.env.NODE_ENV !== 'production',
		};
	}
	/*--------------------------------------------------------------------------------*/
	/*To open NAVBAR in MOBILE VIEW                                                   */
	/*--------------------------------------------------------------------------------*/
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}
	/*--------------------------------------------------------------------------------*/
	/*To open SIDEBAR-MENU in MOBILE VIEW                                             */
	/*--------------------------------------------------------------------------------*/
	showMobilemenu() {
		document.getElementById('main-wrapper').classList.toggle('show-sidebar');
	}
	sidebarHandler = () => {
		let element = document.getElementById('main-wrapper');
		switch (this.props.settings.activeSidebarType) {
			case 'full':
			case 'iconbar':
				element.classList.toggle('mini-sidebar');
				if (element.classList.contains('mini-sidebar')) {
					element.setAttribute('data-sidebartype', 'mini-sidebar');					
				} else {
					element.setAttribute(
						'data-sidebartype',
						this.props.settings.activeSidebarType
					);					
				}
				break;

			case 'overlay':
			case 'mini-sidebar':
				element.classList.toggle('full');
				if (element.classList.contains('full')) {
					element.setAttribute('data-sidebartype', 'full');					
				} else {
					element.setAttribute(
						'data-sidebartype',
						this.props.settings.activeSidebarType
					);					
				}
				break;
			default:
		}
	};

	render() {
		const { isLocal } = this.state;
		return (
			<header className="topbar navbarbg" data-navbarbg={this.props.settings.activeNavbarBg}>
				<Navbar className="top-navbar navbar-dark skin6 landing-header" expand="md">
					<a href={isLocal ? '/' : ApiConfig.serverProURL}><img src={s_w_logo__icon} alt="homepage" className="dark-logo" /><img src={s_w_logo__text} alt="homepage" className="dark-logo" /></a>
					<Nav className="float-left" navbar>
						{/*--------------------------------------------------------------------------------*/}
						{/* Start Create New Dropdown                                                      */}
						{/*--------------------------------------------------------------------------------*/}
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav>
								Our Services <i className="fa fa-angle-down" />
							</DropdownToggle>
							<DropdownMenu>
								<DropdownItem>Online Marketing</DropdownItem>
								<DropdownItem>Vendor Panel</DropdownItem>
								<DropdownItem>Store</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
						{/*--------------------------------------------------------------------------------*/}
						{/* End Create New Dropdown                                                        */}
						{/*--------------------------------------------------------------------------------*/}
					</Nav>
					<Nav className="ml-auto float-right" navbar>
						{/*--------------------------------------------------------------------------------*/}
						{/* Start Profile Dropdown                                                         */}
						{/*--------------------------------------------------------------------------------*/}
						<NavItem>
							{
								isLocal ?
									<NavLink href="/login">Login</NavLink>
									:
									<NavLink href={ApiConfig.accountProUrl + '/login'}>Login</NavLink>
							}
						</NavItem>
						<Button
							color="success"
							className="btn-rectangle ml-3 mb-2 mt-2"
						>
							<NavLink href="/switch">Get Start</NavLink>
						</Button>
						{/*--------------------------------------------------------------------------------*/}
						{/* End Profile Dropdown                                                           */}
						{/*--------------------------------------------------------------------------------*/}
					</Nav>
				</Navbar>
			</header>
		);
	}
}
export default connect(mapStateToProps)(Header);
