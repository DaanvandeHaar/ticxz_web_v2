import axios from "axios";
import {getAuth} from "firebase/auth";
import {firebaseApp} from "../../libs/firebase";

const auth = getAuth(firebaseApp);
class EventApi{
    async createEvent(event) {
        const idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'post',
            url: `http://localhost:8080/event`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
            data: event,
        };

        return await axios(config)
            .then(response => {
                console.log(response.data.event);
                return response.data.event
                })
            .catch(error => {
                throw error;
                }
            );
        }
    async updateEvent(event, eventId) {
        const idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'patch',
            url: `http://localhost:8080/event/${eventId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
            data: event,
        };
        console.log(config);
        return await axios(config)
            .then(response => {
                console.log(response.data.event);
                return response.data.event
            })
            .catch(error => {
                    throw error;
                }
            );
    }
    async myEvents() {
        var idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'get',
            url: 'http://localhost:8080/events',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
        };
        console.log("test");
        return await axios(config)
            .then(response => {
                if (!response.data.events) {
                    return []
                }
                return response.data.events
            })
            .catch(error => {
                    throw error
                }
            );

        }
    async getEvent(id) {
        var idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'get',
            url: `http://localhost:8080/event/${JSON.parse(id)}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
        };
        return await axios(config)
            .then(response => {
                console.log(response.data.event);
                return response.data.event
            })
            .catch(error => {
                    throw error
                }
            );
    }
    async eventUrlAvailable(url) {
        var idToken = await auth.currentUser.getIdToken( true)
            const config = {
                method: 'post',
                url: `http://localhost:8080/event/url`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                data: {"eventCustomUrl": url}
            }
            return await axios(config)
                .then(response => {
                    return response.data.available
                })
                .catch(error => {
                        throw error
                    }
                );
    }
    async getTicketTypes(id) {
        var idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'get',
            url: `http://localhost:8080/event/${id}/ticketTypes`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
        };
        return await axios(config)
            .then(response => {
                console.log(response.data.ticketTypes);
                return response.data.ticketTypes
            })
            .catch(error => {
                    throw error
                }
            );
    }

    async createTicketType(ticketType, eventId) {
        var idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'post',
            url: `http://localhost:8080/event/${eventId}/ticketType`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
            data: ticketType
        };
        return await axios(config)
            .then(response => {
                console.log(response.data.ticketType);
                return response.data.ticketType
            })
            .catch(error => {
                throw error
                }
            );
    }

    async updateTicketType(ticketType, eventId) {
        var idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'patch',
            url: `http://localhost:8080/event/${eventId}/ticketType/${ticketType.typeId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
            data: ticketType
        };
        return await axios(config)
            .then(response => {
                return response.data.ticketType
            })
            .catch(error => {
                    throw error
                }
            );
    }

    async deleteTicketType(eventId, ticketTypeId) {
        console.log(eventId, ticketTypeId)
        let idToken = await auth.currentUser.getIdToken( true)
        const config = {
            method: 'delete',
            url: `http://localhost:8080/event/${eventId}/ticketType/${ticketTypeId}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            },
        };
        return await axios(config)
            .then(response => {
                return response.data.deleted
            })
            .catch(error => {
                    throw error
                }
            );
    }


}
export const eventApi = new EventApi();
