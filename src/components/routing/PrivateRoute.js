import { Redirect, Route, useLocation } from 'react-router';

const PrivateRoute = ({ path, component: Component, ...rest }) => {
    const location = useLocation();

    if (location.pathname !== '/' && location.pathname !== '/emailverify' && location.pathname !== '/kyc')
        return <Redirect to="/" />;

    return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PrivateRoute;
