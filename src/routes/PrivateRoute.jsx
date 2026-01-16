import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Loading from '../shared/components/Loading';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({children}) => {
    const {user , loading} = useAuth()
    const location = useLocation();

    if(loading) {
        return <Loading/>
    }

    if(!user){
        return <Navigate state={{from: location.pathname}} to='/login' replace/>
    }
    return children;
};

export default PrivateRoute;