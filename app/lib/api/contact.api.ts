import api from "../api";

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const contactApi = {
  submit: async (payload: ContactPayload) => {
    const res = await api.post("/leads/contact", payload);
    return res.data;
  },
};
