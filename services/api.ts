import { AxiosResponse } from "axios";
import axios from '../utils/axios';
import { UserDetails } from "@/models/auth";
import { authRoutes, imageRoutes } from "@/utils/constants";

export const login = async (
  userDetail: UserDetails
): Promise<AxiosResponse<any, any>> => {
  return axios.post(authRoutes.login, userDetail);
};
export const register = async (userDetail: UserDetails): Promise<AxiosResponse<any, any>> => {
  return axios.post(authRoutes.signup, userDetail);
};
export const validateToken = async (): Promise<AxiosResponse<any, any>> => {
  return axios.get(authRoutes.verify);
};
export const uploadImages = async (data: FormData): Promise<AxiosResponse<any, any>> => {
  return axios.post(imageRoutes.upload, data, { headers: { "content-type": "multipart/form-data" } });
};
export const getImages = async (): Promise<AxiosResponse<any, any>> => {
  return axios.get(imageRoutes.getImages);
};
