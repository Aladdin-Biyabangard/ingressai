import { quizAxios } from "../../axios"


export const getCustomers = async (number = 0 ,size = 100) =>{
    try{
        const res = await quizAxios.get(`/v1/partner/list?page=${number}&size=${size}`);
        return res.data
    }catch(err){
        throw new Error(err)
    }

}