import axios from "axios";
import {getAuth} from "firebase/auth";
import {firebaseApp} from "../../libs/firebase";

const auth = getAuth(firebaseApp);

class StripeApi{

    async onboardUser() {
        const idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'post',
            url: 'http://localhost:8080/stripe/onboarding',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        };
        return await axios(config)
            .then(response => {
                return response.data.url
            })
            .catch(error => {
                    throw error
                }
            );

    }

    async onboardUserRefresh() {
        const idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'post',
            url: 'http://localhost:8080/stripe/onboarding/refresh',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        };
        return await axios(config)
            .then(response => {
                return response.data.url
            })
            .catch(error => {
                    throw error
                }
            );

    }

}


export const stripeApi = new StripeApi();