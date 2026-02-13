import api from "./api";

export const getSubjectsByClass = async (classGrade: string) => {
  const res = await api.get(`/syllabus/subjects/${classGrade}`);
  return res.data;
};
export const getAllSubjects = async () => {
  const res = await api.get("/syllabus/subjects");
  return res.data;
};

export const createSubject = async (data: any) => {
  const res = await api.post("/syllabus/subjects", data);
  return res.data;
};

export const getMaterialsBySubject = async (subjectId: number) => {
  const res = await api.get(`/syllabus/materials/subject/${subjectId}`);
  return res.data;
};

export const uploadMaterial = async (data: any) => {
  const res = await api.post("/syllabus/materials", data);
  return res.data;
};
