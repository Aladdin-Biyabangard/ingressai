import { quizAxios } from "../../axios"


export const getCategories = async (number = 0 ,size = 100) =>{
    try{
        const res = await quizAxios.get(`/v1/categories?page=${number}&size=${size}`);
        return res.data
    }catch(err){
        throw new Error(err)
    }

}