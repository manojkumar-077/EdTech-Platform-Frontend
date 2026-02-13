import api from "./api";

export const getQuizzesByClass = async (classGrade: string) => {
  const res = await api.get(`/admin/quizzes/${classGrade}`);
  return res.data;
};

export const createQuiz = async (data: any) => {
  const res = await api.post("/admin/quizzes", data);
  return res.data;
};

export const startQuiz = async (quizId: number) => {
  const res = await api.post(`/student/quizzes/${quizId}/start`);
  return res.data;
};

export const submitQuiz = async (quizId: number, data: any) => {
  const res = await api.post(`/student/quizzes/${quizId}/submit`, data);
  return res.data;
};
