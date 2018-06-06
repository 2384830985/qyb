import axios from 'axios'

const req = axios.create({
    timeout: 15000
})

const request = (config) => {
    return req.request(config)
        .then(res => {
            return res.data
        })
        .catch(error => {
            console.log(error)
        })
}
export default request