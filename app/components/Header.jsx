import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../utils/Shims';

export default class Header extends PureComponent {

  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      navDrawerOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({ navDrawerOpen: !this.state.navDrawerOpen });
  }

  render() {
    return (
      <div>
        <div className="header" role="banner">
          <div className="header__logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <div className="header__nav-button">
            <button
              className={this.state.navDrawerOpen ?
              'hamburger hamburger__squeeze hamburger__squeeze--active' :
              'hamburger hamburger__squeeze'}
              onClick={this.handleClick}
            >
              <span className="hamburger__box">
                <span className="hamburger__inner" />
              </span>
            </button>
          </div>
          <nav
            className={this.state.navDrawerOpen ? 'header__nav header__nav--open' : 'header__nav header__nav--closed'}
            role="navigation"
          >
            <ul>
              <li><Link to="/cards">Cards</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
