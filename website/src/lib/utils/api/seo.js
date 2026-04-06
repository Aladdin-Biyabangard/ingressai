import { customAxios } from "../../axios"


export const getSeoData = async (page,lang) =>{
    try{
        const res = await customAxios.get(`/v1/seo/${page}?lang=${lang.toUpperCase()}`);
        return res.data
    }catch(err){
        throw new Error(err)
    }

}