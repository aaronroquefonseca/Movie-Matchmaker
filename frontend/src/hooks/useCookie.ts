import { useState } from "react";
import Cookies from "js-cookie";

const useCookies = (key: any, defaultValue:any) => {
    const [cookie, setCookieState] = useState(() => Cookies.get(key) || defaultValue);

    const setCookie = (value:any, options = {}) => {
        Cookies.set(key, value, options);
        setCookieState(value);
    };

    const removeCookie = () => {
        Cookies.remove(key);
        setCookieState(null);
    };

    return [cookie, setCookie, removeCookie];
};

export default useCookies;
