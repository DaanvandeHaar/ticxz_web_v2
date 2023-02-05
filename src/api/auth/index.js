import {getAuth} from "firebase/auth";
import {firebaseApp} from "../../libs/firebase";
import axios from "axios";


const auth = getAuth(firebaseApp);
const users = [
  {
    id: '5e86809283e28b96d2d38537',
    avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
    email: 'demo@devias.io',
    name: 'Anika Visser',
    password: 'Password123!',
    plan: 'Premium'
  }
];

class AuthApi {

  async register({ email, password, confirmPassword }) {
      const config = {
        method: 'post',
        url: `http://localhost:8080/signup`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
              },
      };

      return await axios(config)
          .then(response => {
            return response.data.token
          })
          .catch( error => {
              throw error.response.data

          });
    }


}

export const authApi = new AuthApi();
