import axiosClient from "../axiosClient";
import {ResponseDataType} from "../../types/dataType";
type Params = {
    filters: any,
    populate?: any,
    pagination?: {
        page?: number,
        limit?: number
    },
    sort?: any

}

export class BaseService {
    path = () => '';
    async find(filters: any, populate: string| any | null = null, pagination: {page?: number, limit?: number} | null = null, sort: any = null) {
        const params: Params = {filters: filters}
        if (populate){
            params.populate = populate
        }
        if (pagination){
            params.pagination = pagination
        }
        if (sort){
            params.sort = sort
        }
        const config = {
            params
        }

        const data: ResponseDataType = await axiosClient.get(`/api/${this.path()}`, config);
        return data;
    }
}
