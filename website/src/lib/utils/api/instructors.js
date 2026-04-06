import { quizAxios } from "../../axios"


export const getInstructors = async (number = 0 ,size = 100) =>{
    try{
        const res = await quizAxios.get(`/v1/teams?page=${number}&size=${size}`);
        return res.data
    }catch(err){
        throw new Error(err)
    }

}