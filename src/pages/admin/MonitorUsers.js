import React, { useContext,useEffect, useState } from 'react'
import { ComponentContext } from '../../context/Context'
import useStyles from './Styles';
import {Container,Divider} from '@material-ui/core';
import { fetchDataAuth } from '../../helpers/fetchData';
import CustomTable from '../../components/dataDisplay/CustomTable'
import { useHistory } from 'react-router';
import { submitFormdata } from '../../helpers/submitFormdata';
import NotFound from '../../components/NotFound';
import CustomDialog from '../../components/feedback/CustomDialog';

const headerArray = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'createdEventsCount', label: 'Events Created'},
    { id: 'bookedEventsCount', label: 'Events Booked'},
    { id: 'actions', label: 'Actions' },
];
const dataNameArray = headerArray
    .map(header => (header.id))
    .filter(header => (header !== 'actions'));

function MonitorUsers() {
    const [userdata,setUserdata] = useState(null);
    const {setFeedback,setDialog,setButtonDisabled} = useContext(ComponentContext);
    const classes = useStyles();
    const history = useHistory();
    useEffect(() => {
        const getUsers = async () => {
            const url = '/api/admin/users';
            const data = await fetchDataAuth(url,setFeedback,history,null);
            const usr = data.users.map(item => ({
                ...item,
                createdEventsCount: item.createdEvents.length,
                bookedEventsCount: item.bookedEvents.length
            }))
            setUserdata(usr);
        }
        getUsers();
    },[])
        
    const deleteHandler = async (item) => {
        async function actionYes() {
            const url = "/api/admin/delete/user"
            const status = await submitFormdata({id: item._id},
                history,setFeedback,setButtonDisabled,url,null
            ) 
            if(status === "success")
            {
                const updatedUserdata = userdata.filter(user => item._id !== user._id);
                setUserdata(updatedUserdata);         
            }
        }
        setDialog({
            open: true,
            title: "Comfirm Deletion",
            message: "Are you sure you want to delete this user?",
            actionYes: actionYes,
            actionNo: function() {
            }
        });
    }
    const viewHandler = (item) => {
        history.push(`/admin/user/${item._id}`,item) 
    }

    return (
        <div className={classes.bgColor}>
            <Container maxWidth="lg" className={`${classes.vpadding}`}>
                <h1>Users</h1>
            </Container>

            <Divider variant="middle" className={classes.vmargin} />
            
            <Container maxWidth="lg">
            {
                (userdata!==null && userdata.length!==0 )? 
                (<CustomTable 
                    headerArray={headerArray}
                    dataNameArray={dataNameArray}
                    dataArray={userdata}
                    actions={[
                        {
                            name: "View",
                            clickHandler: viewHandler
                        },
                        {
                            name: "Delete",
                            clickHandler: deleteHandler
                        }
                    ]}
                />) :
                (
                    <NotFound/>
                )
            }        
            </Container>
        </div>
    )
}

export default MonitorUsers
