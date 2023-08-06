import axios from "axios";

const http = axios.create({
    baseURL: 'https://site-de-rifas-0c8b9c43956a.herokuapp.com'
})

export default http