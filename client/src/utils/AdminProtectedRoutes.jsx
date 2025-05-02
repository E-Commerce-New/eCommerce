import {Navigate} from 'react-router-dom';

const ProtectedRoutes = ({children}) => {
    const user = localStorage.getItem('User');
    // console.log(JSON.parse(user))
    if (!user) return <Navigate to="/login"/>
    if (!JSON?.parse(user)?.user?.user?.isAdmin) return <Navigate to="/explore"/>
    return (
        children
    )
}

export default ProtectedRoutes;