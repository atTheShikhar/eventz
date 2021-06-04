import React, { useState,useContext } from 'react'
import { UserContext } from '../../context/Context';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { logout } from '../../helpers/auth';
import {
    Menu,
    MenuItem,
    IconButton
} from '@material-ui/core';
import { useHistory } from 'react-router';


function UserMenu(props) {

    const [anchorEl, setAnchorEl] = useState(null);
    const { setUser } = useContext(UserContext);
    const history = useHistory();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    return (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                        handleClose();
                        history.push('/user/profile')
                    }}
                >
                    Profile
                </MenuItem>

                <MenuItem 
                    onClick={() => {
                        handleClose();
                        history.push('/user/myevents')
                    }}
                >
                    My Events
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        handleClose();
                        history.push('/user/mybookings')
                    }}
                >
                    My Bookings   
                </MenuItem>

                <MenuItem onClick={() => logout(setUser,history)}>Log Out</MenuItem>
            </Menu>
        </div>
    )
}

export default UserMenu
