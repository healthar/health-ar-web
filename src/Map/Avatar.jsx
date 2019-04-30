import React from 'react';
import './Avatar.scss';

const avatarImg = require('assets/profile_avatar@0.5x.png');

class Avatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuVisibility: false
        }
    }

    toggleMenu = () => {
        this.setState({ menuVisibility: this.state.menuVisibility ? false : true })
    }

    render() {
        let { menuVisibility } = this.state;

        return (
            <section className='avatar-container' onClick={() => this.toggleMenu()}>
                <img src={avatarImg} alt="avatar" className="avatar-img" />
                {
                    menuVisibility && (
                        <div className='menu-container'>
                            <button onClick={() => this.props.logout()} className='menu-btn'>
                                Log Out
                            </button>
                        </div>
                    )
                }
            </section>
        )
    }
}


export default Avatar;