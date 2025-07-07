import api from '../api/axios'

const login = async (username, password) => {
  const response = await api.post('/Login/login', { username, password })
  return response.data.token
}

export default { login }
    