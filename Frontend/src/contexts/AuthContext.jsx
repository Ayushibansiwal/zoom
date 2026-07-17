import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const client = axios.create({
  baseURL: "http://localhost:7000/users",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {

    const [userData, setUserData] = useState(null);

    const handleSignUp = async (username, email, password) => {
        try {
            let request = await client.post("/signup", {
                username: username,
                email: email,
                password: password,
            });

            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
            
        } catch (error) {
            throw error;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password,
            });

            if (request.status === httpStatus.OK) {
                setUserData(request.data.user);
                return request.data.message;
            }

        } catch (error) {
            throw error;
        }
    };

    const data = {
        userData,
        setUserData,
        handleSignUp,
        handleLogin,
    };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
