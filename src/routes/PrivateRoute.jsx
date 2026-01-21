import React from 'react';
import { Navigate, useLocation } from 'react-router';
import Loading from '../shared/components/Loading';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({children}) => {
    const {user, loading} = useAuth();
    const location = useLocation();

    if(loading) {
        return <Loading/>;
    }

    if(!user){
        // Save current location and any search data
        const redirectPath = location.pathname + location.search;
        sessionStorage.setItem('redirectAfterLogin', redirectPath);
        
        // Save search data if on results page
        if (location.pathname === '/results' && location.state) {
            sessionStorage.setItem('busSearchData', JSON.stringify({
                ...location.state,
                timestamp: new Date().getTime()
            }));
        }
        
        return <Navigate to='/login' state={{ from: location }} replace/>;
    }
    
    return children;
};

export default PrivateRoute;