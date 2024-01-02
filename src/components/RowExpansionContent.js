import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { Button } from "primereact/button";
import StudentTPsChart from "./StudentTPsChart";

const RowExpansionContent = ({ studentId, showDialog }) => {
  const [pws, setPws] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/students/studentpws/${studentId}`
        );
        setPws(response.data);
      } catch (error) {}
    };

    fetchData();
  }, [studentId]);

  const fetchStudentPWImages = async (studentId, pwId) => {
    try {
      const response = await axios.get(
        `/api/studentpws/image/${studentId}/${pwId}`
      );
      const imagesData = response.data;
      showDialog(imagesData);
    } catch (error) {}
  };

  const onPWClickHandle = (pwId) => {
    fetchStudentPWImages(studentId, pwId);
  };

  return (
    <div>
      {pws.map((pw) => (
        <Button
          label={pw.pw.title}
          outlined
          key={pw.pw.id}
          onClick={() => onPWClickHandle(pw.pw.id)}
        />
      ))}
      <StudentTPsChart pws={pws} />
    </div>
  );
};

export default RowExpansionContent;
