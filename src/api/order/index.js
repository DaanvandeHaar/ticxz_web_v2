import axios from "axios";
import {getAuth} from "firebase/auth";
import {firebaseApp} from "../../libs/firebase";

const auth = getAuth(firebaseApp);


class OrderApi {
    async getOrdersForEvent(eventId) {
        var idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'get',
            url: `http://localhost:8080/orders/${eventId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
        };
        return await axios(config)
            .then(response => {
                console.log(response.data.orders)
                return response.data.orders || []
            })
            .catch(error => {
                    throw error
                }
            );

    }
}

export const orderApi = new OrderApi()