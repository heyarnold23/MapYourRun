import React, { useState, useEffect } from 'react';
import {useSelector, useDispatch} from "react-redux"
import { getFriends, getPendingFriends, acceptFriend, denyFriend, removeFriend} from '../../store/social';


const Social = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.social.friends)
    const pendingFriends = useSelector(state=>state.social.pending_friends)

    useEffect(()=>{
        dispatch(getFriends(currentUser.id))
        dispatch(getPendingFriends(currentUser.id))
    },[])

const acceptClick = (pendingFriendId) => {
    dispatch(acceptFriend(currentUser.id,pendingFriendId))
    //need to dispatch, delete pending friends entry, add friends entry
}
const denyClick = (pendingFriendId) => {
    dispatch(denyFriend(currentUser.id,pendingFriendId))
    //need to dispatch, delete pending friends entry
}

const removeFriendClick = (friendId) => {
    dispatch(removeFriend(currentUser.id,friendId))
}

return (
    <>
        <h1>Friend Requests</h1>
            {pendingFriends.map(pendingFriend=>{
                return (<div>
                    {pendingFriend.username}
                    <button onClick = {()=>acceptClick(pendingFriend.id)}>Accept</button>
                    <button onClick = {()=>denyClick(pendingFriend.id)}>Deny</button>
                </div>)
            })}
        <h1>Friends</h1>
            {friends.map(friend=>{
                return (<div>
                    {friend.username}
                    <button onClick = {()=>removeFriendClick(friend.id)}>Remove Friend</button>
                </div>)
            })}
    </>
)

}

export default Social
