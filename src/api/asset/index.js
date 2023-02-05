
import {getAuth} from "firebase/auth";
import {firebaseApp} from "../../libs/firebase";
import axios from "axios";

const auth = getAuth(firebaseApp);


class AssetApi {
    async setLogo(logo, id) {
        console.log(logo, id)
        var idToken = await auth.currentUser.getIdToken( true)
        let formData = new FormData();
        formData.append(
            "logoFile",
            logo
        );
        const config = {
            method: 'post',
            url: `http://localhost:8080/asset/logo/${id}`,
            headers: {
                'Content-Type': 'image/png',
                'Authorization' : `Bearer ${idToken}`
            },
            data: formData,
        };
        return await axios(config)
            .then(response => {
                return response.data.message
            })
            .catch(error => {
                    throw error;
                }
            );
    }

    async getLogo(id) {
        const idToken = localStorage.getItem('idToken');
        const config = {
            method: 'get',
            url: `http://localhost:8080/asset/logo/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            }
        };
        return await axios(config)
            .then(response => {
                return new File([response.data], "logoFile" ,{type: "image/png"})
            })
            .catch(error => {
                    throw error;
                }
            );
    }

    async removeLogo(id) {
        const idToken = await auth.currentUser.getIdToken(true)
        const config = {
            method: 'delete',
            url: `http://localhost:8080/asset/logo/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            }
        };
        return await axios(config)
            .then(response => {
                return true
            })
            .catch(response => {
                throw response.data.error
            })
    }

    async setBanner(banner, id) {
        console.log(banner, id)
        const idToken = await auth.currentUser.getIdToken( true)
        let formData = new FormData();
        formData.append(
            "bannerFile",
            banner
        );
        const config = {
            method: 'post',
            url: `http://localhost:8080/asset/banner/${id}`,
            headers: {
                'Content-Type': 'image/jpeg',
                'Authorization' : `Bearer ${idToken}`
            },
            data: formData,
        };
        return await axios(config)
            .then(response => {
                return response.data.message
            })
            .catch(error => {
                    throw error;
                }
            );
    }
    async getBanner(id) {
        const idToken = await auth.currentUser.getIdToken(true)
        const config = {
            method: 'get',
            url: `http://localhost:8080/asset/banner/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            }
        };
        return await axios(config)
            .then(response => {
                return new File([response.data], "bannerFile" ,{type: "image/png"})
            })
            .catch(error => {
                    throw error;
                }
            );
    }
    async removeBanner(id) {
        const idToken = await auth.currentUser.getIdToken(true)
        const config = {
            method: 'delete',
            url: `http://localhost:8080/asset/banner/${id}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${idToken}`
            }
        };
        return await axios(config)
            .then(response => {
                return true
            })
            .catch(e => {
                throw e
            })
    }
}

export const assetApi = new AssetApi();