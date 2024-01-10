import {BaseService} from "./BaseService";
import axiosClient from "../axiosClient";

class FaucetService extends BaseService{
    path = () => 'chains';
    public async getRandomCode(address: string) {
        const response = await axiosClient.post('/user/get-code', {address});
        return response;
    }
    public async submit(address: string, signature: string, extension: string) {
        const response = await axiosClient.post('/faucet/submit-faucet', {
            address, signature, extension
        });
        return response;
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new FaucetService();  // Singleton
